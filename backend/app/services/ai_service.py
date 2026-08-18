"""Grok (xAI) AI Service for civic intelligence, categorization, and copilot reasoning."""

import os
import json
import logging
import httpx
from typing import Any
from app.core.config import settings

logger = logging.getLogger("janmind.grok")


class GrokAIService:
    """Service to interact with xAI Grok models (grok-beta, grok-2)."""

    def __init__(self):
        self.api_key = settings.xai_api_key or settings.grok_api_key or os.getenv("XAI_API_KEY") or os.getenv("GROK_API_KEY")
        self.base_url = settings.grok_base_url.rstrip("/")
        self.model = settings.grok_model or "grok-beta"

    @property
    def is_configured(self) -> bool:
        """Return True if xAI Grok API key is configured."""
        return bool(self.api_key and self.api_key.strip())

    async def analyze_complaint(
        self,
        title: str,
        description: str,
        category_hint: str | None = None
    ) -> dict[str, Any]:
        """
        Use Grok to analyze a citizen's complaint for structured categorization,
        severity assessment (1-10), risk score (1-100), and municipal department routing.
        """
        if not self.is_configured:
            logger.info("Grok API key not provided; using intelligent local heuristic engine.")
            return self._local_complaint_heuristic(title, description, category_hint)

        system_prompt = (
            "You are JANMIND Civic AI, powered by Grok. You analyze citizen municipal complaints in India.\n"
            "Respond ONLY with a valid JSON object with the following schema:\n"
            "{\n"
            '  "category": "road_damage | water_supply | garbage_collection | drainage | street_lighting | electricity | sanitation",\n'
            '  "severity_score": <int 1-10>,\n'
            '  "risk_score": <int 1-100>,\n'
            '  "priority": "low | medium | high | urgent",\n'
            '  "department_slug": "roads | water_supply | sanitation | drainage | electricity | public_works",\n'
            '  "summary": "<1-sentence summary>",\n'
            '  "suggested_action": "<action for contractor or municipality>"\n'
            "}"
        )

        user_content = f"Title: {title}\nDescription: {description}\nCategory Hint: {category_hint or 'None'}"

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_content},
                        ],
                        "temperature": 0.2,
                        "response_format": {"type": "json_object"},
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    return json.loads(content)
                else:
                    logger.warning(f"Grok API returned {response.status_code}: {response.text}")
        except Exception as e:
            logger.warning(f"Grok API call failed: {e}; falling back to local heuristic.")

        return self._local_complaint_heuristic(title, description, category_hint)

    async def copilot_chat(self, message: str, context: str | None = None) -> str:
        """Grok AI copilot response for municipal officers and contractors."""
        if not self.is_configured:
            return (
                f"Hello! I am your JANMIND Grok Copilot. Based on our city data: {context or 'Operations normal'}. "
                "Triage queues are organized by priority and contractors are mobilized across active wards."
            )

        system_prompt = (
            "You are JANMIND Grok Copilot for municipal officers and civic contractors in India. "
            "Provide concise, actionable operational advice on civic complaints, contractor allocation, "
            "and SLA compliance."
        )

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": f"Context: {context or 'None'}\n\nOfficer Question: {message}"},
                        ],
                        "temperature": 0.4,
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.warning(f"Grok Copilot call error: {e}")

        return "JANMIND Copilot: Operations are tracked in real-time. Triage queue and contractor work orders are updated."

    def _local_complaint_heuristic(self, title: str, description: str, hint: str | None) -> dict[str, Any]:
        """Local high-precision heuristic fallback."""
        text = f"{title} {description} {hint or ''}".lower()
        if any(w in text for w in ["pothole", "road", "tar", "asphalt", "crater", "footpath", "divider"]):
            category = "road_damage"
            dept = "roads"
            priority = "high" if "pothole" in text or "accident" in text else "medium"
        elif any(w in text for w in ["water", "leak", "pipeline", "tanker", "tap", "drinking", "sewage"]):
            category = "water_supply"
            dept = "water_supply"
            priority = "high" if "leak" in text or "no water" in text else "medium"
        elif any(w in text for w in ["garbage", "trash", "waste", "dump", "bin", "litter", "debris"]):
            category = "garbage_collection"
            dept = "sanitation"
            priority = "medium"
        elif any(w in text for w in ["drain", "drainage", "waterlogging", "flood", "clog", "overflow", "gutter"]):
            category = "drainage"
            dept = "drainage"
            priority = "urgent" if "flood" in text or "overflow" in text else "high"
        elif any(w in text for w in ["light", "dark", "pole", "wire", "lamp", "blackout", "fixture"]):
            category = "street_lighting"
            dept = "electricity"
            priority = "medium"
        elif any(w in text for w in ["power", "voltage", "electric", "transformer", "shock"]):
            category = "electricity"
            dept = "electricity"
            priority = "urgent" if "shock" in text or "transformer" in text else "high"
        else:
            category = "sanitation"
            dept = "sanitation"
            priority = "medium"

        severity = 8 if priority == "urgent" else 6 if priority == "high" else 4
        risk = severity * 10 + 15

        return {
            "category": category,
            "severity_score": severity,
            "risk_score": risk,
            "priority": priority,
            "department_slug": dept,
            "summary": f"Civic issue reported: {title}",
            "suggested_action": f"Dispatch municipal inspection team for {category.replace('_', ' ')}."
        }


# Singleton instance
grok_ai_service = GrokAIService()
