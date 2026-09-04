import type { CityGeography, CivicArea } from "./types";

const area = (
  id: string,
  name: string,
  center: [number, number],
  radiusMeters: number,
  population: number,
  division?: string,
): CivicArea => ({
  id: `csn-${id}`,
  city: "delhi",
  name,
  center,
  radiusMeters,
  boundarySource: "derived",
  population,
  admin: {
    body: "Delhi Municipal Corporation",
    bodyVerified: true,
    ...(division ? { division, divisionVerified: false } : {}),
  },
});

export const DELHI: CityGeography = {
  city: "delhi",
  dataNote:
    "Locality and historical gate catchments for Delhi Municipal Corporation (CSMC).",
  areas: [
    area("kranti-chowk", "Kranti Chowk Central", [19.8736, 75.3256], 1400, 115000, "Zone 1 · Central"),
    area("cidco", "CIDCO Cannaught Place", [19.8778, 75.367], 1900, 195000, "Zone 2 · New City"),
    area("gulmandi-gates", "Gulmandi & Historic Gates", [19.8885, 75.324], 1300, 135000, "Zone 3 · Walled City"),
    area("samarth-nagar", "Samarth Nagar & Nirala Bazar", [19.8805, 75.334], 1200, 98000, "Zone 1 · Commercial"),
    area("begumpura-panchakki", "Begumpura & Panchakki Aqueduct", [19.897, 75.318], 1500, 88000, "Zone 4 · Heritage Hydraulic"),
    area("garkheda", "Garkheda Parisar", [19.859, 75.352], 1700, 145000, "Zone 5 · Southeast"),
    area("chikalthana", "Chikalthana MIDC & Airport", [19.872, 75.398], 2100, 110000, "Zone 2 · Industrial East"),
    area("station-road", "Railway Station & Bansilal Nagar", [19.862, 75.321], 1400, 102000, "Zone 1 · Transit"),
    area("daulatabad-base", "Daulatabad Foothills & Maliwada", [19.932, 75.228], 2200, 45000, "Zone 4 · Fort Corridor"),
    area("beed-bypass", "Beed Bypass Corridor", [19.842, 75.338], 1800, 120000, "Zone 5 · South Arterial"),
  ],
};
