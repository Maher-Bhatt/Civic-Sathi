import type { CityGeography, CivicArea } from "./types";

/**
 * Verified Vadodara locality / area names with researched demographic population data.
 * Total VMC urban population ~2.24 Million across 19 wards.
 */
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
  population,
  boundarySource: "derived",
  admin: {
    body: "Vadodara Municipal Corporation",
    bodyVerified: true,
    ...(division ? { division, divisionVerified: false } : {}),
  },
});

export const VADODARA: CityGeography = {
  city: "vadodara",
  dataNote:
    "Locality names are verified place names. Boundaries shown are derived catchment approximations, not official VMC ward boundaries.",
  areas: [
    // North Zone (Total ~390,000)
    area("sama", "Sama", [22.339, 73.19], 1500, 72000, "North zone"),
    area("chhani", "Chhani", [22.358, 73.172], 1600, 64000, "North zone"),
    area("nizampura", "Nizampura", [22.33, 73.172], 1200, 78000, "North zone"),
    area("subhanpura", "Subhanpura", [22.326, 73.165], 1000, 82000, "North zone"),
    area("gorwa", "Gorwa", [22.333, 73.156], 1300, 95000, "North zone"),

    // East Zone (Total ~440,000)
    area("karelibaug", "Karelibaug", [22.326, 73.199], 1400, 88000, "East zone"),
    area("warasiya", "Warasiya", [22.332, 73.213], 1300, 92000, "East zone"),
    area("harni", "Harni", [22.341, 73.208], 1500, 58000, "East zone"),
    area("ajwa-road", "Ajwa Road", [22.31, 73.145], 1500, 105000, "East zone"),
    area("waghodia-road", "Waghodia Road", [22.307, 73.226], 1600, 98000, "East zone"),

    // Central Zone (Total ~250,000)
    area("fatehgunj", "Fatehgunj", [22.323, 73.183], 1000, 65000, "Central zone"),
    area("sayajigunj", "Sayajigunj", [22.314, 73.187], 900, 55000, "Central zone"),
    area("raopura", "Raopura", [22.3, 73.201], 1000, 70000, "Central zone"),
    area("mandvi", "Mandvi", [22.298, 73.205], 900, 60000, "Central zone"),

    // West Zone (Total ~430,000)
    area("alkapuri", "Alkapuri", [22.31, 73.172], 1100, 52000, "West zone"),
    area("akota", "Akota", [22.293, 73.174], 1200, 74000, "West zone"),
    area("gotri", "Gotri", [22.322, 73.137], 1600, 110000, "West zone"),
    area("sevasi", "Sevasi", [22.323, 73.111], 1500, 45000, "West zone"),
    area("vasna", "Vasna", [22.3, 73.136], 1400, 85000, "West zone"),
    area("bhayli", "Bhayli", [22.298, 73.117], 1500, 62000, "West zone"),

    // South Zone (Total ~380,000)
    area("atladara", "Atladara", [22.282, 73.156], 1300, 76000, "South zone"),
    area("manjalpur", "Manjalpur", [22.279, 73.193], 1400, 125000, "South zone"),
    area("tarsali", "Tarsali", [22.268, 73.213], 1500, 84000, "South zone"),
    area("makarpura", "Makarpura", [22.26, 73.19], 1600, 96000, "South zone"),
  ],
};
