import type { CityGeography, CivicArea } from "./types";

const area = (
  id: string,
  name: string,
  center: [number, number],
  radiusMeters: number,
  population: number,
  division?: string,
): CivicArea => ({
  id: `blr-${id}`,
  city: "bengaluru",
  name,
  center,
  radiusMeters,
  boundarySource: "derived",
  population,
  admin: {
    body: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    bodyVerified: true,
    ...(division ? { division, divisionVerified: true } : {}),
  },
});

export const BENGALURU: CityGeography = {
  city: "bengaluru",
  dataNote:
    "Zone reference points for Bruhat Bengaluru Mahanagara Palike (BBMP). Greater Bengaluru metropolitan governance.",
  areas: [
    area("koramangala", "Koramangala 4th & 5th Block", [12.9279, 77.6271], 1500, 165000, "South Zone · Ward 151"),
    area("indiranagar", "Indiranagar 100ft Road & CMH Road", [12.9719, 77.6412], 1400, 145000, "East Zone · Ward 80"),
    area("whitefield", "Whitefield ITPL & Main Road", [12.9698, 77.7499], 1800, 210000, "Mahadevapura Zone · Ward 84"),
    area("jayanagar", "Jayanagar 4th Block & 9th Block", [12.9299, 77.5824], 1500, 155000, "South Zone · Ward 153"),
    area("malleshwaram", "Malleshwaram 8th Cross & Margosa Road", [13.0031, 77.5643], 1300, 130000, "West Zone · Ward 45"),
    area("hsr-layout", "HSR Layout Sector 1 & 2", [12.9081, 77.6476], 1600, 180000, "Bommanahalli Zone · Ward 174"),
    area("yelahanka", "Yelahanka Old Town & New Town", [13.1007, 77.5963], 1700, 175000, "Yelahanka Zone · Ward 4"),
    area("electronic-city", "Electronic City Phase 1 & 2", [12.8452, 77.6602], 1900, 195000, "Bommanahalli Zone · Ward 192"),
    area("hebbal", "Hebbal Flyover & Bellary Road", [13.0354, 77.5988], 1500, 140000, "Yelahanka Zone · Ward 7"),
    area("banashankari", "Banashankari 2nd & 3rd Stage", [12.9255, 77.5468], 1400, 160000, "South Zone · Ward 165"),
    area("basavanagudi", "Basavanagudi Gandhi Bazaar & DVG Road", [12.9432, 77.5734], 1300, 125000, "South Zone · Ward 142"),
    area("rajajinagar", "Rajajinagar 1st Block & Dr Rajkumar Road", [12.9982, 77.5530], 1400, 150000, "West Zone · Ward 108"),
  ],
};
