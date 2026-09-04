import type { CityGeography, CivicArea } from "./types";

const area = (
  id: string,
  name: string,
  center: [number, number],
  radiusMeters: number,
  population: number,
  division?: string,
): CivicArea => ({
  id: `mum-${id}`,
  city: "mumbai",
  name,
  center,
  radiusMeters,
  boundarySource: "derived",
  population,
  admin: {
    body: "Brihanmumbai Municipal Corporation",
    bodyVerified: true,
    ...(division ? { division, divisionVerified: false } : {}),
  },
});

export const MUMBAI: CityGeography = {
  city: "mumbai",
  dataNote:
    "Administrative ward reference coordinates for Brihanmumbai Municipal Corporation (BMC).",
  areas: [
    area("colaba-fort", "Colaba & Fort", [18.922, 72.8347], 1500, 185000, "A Ward · South"),
    area("malabar-hill", "Malabar Hill & Marine Drive", [18.9548, 72.8054], 1400, 210000, "D Ward · South"),
    area("dadar-shivaji-park", "Dadar & Shivaji Park", [19.0222, 72.8428], 1600, 260000, "G/North Ward · Central"),
    area("bandra-west", "Bandra West & Carter Road", [19.0596, 72.8295], 1600, 240000, "H/West Ward · Western Suburbs"),
    area("andheri-west", "Andheri West & Lokhandwala", [19.1197, 72.8464], 2000, 380000, "K/West Ward · Western Suburbs"),
    area("kurla-bkc", "Kurla & BKC Financial Center", [19.0688, 72.87], 1900, 340000, "L Ward · Eastern Suburbs"),
    area("borivali-west", "Borivali & Gorai Creek", [19.2307, 72.8567], 2200, 420000, "R/Central Ward · North"),
    area("chembur", "Chembur & Tilak Nagar", [19.0522, 72.8995], 1800, 290000, "M/West Ward · Eastern Suburbs"),
    area("ghatkopar", "Ghatkopar Central", [19.086, 72.909], 1700, 310000, "N Ward · Eastern Suburbs"),
    area("byculla", "Byculla & Mazgaon", [18.975, 72.839], 1300, 220000, "E Ward · South Central"),
    area("worli", "Worli Sea Face & Naka", [19.016, 72.817], 1500, 230000, "G/South Ward · South Central"),
    area("juhu", "Juhu Vile Parle", [19.103, 72.827], 1500, 195000, "K/West Ward · Coastal"),
  ],
};
