import type { CityGeography, CivicArea } from "./types";

/**
 * Verified Bengaluru locality / area names under the current Greater Bengaluru
 * structure (Greater Bengaluru Authority, five city corporations). The legacy
 * 243-ward BBMP structure is intentionally not used.
 *
 * Corporation attribution is indicative until the official boundary
 * notification file is loaded; polygons are derived catchment approximations.
 */
const area = (
  id: string,
  name: string,
  center: [number, number],
  radiusMeters: number,
  division: string,
): CivicArea => ({
  id: `blr-${id}`,
  city: "bengaluru",
  name,
  center,
  radiusMeters,
  boundarySource: "derived",
  admin: {
    body: "Greater Bengaluru Authority",
    bodyVerified: true,
    division,
    divisionVerified: false,
  },
});

const NORTH = "Bengaluru North City Corporation";
const SOUTH = "Bengaluru South City Corporation";
const EAST = "Bengaluru East City Corporation";
const WEST = "Bengaluru West City Corporation";
const CENTRAL = "Bengaluru Central City Corporation";

export const BENGALURU: CityGeography = {
  city: "bengaluru",
  dataNote:
    "Locality names are verified place names under the Greater Bengaluru structure. Boundaries shown are derived catchment approximations, not official corporation boundaries.",
  areas: [
    area("yelahanka", "Yelahanka", [13.1007, 77.5963], 2600, NORTH),
    area("byatarayanapura", "Byatarayanapura", [13.063, 77.59], 2000, NORTH),
    area("hebbal", "Hebbal", [13.0358, 77.597], 1800, NORTH),
    area("jalahalli", "Jalahalli", [13.0435, 77.5205], 1800, NORTH),
    area("hennur", "Hennur", [13.03, 77.64], 1800, NORTH),
    area("rt-nagar", "R.T. Nagar", [13.0207, 77.5945], 1400, NORTH),

    area("whitefield", "Whitefield", [12.9698, 77.7499], 2800, EAST),
    area("mahadevapura", "Mahadevapura", [12.991, 77.697], 2000, EAST),
    area("kr-puram", "K.R. Puram", [13.007, 77.696], 2000, EAST),
    area("marathahalli", "Marathahalli", [12.9569, 77.7011], 1800, EAST),
    area("bellandur", "Bellandur", [12.926, 77.678], 2000, EAST),
    area("cv-raman-nagar", "C.V. Raman Nagar", [12.985, 77.663], 1500, EAST),
    area("indiranagar", "Indiranagar", [12.9719, 77.6412], 1500, EAST),
    area("banaswadi", "Banaswadi", [13.014, 77.651], 1600, EAST),

    area("koramangala", "Koramangala", [12.9352, 77.6245], 1600, SOUTH),
    area("hsr-layout", "HSR Layout", [12.9121, 77.6446], 1800, SOUTH),
    area("btm-layout", "BTM Layout", [12.9166, 77.6101], 1500, SOUTH),
    area("jayanagar", "Jayanagar", [12.925, 77.5938], 1600, SOUTH),
    area("jp-nagar", "J.P. Nagar", [12.91, 77.585], 1800, SOUTH),
    area("banashankari", "Banashankari", [12.925, 77.546], 2200, SOUTH),
    area("basavanagudi", "Basavanagudi", [12.942, 77.573], 1400, SOUTH),
    area("bommanahalli", "Bommanahalli", [12.9, 77.62], 1800, SOUTH),
    area("electronic-city", "Electronic City", [12.8452, 77.6602], 2600, SOUTH),

    area("rajajinagar", "Rajajinagar", [12.9982, 77.5551], 1600, WEST),
    area("vijayanagar", "Vijayanagar", [12.972, 77.533], 1600, WEST),
    area("rr-nagar", "Rajarajeshwari Nagar", [12.927, 77.518], 2400, WEST),
    area("kengeri", "Kengeri", [12.908, 77.482], 2400, WEST),
    area("dasarahalli", "Dasarahalli", [13.028, 77.513], 2000, WEST),
    area("peenya", "Peenya", [13.029, 77.527], 1800, WEST),
    area("yeshwanthpur", "Yeshwanthpur", [13.023, 77.554], 1600, WEST),
    area("malleshwaram", "Malleshwaram", [13.003, 77.569], 1400, WEST),

    area("shivajinagar", "Shivajinagar", [12.985, 77.605], 1200, CENTRAL),
    area("chickpet", "Chickpet", [12.968, 77.577], 1100, CENTRAL),
    area("shanthinagar", "Shanthinagar", [12.956, 77.596], 1200, CENTRAL),
    area("gandhinagar", "Gandhinagar", [12.978, 77.579], 1000, CENTRAL),
  ],
};
