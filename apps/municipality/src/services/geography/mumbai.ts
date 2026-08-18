import type { CityGeography, CivicArea } from "./types";

const area = (
  id: string,
  name: string,
  center: [number, number],
  radiusMeters: number,
  division?: string,
): CivicArea => ({
  id: `mum-${id}`,
  city: "mumbai",
  name,
  center,
  radiusMeters,
  boundarySource: "derived",
  admin: {
    body: "Brihanmumbai Municipal Corporation (BMC)",
    bodyVerified: true,
    ...(division ? { division, divisionVerified: true } : {}),
  },
});

export const MUMBAI: CityGeography = {
  city: "mumbai",
  dataNote: "Locality reference points for BMC administrative wards.",
  areas: [
    area("andheri-west", "Andheri West", [19.1197, 72.8468], 2200, "K/W Ward"),
    area("andheri-east", "Andheri East", [19.1136, 72.8697], 2000, "K/E Ward"),
    area("bandra-west", "Bandra West", [19.0596, 72.8295], 1800, "H/W Ward"),
    area("bandra-east-bkc", "BKC & Bandra East", [19.0607, 72.8644], 1600, "H/E Ward"),
    area("dadar", "Dadar", [19.0178, 72.8478], 1500, "G/N Ward"),
    area("colaba", "Colaba & Fort", [18.9067, 72.8147], 1800, "A Ward"),
    area("worli", "Worli", [19.0166, 72.8166], 1700, "G/S Ward"),
    area("borivali-west", "Borivali West", [19.2307, 72.8567], 2200, "R/C Ward"),
    area("ghatkopar", "Ghatkopar", [19.0860, 72.9090], 1900, "N Ward"),
    area("chembur", "Chembur", [19.0522, 72.8994], 1800, "M/W Ward"),
    area("malad", "Malad", [19.1874, 72.8484], 2100, "P/N Ward"),
    area("kurla", "Kurla", [19.0726, 72.8845], 1900, "L Ward"),
  ],
};
