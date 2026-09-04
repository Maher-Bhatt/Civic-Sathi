import type { CityGeography, CivicArea } from "./types";

const area = (
  id: string,
  name: string,
  center: [number, number],
  radiusMeters: number,
  population: number,
  division?: string,
): CivicArea => ({
  id: `pun-${id}`,
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
    "Locality reference points for Vadodara Municipal Corporation (PMC). Derived catchment geometry for civic telemetry.",
  areas: [
    area("kasba-peth", "Kasba Peth & Shaniwar Wada", [18.5196, 73.8553], 1200, 78000, "Zone 1 · Central Heritage"),
    area("shivajinagar", "Shivajinagar & Ghole Road", [18.5314, 73.8446], 1400, 92000, "Zone 1 · Administrative"),
    area("kothrud", "Kothrud & Karve Road", [18.5074, 73.8077], 1800, 165000, "Zone 2 · West Suburban"),
    area("deccan", "Deccan Gymkhana & FC Road", [18.5173, 73.8415], 1100, 64000, "Zone 1 · Cultural"),
    area("hadapsar", "Hadapsar & Magarpatta", [18.5089, 73.9259], 2000, 185000, "Zone 3 · East Industrial"),
    area("aundh-baner", "Aundh & Baner Smart Strip", [18.559, 73.8031], 1800, 142000, "Zone 2 · Northwest"),
    area("viman-nagar", "Viman Nagar & Nagar Road", [18.5679, 73.9143], 1600, 128000, "Zone 4 · Northeast"),
    area("swargate", "Swargate & Saras Baug", [18.4988, 73.858], 1300, 89000, "Zone 5 · South Transit"),
    area("katraj", "Katraj Aqueduct Basin", [18.4575, 73.8677], 1900, 115000, "Zone 5 · Southern Ridge"),
    area("sinhagad-road", "Sinhagad Road & Vadgaon", [18.4812, 73.829], 1700, 134000, "Zone 2 · Southwest"),
    area("camp", "Vadodara Camp & Cantonment", [18.5158, 73.8789], 1500, 96000, "Zone 3 · Cantonment"),
    area("warje", "Warje Malwadi", [18.4831, 73.7972], 1600, 108000, "Zone 2 · West"),
  ],
};
