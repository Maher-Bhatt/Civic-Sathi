export type CivicCityId = "vadodara" | "bengaluru";

export type CityVisualConfig = {
  id: CivicCityId;
  authority: string;
  cityName: string;
  vernacularName: string;
  epithet: string;
  atmosphere: string;
  architecture: string;
  civicSignal: string;
  landmarkCue: string;
  mapTone: "warm" | "cool";
  accent: string;
  accentSoft: string;
  atmosphereImage: string;
  dataLine: string;
};

/**
 * Visual identity is deliberately expressed as a configuration rather than
 * route-specific conditionals so additional Indian cities can be added without
 * rewriting the page composition.
 */
export const CITY_VISUALS: Record<CivicCityId, CityVisualConfig> = {
  vadodara: {
    id: "vadodara",
    authority: "VMC",
    cityName: "Vadodara",
    vernacularName: "વડોદરા · સંસ્કારી નગરી",
    epithet: "Cultural capital, civic waterworks, and living heritage",
    atmosphere: "A warm sandstone civic atmosphere with quiet palace arches and stepwell geometry.",
    architecture: "Indo-Saracenic arches, carved stone thresholds, and the long civic memory of Sayajirao’s public works.",
    civicSignal: "Water networks · ward streets · public gardens",
    landmarkCue: "Lukshmi Vilas · Sayaji Baug · Ajwa water line",
    mapTone: "warm",
    accent: "#C86B18",
    accentSoft: "#F1D2A8",
    atmosphereImage: "/city-atmosphere/vadodara-civic-atmosphere.webp",
    dataLine: "Vadodara live civic coverage",
  },
  bengaluru: {
    id: "bengaluru",
    authority: "BBMP",
    cityName: "Bengaluru",
    vernacularName: "ಬೆಂಗಳೂರು · ಉದ್ಯಾನ ನಗರಿ",
    epithet: "Garden city, granite governance, and resilient streets",
    atmosphere: "A cool granite-and-canopy atmosphere linking civic buildings, tree corridors, and city mobility.",
    architecture: "Neo-Dravidian massing, civic granite, tree-lined boulevards, and connected street infrastructure.",
    civicSignal: "Safe streets · lake systems · public mobility",
    landmarkCue: "Vidhana Soudha · Cubbon Park · Namma Raste",
    mapTone: "cool",
    accent: "#0E766E",
    accentSoft: "#B7DDD5",
    atmosphereImage: "/city-atmosphere/bengaluru-civic-atmosphere.webp",
    dataLine: "Bengaluru live civic coverage",
  },
};

export function getCityVisuals(cityId: string | null | undefined): CityVisualConfig {
  return CITY_VISUALS[cityId as CivicCityId] ?? CITY_VISUALS.vadodara;
}
