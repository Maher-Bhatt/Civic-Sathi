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
    "Locality catchment reference points for Vadodara Municipal Corporation (VMC). Authoritative 9-zone layout.",
  areas: [
    area("gorwa", "Gorwa & Subhanpura", [22.3330, 73.1510], 1700, 145000, "North-West Zone · Ward 11"),
    area("gotri", "Gotri & Sevasi", [22.3160, 73.1370], 1800, 165000, "West Zone · Ward 10"),
    area("vasna", "Saiyed Vasna & Bhayli", [22.2980, 73.1410], 1600, 120000, "South-West Zone · Ward 8"),
    area("ashwamegh-akota", "Ashwamegh Nagar & Akota", [22.2880, 73.1590], 1500, 135000, "West Zone · Ward 5"),
    area("alkapuri", "Alkapuri & Sayajigunj", [22.3120, 73.1680], 1400, 110000, "Central Zone · Ward 9"),
    area("nava-bazaar", "Nava Bazaar & Mandvi", [22.3015, 73.2030], 1400, 150000, "Central Zone · Ward 1"),
    area("wadi", "Wadi & East Taluka", [22.2960, 73.2240], 1600, 140000, "East Zone · Ward 4"),
    area("manjalpur", "Manjalpur & Makarpura", [22.2680, 73.1920], 1900, 180000, "South Zone · Ward 12"),
    area("north-taluka", "Vadodara North & Harni/Sama", [22.3520, 73.1860], 2000, 175000, "North Zone · Ward 7"),
  ],
};
