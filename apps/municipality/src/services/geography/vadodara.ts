import type { CityGeography, CivicArea } from "./types";

const area = (
  id: string,
  name: string,
  center: [number, number],
  radiusMeters: number,
  population: number,
  division?: string,
): CivicArea => ({
  id: `vad-${id}`,
  city: "vadodara",
  name,
  center,
  radiusMeters,
  boundarySource: "derived",
  population,
  admin: {
    body: "Vadodara Municipal Corporation",
    bodyVerified: true,
    ...(division ? { division, divisionVerified: false } : {}),
  },
});

export const VADODARA: CityGeography = {
  city: "vadodara",
  dataNote:
    "Locality reference points for Vadodara Municipal Corporation (VMC). Derived catchment geometry for civic telemetry.",
  areas: [
    area("alkapuri", "Alkapuri & RC Dutt Road", [22.3121, 73.1672], 1200, 78000, "West Zone · Commercial"),
    area("akota", "Akota & Old Padra Road", [22.2952, 73.1625], 1400, 92000, "West Zone · Residential"),
    area("sayajigunj", "Sayajigunj & Kala Ghoda", [22.3105, 73.1856], 1100, 64000, "Central Zone · Transit"),
    area("gotri", "Gotri & Sevasi", [22.3204, 73.1415], 1800, 165000, "West Zone · Expansion"),
    area("karelibaug", "Karelibaug & VIP Road", [22.3297, 73.1979], 2000, 185000, "North Zone · Historic"),
    area("fatehgunj", "Fatehgunj & MS University", [22.3245, 73.1851], 1300, 89000, "North Zone · Educational"),
    area("manjalpur", "Manjalpur & Makarpura", [22.2746, 73.1942], 1900, 142000, "South Zone · Industrial"),
    area("waghodia", "Waghodia Road & Ajwa", [22.3021, 73.2341], 1600, 128000, "East Zone · Suburban"),
    area("sama", "Sama & Savli", [22.3551, 73.1895], 1700, 115000, "North Zone · Lake View"),
    area("city-area", "City Area & Mandvi", [22.3015, 73.2075], 1500, 134000, "Central Zone · Heritage"),
  ],
};
