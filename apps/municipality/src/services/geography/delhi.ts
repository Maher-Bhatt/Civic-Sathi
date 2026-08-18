import type { CityGeography, CivicArea } from "./types";

const area = (
  id: string,
  name: string,
  center: [number, number],
  radiusMeters: number,
  division?: string,
): CivicArea => ({
  id: `del-${id}`,
  city: "delhi",
  name,
  center,
  radiusMeters,
  boundarySource: "derived",
  admin: {
    body: "Municipal Corporation of Delhi (MCD)",
    bodyVerified: true,
    ...(division ? { division, divisionVerified: true } : {}),
  },
});

export const DELHI: CityGeography = {
  city: "delhi",
  dataNote: "Locality reference points for MCD administrative zones.",
  areas: [
    area("connaught-place", "Connaught Place", [28.6315, 77.2167], 1500, "City-SP Zone"),
    area("lajpat-nagar", "Lajpat Nagar", [28.5700, 77.2400], 1800, "Central Zone"),
    area("saket", "Saket & Malviya Nagar", [28.5244, 77.2100], 2000, "South Zone"),
    area("dwarka-sector-10", "Dwarka", [28.5921, 77.0460], 2500, "Najafgarh Zone"),
    area("rohini-sector-15", "Rohini", [28.7495, 77.1184], 2400, "Rohini Zone"),
    area("karol-bagh", "Karol Bagh", [28.6514, 77.1907], 1700, "Karol Bagh Zone"),
    area("laxmi-nagar", "Laxmi Nagar", [28.6300, 77.2780], 1900, "Shahdara South Zone"),
    area("hauz-khas", "Hauz Khas", [28.5494, 77.2001], 1800, "South Zone"),
    area("pitampura", "Pitampura", [28.6990, 77.1384], 2000, "Keshavpuram Zone"),
    area("mayur-vihar", "Mayur Vihar", [28.6090, 77.2980], 2100, "Shahdara South Zone"),
    area("janakpuri", "Janakpuri", [28.6219, 77.0878], 2100, "West Zone"),
    area("vasant-kunj", "Vasant Kunj", [28.5200, 77.1560], 2300, "South Zone"),
  ],
};
