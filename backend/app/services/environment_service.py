"""Environment Service — Real-time weather & air quality from free public APIs.

Data Sources:
  - Weather: Open-Meteo API (https://open-meteo.com/) — FREE, no API key
  - AQI: Open-Meteo Air Quality API — FREE, no API key
"""

import httpx
from typing import Any, Dict, Optional
from datetime import datetime, timezone
import asyncio
import logging

logger = logging.getLogger(__name__)

# City coordinates for the 4 platform cities
CITY_COORDS: Dict[str, Dict[str, float]] = {
    "vadodara": {"lat": 22.3072, "lng": 73.1812},
    "mumbai": {"lat": 18.9388, "lng": 72.8354},
    "bengaluru": {"lat": 12.9716, "lng": 77.5946},
    "delhi": {"lat": 28.6139, "lng": 77.2090},
}

CITY_DISPLAY_NAMES: Dict[str, str] = {
    "vadodara": "Vadodara",
    "mumbai": "Mumbai",
    "bengaluru": "Bengaluru",
    "delhi": "Delhi",
}

# WMO Weather interpretation codes -> human-readable condition
WMO_CODES: Dict[int, str] = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    80: "Slight showers",
    81: "Moderate showers",
    82: "Violent showers",
    95: "Thunderstorm",
    96: "Thunderstorm w/ hail",
    99: "Thunderstorm w/ heavy hail",
}


def _aqi_category(pm25: float) -> str:
    """Convert PM2.5 concentration (µg/m³) to AQI category per Indian NAQS."""
    if pm25 <= 30:
        return "Good"
    elif pm25 <= 60:
        return "Satisfactory"
    elif pm25 <= 90:
        return "Moderate"
    elif pm25 <= 120:
        return "Poor"
    elif pm25 <= 250:
        return "Very Poor"
    else:
        return "Severe"


def _pm25_to_aqi(pm25: float) -> int:
    """Convert PM2.5 (µg/m³) to approximate Indian AQI value."""
    if pm25 <= 30:
        return int(pm25 * 50 / 30)
    elif pm25 <= 60:
        return int(50 + (pm25 - 30) * 50 / 30)
    elif pm25 <= 90:
        return int(100 + (pm25 - 60) * 100 / 30)
    elif pm25 <= 120:
        return int(200 + (pm25 - 90) * 100 / 30)
    elif pm25 <= 250:
        return int(300 + (pm25 - 120) * 100 / 130)
    else:
        return min(500, int(400 + (pm25 - 250) * 100 / 130))


async def _fetch_weather(lat: float, lng: float) -> Dict[str, Any]:
    """Fetch current weather from Open-Meteo (FREE, no API key)."""
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lng}"
        f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m"
    )
    async with httpx.AsyncClient(timeout=8.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.json()

async def _fetch_air_quality(lat: float, lng: float) -> Dict[str, Any]:
    """Fetch current air quality from Open-Meteo Air Quality API (FREE, no API key)."""
    url = (
        f"https://air-quality-api.open-meteo.com/v1/air-quality"
        f"?latitude={lat}&longitude={lng}"
        f"&current=pm2_5,pm10,us_aqi"
    )
    async with httpx.AsyncClient(timeout=8.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.json()

async def get_city_environment(city_key: str) -> Dict[str, Any]:
    """
    Get real-time environment data for a city.
    Returns weather (temperature, humidity, wind, condition) and air quality (AQI, PM2.5, PM10).
    All data from free public APIs - no API keys required.
    """
    city = city_key.lower().strip()
    coords = CITY_COORDS.get(city)
    if not coords:
        return {
            "error": f"Unknown city: {city}. Supported: {', '.join(CITY_COORDS.keys())}",
            "supported_cities": list(CITY_COORDS.keys()),
        }

    lat, lng = coords["lat"], coords["lng"]
    display_name = CITY_DISPLAY_NAMES.get(city, city.title())

    # Fetch weather and air quality in parallel
    weather_data: Optional[Dict] = None
    air_data: Optional[Dict] = None

    try:
        weather_result, air_result = await asyncio.gather(
            _fetch_weather(lat, lng),
            _fetch_air_quality(lat, lng),
            return_exceptions=True,
        )
        if not isinstance(weather_result, Exception):
            weather_data = weather_result
        else:
            logger.warning(f"Weather API failed for {city}: {weather_result}")

        if not isinstance(air_result, Exception):
            air_data = air_result
        else:
            logger.warning(f"Air quality API failed for {city}: {air_result}")
    except Exception as e:
        logger.error(f"Environment fetch failed for {city}: {e}")

    # Parse weather
    current_weather = weather_data.get("current", {}) if weather_data else {}
    temperature = current_weather.get("temperature_2m")
    wind_speed = current_weather.get("wind_speed_10m")
    weather_code = current_weather.get("weather_code", 0)
    condition = WMO_CODES.get(weather_code, "Unknown")
    humidity = current_weather.get("relative_humidity_2m")
    apparent_temp = current_weather.get("apparent_temperature")

    # Parse air quality
    current_air = air_data.get("current", {}) if air_data else {}
    pm25 = current_air.get("pm2_5")
    pm10 = current_air.get("pm10")
    us_aqi = current_air.get("us_aqi")

    # Calculate Indian AQI from PM2.5 if available
    aqi_value = None
    aqi_status = "Unavailable"
    if pm25 is not None:
        aqi_value = _pm25_to_aqi(pm25)
        aqi_status = _aqi_category(pm25)
    elif us_aqi is not None:
        aqi_value = us_aqi
        aqi_status = _aqi_category(us_aqi * 0.5)  # rough approximation

    return {
        "city_id": city,
        "city_name": display_name,
        "weather": {
            "temperature_c": temperature,
            "apparent_temperature_c": apparent_temp,
            "condition": condition,
            "weather_code": weather_code,
            "humidity_percent": humidity,
            "wind_speed_kmh": wind_speed,
        },
        "air_quality": {
            "aqi": aqi_value,
            "status": aqi_status,
            "pm25": pm25,
            "pm10": pm10,
        },
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "data_sources": {
            "weather": "Open-Meteo (open-meteo.com)",
            "air_quality": "Open-Meteo Air Quality API",
        },
    }
