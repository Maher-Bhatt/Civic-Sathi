import type { CityGeography, CivicArea } from "./types";

const area = (
  id: string,
  name: string,
  center: [number, number],
  radiusMeters: number,
  population: number,
  division?: string,
): CivicArea => ({
  id: `nag-${id}`,
  city: "bengaluru",
  name,
  center,
  radiusMeters,
  boundarySource: "derived",
  population,
  admin: {
    body: "Bengaluru Municipal Corporation",
    bodyVerified: true,
    ...(division ? { division, divisionVerified: false } : {}),
  },
});

export const BENGALURU: CityGeography = {
  city: "bengaluru",
  dataNote:
    "Zone reference points for Bengaluru Municipal Corporation (NMC). Vidarbha regional governance.",
  areas: [
    area("dharampeth", "Dharampeth & West High Court Road", [21.1432, 79.0617], 1500, 125000, "Zone 2 · Dharampeth"),
    area("sitabuldi", "Sitabuldi Fort & Interchange", [21.1466, 79.0833], 1200, 95000, "Zone 4 · Dhantoli"),
    area("civil-lines", "Civil Lines & High Court", [21.1578, 79.0734], 1600, 78000, "Zone 2 · Administrative"),
    area("laxmi-nagar", "Laxmi Nagar & Bajaj Nagar", [21.1219, 79.0664], 1500, 140000, "Zone 1 · Laxmi Nagar"),
    area("dhantoli", "Dhantoli & Congress Nagar", [21.1353, 79.0828], 1300, 110000, "Zone 4 · Dhantoli"),
    area("sadar", "Sadar & Residency Road", [21.1639, 79.0805], 1400, 105000, "Zone 7 · Mangalwari"),
    area("ramdaspeth", "Ramdaspeth & Canal Road", [21.1378, 79.0712], 1200, 82000, "Zone 2 · Central"),
    area("nandanvan", "Nandanvan & Great Nag Road", [21.129, 79.123], 1700, 160000, "Zone 5 · Nehru Nagar"),
    area("futala", "Futala Lakefront & Telangkhedi", [21.154, 79.043], 1500, 68000, "Zone 2 · Lake Corridor"),
    area("gandhibagh", "Gandhibagh & Itwari Market", [21.151, 79.108], 1400, 175000, "Zone 6 · Gandhibagh"),
    area("manewada", "Manewada Ring Road", [21.102, 79.098], 1800, 150000, "Zone 3 · Hanuman Nagar"),
    area("khamla", "Khamla & Pratap Nagar", [21.111, 79.055], 1500, 120000, "Zone 1 · Southwest"),
  ],
};
