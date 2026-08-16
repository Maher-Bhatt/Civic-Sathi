import type { CityGeography, CivicArea } from "./types";

/**
 * Verified Vadodara locality / area names.
 *
 * Centres are locality reference points, not official boundary data. The map
 * derives an approximate catchment polygon around each centre because the
 * Vadodara Municipal Corporation does not publish an open boundary file for
 * these localities. Those polygons are labelled "Approximate Civic Activity
 * Area" everywhere they appear.
 */
const area = (
  id: string,
  name: string,
  center: [number, number],
  radiusMeters: number,
  division?: string,
): CivicArea => ({
  id: `vad-${id}`,
  city: "vadodara",
  name,
  center,
  radiusMeters,
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
    area("sama", "Sama", [22.339, 73.19], 1500, "North zone"),
    area("chhani", "Chhani", [22.358, 73.172], 1600, "North zone"),
    area("nizampura", "Nizampura", [22.33, 73.172], 1200, "North zone"),
    area("subhanpura", "Subhanpura", [22.326, 73.165], 1000, "North zone"),
    area("gorwa", "Gorwa", [22.333, 73.156], 1300, "North zone"),
    area("karelibaug", "Karelibaug", [22.326, 73.199], 1400, "East zone"),
    area("warasiya", "Warasiya", [22.332, 73.213], 1300, "East zone"),
    area("harni", "Harni", [22.341, 73.208], 1500, "East zone"),
    area("ajwa-road", "Ajwa Road", [22.31, 73.145], 1500, "East zone"),
    area("waghodia-road", "Waghodia Road", [22.307, 73.226], 1600, "East zone"),
    area("fatehgunj", "Fatehgunj", [22.323, 73.183], 1000, "Central"),
    area("sayajigunj", "Sayajigunj", [22.314, 73.187], 900, "Central"),
    area("raopura", "Raopura", [22.3, 73.201], 1000, "Central"),
    area("mandvi", "Mandvi", [22.298, 73.205], 900, "Central"),
    area("alkapuri", "Alkapuri", [22.31, 73.172], 1100, "West zone"),
    area("akota", "Akota", [22.293, 73.174], 1200, "West zone"),
    area("gotri", "Gotri", [22.322, 73.137], 1600, "West zone"),
    area("sevasi", "Sevasi", [22.323, 73.111], 1500, "West zone"),
    area("vasna", "Vasna", [22.3, 73.136], 1400, "West zone"),
    area("bhayli", "Bhayli", [22.298, 73.117], 1500, "West zone"),
    area("atladara", "Atladara", [22.282, 73.156], 1300, "South zone"),
    area("manjalpur", "Manjalpur", [22.279, 73.193], 1400, "South zone"),
    area("tarsali", "Tarsali", [22.268, 73.213], 1500, "South zone"),
    area("makarpura", "Makarpura", [22.26, 73.19], 1600, "South zone"),
  ],
};
