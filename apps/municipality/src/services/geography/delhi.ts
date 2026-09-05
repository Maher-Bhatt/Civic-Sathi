import type { CityGeography, CivicArea } from "./types";

const area = (
  id: string,
  name: string,
  center: [number, number],
  radiusMeters: number,
  population: number,
  division?: string,
): CivicArea => ({
  id: `del-${id}`,
  city: "delhi",
  name,
  center,
  radiusMeters,
  boundarySource: "derived",
  population,
  admin: {
    body: "Municipal Corporation of Delhi",
    bodyVerified: true,
    ...(division ? { division, divisionVerified: false } : {}),
  },
});

export const DELHI: CityGeography = {
  city: "delhi",
  dataNote:
    "Administrative zone reference coordinates for Municipal Corporation of Delhi (MCD).",
  areas: [
    area("connaught-place", "Connaught Place & Barakhamba", [28.6315, 77.2167], 1500, 180000, "Zone 1 · Central Heritage"),
    area("chandni-chowk", "Chandni Chowk & Red Fort", [28.6506, 77.2334], 1300, 250000, "Zone 1 · Walled City"),
    area("dwarka", "Dwarka & Palam", [28.5921, 77.0460], 2200, 520000, "Zone 17 · Dwarka"),
    area("rohini", "Rohini & Pitampura", [28.7320, 77.1198], 2000, 480000, "Zone 6 · Rohini"),
    area("shahdara", "Shahdara & Yamuna Vihar", [28.6814, 77.2894], 1800, 390000, "Zone 10 · Shahdara"),
    area("saket", "Saket & Malviya Nagar", [28.5244, 77.2067], 1700, 310000, "Zone 14 · South"),
    area("lajpat-nagar", "Lajpat Nagar & Defence Colony", [28.5708, 77.2404], 1400, 260000, "Zone 13 · South East"),
    area("karol-bagh", "Karol Bagh & Rajendra Place", [28.6519, 77.1905], 1500, 350000, "Zone 3 · West"),
    area("india-gate", "India Gate & Central Vista", [28.6129, 77.2295], 1800, 95000, "Zone 1 · New Delhi"),
    area("janakpuri", "Janakpuri & Vikaspuri", [28.6219, 77.0819], 1900, 420000, "Zone 17 · West"),
  ],
};
