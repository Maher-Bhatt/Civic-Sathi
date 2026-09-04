export type CivicCityId = "pune" | "mumbai" | "nagpur" | "chhatrapati_sambhajinagar";

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
 * Maharashtra Statewide Civic Visual Identity System.
 * Covers the four primary administrative divisions:
 * Paschim Maharashtra (Pune), Konkan/MMR (Mumbai), Vidarbha (Nagpur), Marathwada (Chhatrapati Sambhajinagar).
 */
export const CITY_VISUALS: Record<CivicCityId, CityVisualConfig> = {
  pune: {
    id: "pune",
    authority: "PMC",
    cityName: "Pune",
    vernacularName: "पुणे · विद्येचे माहेरघर व ऐतिहासिक राजधानी",
    epithet: "Cultural capital, Maratha heartland, and heritage urban works",
    atmosphere: "A warm Peshwai sandstone and basalt atmosphere linking historical wadas, Mutha river ghats, and modern IT corridors.",
    architecture: "Timber-framed wadas, stone courtyards, subterranean Katraj water aqueducts, and Sahyadri fort ramparts.",
    civicSignal: "Aqueduct networks · heritage peths · public mobility corridors",
    landmarkCue: "Shaniwar Wada · Lal Mahal · Sinhagad · Mutha riverwalk",
    mapTone: "warm",
    accent: "#C86B18",
    accentSoft: "#F1D2A8",
    atmosphereImage: "/city-atmosphere/pune-civic-atmosphere.webp",
    dataLine: "Pune PMC live civic coverage",
  },
  mumbai: {
    id: "mumbai",
    authority: "BMC",
    cityName: "Mumbai",
    vernacularName: "मुंबई · भारताची आर्थिक राजधानी",
    epithet: "Urbs Prima in Indis, financial nerve center & coastal maritime heritage",
    atmosphere: "A dynamic coastal metropolis merging colonial Victorian Gothic civic halls with Maratha naval fortitude.",
    architecture: "Gothic Revival municipal headquarters, basalt sea forts, Art Deco boulevards, and integrated storm drainage.",
    civicSignal: "Coastal sea defences · suburban rail arteries · storm water conduits",
    landmarkCue: "Gateway of India · CSMT Terminus · Marine Drive · Bandra Sea Link",
    mapTone: "cool",
    accent: "#0A369D",
    accentSoft: "#B7DDD5",
    atmosphereImage: "/city-atmosphere/mumbai-civic-atmosphere.webp",
    dataLine: "Brihanmumbai BMC live civic coverage",
  },
  nagpur: {
    id: "nagpur",
    authority: "NMC",
    cityName: "Nagpur",
    vernacularName: "नागपूर · उपराजधानी व संत्री नगरी",
    epithet: "Winter capital of Maharashtra, geographical center (Zero Mile) & tiger gateway",
    atmosphere: "A spacious red sandstone civic landscape anchored by central Indian water reservoirs and broad tree-lined avenues.",
    architecture: "Colonial stone pavilions, Bhonsle dynasty bastions, Sitabuldi battlements, and green lake reservoirs.",
    civicSignal: "Lake catchments · metro rail lines · Zero Mile civic corridors",
    landmarkCue: "Zero Mile Stone · Deekshabhoomi · Sitabuldi Fort · Futala Lake",
    mapTone: "warm",
    accent: "#E65100",
    accentSoft: "#FED7AA",
    atmosphereImage: "/city-atmosphere/nagpur-civic-atmosphere.webp",
    dataLine: "Nagpur NMC live civic coverage",
  },
  chhatrapati_sambhajinagar: {
    id: "chhatrapati_sambhajinagar",
    authority: "CSMC",
    cityName: "Chhatrapati Sambhajinagar",
    vernacularName: "छत्रपती संभाजीनगर · ऐतिहासिक पर्यटनाची राजधानी",
    epithet: "City of 52 Gates, tourism capital of Maharashtra, and hydraulic heritage",
    atmosphere: "An evocative basalt-and-limestone landscape famous for medieval gravity water canals and hill fortresses.",
    architecture: "Massive arched gateways, subterranean Nahar-e-Ambari channels, Daulatabad rock-cut ramparts, and Mughal-Deccan arches.",
    civicSignal: "Gravity canal works · historical gates · pilgrimage corridors",
    landmarkCue: "Bibi Ka Maqbara · Daulatabad Fort · Panchakki · Delhi Gate",
    mapTone: "warm",
    accent: "#9C27B0",
    accentSoft: "#E1BEE7",
    atmosphereImage: "/city-atmosphere/sambhajinagar-civic-atmosphere.webp",
    dataLine: "Chhatrapati Sambhajinagar CSMC live civic coverage",
  },
};

export function getCityVisuals(cityId: string | null | undefined): CityVisualConfig {
  return CITY_VISUALS[cityId as CivicCityId] ?? CITY_VISUALS.pune;
}
