export type CivicCityId = "vadodara" | "mumbai" | "bengaluru" | "delhi" | "pune" | "nagpur" | "chhatrapati_sambhajinagar";

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
 * National Multi-City Civic Visual Identity System.
 * Covers premier Municipal Corporations across India:
 * Vadodara (VMC), Mumbai (BMC), Bengaluru (BBMP), Delhi (MCD).
 */
export const CITY_VISUALS: Record<CivicCityId, CityVisualConfig> = {
  vadodara: {
    id: "vadodara",
    authority: "VMC",
    cityName: "Vadodara",
    vernacularName: "વડોદરા · સંસ્કારી નગરી",
    epithet: "Cultural Capital of Gujarat, Gaekwad royal heritage & progressive governance",
    atmosphere: "A regal sandstone and banyan-shaded landscape anchored by royal palaces, civic gardens, and Vishwamitri riverbanks.",
    architecture: "Indo-Saracenic royal palaces, sprawling public gardens, Italian Renaissance arches, and heritage water stepwells.",
    civicSignal: "Royal heritage works · green garden corridors · civic arts legacy",
    landmarkCue: "Laxmi Vilas Palace · Sayaji Baug · Kirti Mandir · Sursagar Lake",
    mapTone: "warm",
    accent: "#C86B18",
    accentSoft: "#F1D2A8",
    atmosphereImage: "/city-atmosphere/vadodara-civic-heritage.jpg",
    dataLine: "Vadodara VMC live civic coverage",
  },
  mumbai: {
    id: "mumbai",
    authority: "BMC",
    cityName: "Mumbai",
    vernacularName: "मुंबई · भारताची आर्थिक राजधानी",
    epithet: "Urbs Prima in Indis, financial nerve center & coastal maritime heritage",
    atmosphere: "A dynamic coastal metropolis merging colonial Victorian Gothic civic halls with maritime commercial vitality.",
    architecture: "Gothic Revival municipal headquarters, basalt sea forts, Art Deco boulevards, and integrated storm drainage.",
    civicSignal: "Coastal sea defences · suburban rail arteries · storm water conduits",
    landmarkCue: "Gateway of India · CSMT Terminus · Marine Drive · Bandra Sea Link",
    mapTone: "cool",
    accent: "#0A369D",
    accentSoft: "#B7C9E8",
    atmosphereImage: "/city-atmosphere/mumbai-civic-heritage.jpg",
    dataLine: "Brihanmumbai BMC live civic coverage",
  },
  bengaluru: {
    id: "bengaluru",
    authority: "BBMP",
    cityName: "Bengaluru",
    vernacularName: "ಬೆಂಗಳೂರು · ಉದ್ಯಾನನಗರಿ — Silicon Valley",
    epithet: "India's Technology Capital, Garden City & pioneering democratic institution",
    atmosphere: "A lush, high-altitude plateau city of historic tank cascades, botanical reserves, and futuristic technology hubs.",
    architecture: "Neo-Dravidian granite legislative domes, Tudor-revival towers, Lalbagh glasshouse ironwork, and tech parks.",
    civicSignal: "Lake cascades · green park networks · civic transit corridors",
    landmarkCue: "Vidhana Soudha · Lalbagh · Bangalore Palace · Tipu Sultan Palace",
    mapTone: "cool",
    accent: "#0E766E",
    accentSoft: "#B7DDD5",
    atmosphereImage: "/city-atmosphere/bengaluru-civic-heritage.jpg",
    dataLine: "Bruhat Bengaluru Mahanagara Palike live coverage",
  },
  delhi: {
    id: "delhi",
    authority: "MCD",
    cityName: "Delhi",
    vernacularName: "दिल्ली · सात शहरों का शहर — National Capital",
    epithet: "National Capital Territory, millennia of imperial architecture & democratic civic governance",
    atmosphere: "A monumental red-sandstone and broad-boulevard national landscape spanning ancient sultanates, Mughal glory, and modern democracy.",
    architecture: "Mughal sandstone citadels, Lutyens classical sandstone colonnades, soaring minarets, and modern metro infrastructure.",
    civicSignal: "Heritage conservation · central vista corridors · civic river catchment",
    landmarkCue: "Red Fort · India Gate · Qutub Minar · Humayun's Tomb",
    mapTone: "warm",
    accent: "#9C27B0",
    accentSoft: "#E1BEE7",
    atmosphereImage: "/city-atmosphere/delhi-civic-heritage.jpg",
    dataLine: "Municipal Corporation of Delhi live coverage",
  },
  // Backward compatibility aliases
  pune: {
    id: "pune",
    authority: "PMC",
    cityName: "Pune",
    vernacularName: "पुणे · विद्येचे माहेरघर",
    epithet: "Cultural capital & heritage urban works",
    atmosphere: "A warm Peshwai sandstone and basalt atmosphere linking historical wadas and modern corridors.",
    architecture: "Timber-framed wadas, stone courtyards, and Sahyadri fort ramparts.",
    civicSignal: "Aqueduct networks · heritage peths · public mobility corridors",
    landmarkCue: "Shaniwar Wada · Lal Mahal · Sinhagad",
    mapTone: "warm",
    accent: "#C86B18",
    accentSoft: "#F1D2A8",
    atmosphereImage: "/city-atmosphere/india-civic-heritage.jpg",
    dataLine: "Pune live civic coverage",
  },
  nagpur: {
    id: "nagpur",
    authority: "NMC",
    cityName: "Nagpur",
    vernacularName: "नागपूर · उपराजधानी",
    epithet: "Geographical center (Zero Mile) & tiger gateway",
    atmosphere: "A spacious red sandstone civic landscape anchored by central Indian water reservoirs.",
    architecture: "Colonial stone pavilions and green lake reservoirs.",
    civicSignal: "Lake catchments · Zero Mile civic corridors",
    landmarkCue: "Zero Mile Stone · Deekshabhoomi · Sitabuldi Fort",
    mapTone: "warm",
    accent: "#E65100",
    accentSoft: "#FED7AA",
    atmosphereImage: "/city-atmosphere/india-civic-heritage.jpg",
    dataLine: "Nagpur live civic coverage",
  },
  chhatrapati_sambhajinagar: {
    id: "chhatrapati_sambhajinagar",
    authority: "CSMC",
    cityName: "Chhatrapati Sambhajinagar",
    vernacularName: "छत्रपती संभाजीनगर",
    epithet: "City of 52 Gates & hydraulic heritage",
    atmosphere: "An evocative basalt-and-limestone landscape famous for medieval gravity water canals.",
    architecture: "Massive arched gateways and rock-cut ramparts.",
    civicSignal: "Gravity canal works · historical gates",
    landmarkCue: "Bibi Ka Maqbara · Daulatabad Fort · Panchakki",
    mapTone: "warm",
    accent: "#9C27B0",
    accentSoft: "#E1BEE7",
    atmosphereImage: "/city-atmosphere/india-civic-heritage.jpg",
    dataLine: "Chhatrapati Sambhajinagar live civic coverage",
  },
};

export function getCityVisuals(cityId: string | null | undefined): CityVisualConfig {
  return CITY_VISUALS[cityId as CivicCityId] ?? CITY_VISUALS.vadodara;
}
