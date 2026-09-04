import { useState } from "react";
import { Landmark, Sparkles, Building2, Droplets, Crown, Scroll, ChevronRight } from "lucide-react";
import { type CityId } from "@/services/cities";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { getCityVisuals } from "@civicsathi/visual-system";

interface HeritageStory {
  id: string;
  title: string;
  vernacular: string;
  era: string;
  category: "palace" | "civic" | "nature" | "water";
  tagline: string;
  civicLegacy: string;
  quote: string;
  icon: typeof Landmark;
  color: string;
  gradient: string;
}

const HERITAGE_DATA: Record<CityId, {
  cityName: string;
  cityTitle: string;
  vernacularName: string;
  epithet: string;
  intro: string;
  stories: HeritageStory[];
}> = {
  pune: {
    cityName: "Pune",
    cityTitle: "विद्येचे माहेरघर व ऐतिहासिक राजधानी",
    vernacularName: "पुणे · स्वराज्य आणि पेशवाईचा अमर वारसा",
    epithet: "The Cultural, Intellectual & Administrative Heartland of Maharashtra",
    intro: "Conceived under the visionary guidance of Rajmata Jijau and Chhatrapati Shivaji Maharaj, Pune evolved into the nerve center of the Maratha Empire. Home to majestic forts, historic palaces, and revered temples, Pune's heritage reflects centuries of courage, devotion, and civic innovation.",
    stories: [
      {
        id: "shaniwar-wada",
        title: "Shaniwar Wada — Seat of the Peshwa Dynasty",
        vernacular: "शनिवार वाडा — पेशव्यांचे ऐतिहासिक राजवाडे",
        era: "1732 CE",
        category: "palace",
        tagline: "Fortified 18th-Century Palace Complex of the Maratha Peshwas",
        civicLegacy: "Built by Peshwa Bajirao I, Shaniwar Wada served as the seat of the Peshwa rulers of the Maratha Empire. Its massive fortified walls, grand teak gateways, and nine bastions made it the political nerve center of 18th-century India.",
        quote: "“The grand Dilli Darwaza and the lotus-shaped fountains echo the glory of Peshwa administration and Maratha governance.”",
        icon: Crown,
        color: "#C86B18",
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "aga-khan-palace",
        title: "Aga Khan Palace — Memorial of India's Freedom",
        vernacular: "आगा खान पॅलेस — स्वातंत्र्य चळवळीचे स्मारक",
        era: "1892 CE",
        category: "civic",
        tagline: "Italian-Arched Palace Witness to the Quit India Movement",
        civicLegacy: "Built by Sultan Muhammed Shah Aga Khan III, this palace served as a prison for Mahatma Gandhi, Kasturba Gandhi, and other leaders during the Quit India Movement of 1942. Today it houses a memorial and the samadhi of Kasturba Gandhi.",
        quote: "“These walls witnessed the resolve that shook an empire — the birthplace of India's final march to freedom.”",
        icon: Building2,
        color: "#B91C1C",
        gradient: "from-red-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "sinhagad-fort",
        title: "Sinhagad Fort — The Lion's Fortress",
        vernacular: "सिंहगड किल्ला — सिंहाचा गड",
        era: "13th – 17th Century CE",
        category: "palace",
        tagline: "Impregnable Hill Fort Guarding the Sahyadri Mountain Passes",
        civicLegacy: "Standing 1,300 meters high in the Sahyadri range, Sinhagad was the site of the legendary Battle of Sinhagad (1670) where Tanaji Malusare sacrificed his life to recapture it for Chhatrapati Shivaji Maharaj. It remains a symbol of Maratha valour.",
        quote: "“Gad aala pan sinh gela” — The fort was won but the lion was lost. A symbol of ultimate courage and sacrifice.",
        icon: Landmark,
        color: "#78350F",
        gradient: "from-stone-500/20 via-amber-500/10 to-transparent",
      },
      {
        id: "dagdusheth-ganapati",
        title: "Dagdusheth Halwai Ganapati Temple",
        vernacular: "दगडूशेठ हलवाई गणपती मंदिर",
        era: "1893 CE",
        category: "civic",
        tagline: "Pune's Most Revered Ganesh Temple and Cultural Landmark",
        civicLegacy: "Established by Dagdusheth Halwai, this temple became the heart of Pune's Ganesh Chaturthi celebrations initiated by Lokmanya Tilak. The gold-plated idol and annual festivities draw millions, uniting civic pride with devotion.",
        quote: "“Where Lokmanya Tilak's vision of public Ganeshotsav united a city and ignited a national awakening.”",
        icon: Sparkles,
        color: "#1E3A8A",
        gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
      },
    ],
  },
  mumbai: {
    cityName: "Mumbai",
    cityTitle: "भारताची आर्थिक राजधानी",
    vernacularName: "मुंबई · सपनों का शहर आणि विश्व वारसा",
    epithet: "India's Financial Capital — City of Dreams & UNESCO World Heritage",
    intro: "From the iconic Gateway of India to the ancient Elephanta Caves, Mumbai's heritage spans millennia. The city's UNESCO World Heritage sites, Art Deco skyline, and monumental Victorian Gothic architecture make it a living museum of India's cultural evolution.",
    stories: [
      {
        id: "gateway-of-india",
        title: "Gateway of India — Mumbai's Iconic Arch",
        vernacular: "गेटवे ऑफ इंडिया — मुंबईचे प्रतीक",
        era: "1924 CE",
        category: "civic",
        tagline: "Indo-Saracenic Triumphal Arch Overlooking the Arabian Sea",
        civicLegacy: "Built to commemorate the visit of King George V and Queen Mary in 1911, the Gateway of India stands at Apollo Bunder overlooking Mumbai Harbour. Its 26-metre basalt arch blends Hindu and Islamic architectural motifs and has become the defining symbol of Mumbai.",
        quote: "“The first sight that greets visitors arriving by sea — Mumbai's eternal welcome carved in yellow basalt and concrete.”",
        icon: Landmark,
        color: "#0A369D",
        gradient: "from-blue-600/20 via-cyan-500/10 to-transparent",
      },
      {
        id: "cst-terminus",
        title: "Chhatrapati Shivaji Terminus (CST) — UNESCO World Heritage",
        vernacular: "छत्रपती शिवाजी टर्मिनस — युनेस्को जागतिक वारसा",
        era: "1888 CE",
        category: "civic",
        tagline: "Victorian Gothic Revival Masterpiece & India's Busiest Railway Station",
        civicLegacy: "Designed by Frederick William Stevens, CST is a UNESCO World Heritage Site (2004) blending Victorian Gothic Revival with traditional Indian elements. Its soaring central dome, stained glass windows, and ornate stone carvings serve over 3 million commuters daily.",
        quote: "“A cathedral of commerce and movement — where Victorian grandeur meets the pulse of modern India.”",
        icon: Building2,
        color: "#0F766E",
        gradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
      },
      {
        id: "marine-drive-sealink",
        title: "Marine Drive & Bandra-Worli Sea Link",
        vernacular: "मरीन ड्राइव्ह आणि बांद्रा-वरळी सी लिंक",
        era: "1940 CE / 2009 CE",
        category: "civic",
        tagline: "The Queen's Necklace & India's Engineering Marvel Over the Sea",
        civicLegacy: "Marine Drive's sweeping 3.6 km Art Deco promenade along Back Bay forms the famous 'Queen's Necklace' at night. The Bandra-Worli Sea Link, a cable-stayed bridge spanning 5.6 km over Mahim Bay, represents modern India's engineering ambition connecting suburban and south Mumbai.",
        quote: "“From the Art Deco curves of the Queen's Necklace to the soaring cables over Mahim Bay — Mumbai's coast tells its story.”",
        icon: Droplets,
        color: "#D97706",
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "elephanta-caves",
        title: "Elephanta Caves — UNESCO World Heritage",
        vernacular: "एलिफंटा लेणी — युनेस्को जागतिक वारसा",
        era: "5th – 8th Century CE",
        category: "palace",
        tagline: "Rock-Cut Cave Temples Dedicated to Lord Shiva on Gharapuri Island",
        civicLegacy: "Located on Elephanta Island (Gharapuri) in Mumbai Harbour, these UNESCO World Heritage rock-cut caves (designated 1987) contain magnificent sculptures of Lord Shiva, including the iconic 20-foot Trimurti (Sadashiva). They represent the pinnacle of Indian rock-cut architecture.",
        quote: "“The serene Trimurti of Elephanta — three faces of Shiva carved from living rock, transcending time itself.”",
        icon: Crown,
        color: "#7C3AED",
        gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
      },
    ],
  },
  nagpur: {
    cityName: "Nagpur",
    cityTitle: "मध्य भारताचे हृदय व संत्री नगरी",
    vernacularName: "नागपूर · उपराजधानी व भौगोलिक केंद्र",
    epithet: "Winter Capital of Maharashtra & Geographical Center of India",
    intro: "Nagpur stands at the heart of India — both geographically and culturally. From the sacred Deekshabhoomi where Dr. B.R. Ambedkar embraced Buddhism, to the historic Sitabuldi Fort and the serene Ambazari Lake, Nagpur's heritage reflects spiritual transformation, martial history, and natural beauty.",
    stories: [
      {
        id: "deekshabhoomi",
        title: "Deekshabhoomi — Sacred Site of Mass Conversion",
        vernacular: "दीक्षाभूमी — बौद्ध धम्मदीक्षा स्थळ",
        era: "1956 CE",
        category: "civic",
        tagline: "India's Largest Buddhist Stupa & Monument of Social Transformation",
        civicLegacy: "On 14 October 1956, Dr. Babasaheb Ambedkar embraced Buddhism here along with nearly 600,000 followers in the largest mass religious conversion in recorded history. The grand white stupa built in his honour is the largest Buddhist monument in India and a UNESCO tentative list site.",
        quote: "“A single act of conviction at this sacred ground transformed the social landscape of an entire nation.”",
        icon: Landmark,
        color: "#E65100",
        gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
      },
      {
        id: "sitabuldi-fort",
        title: "Sitabuldi Fort — Bastion of the Bhonsle Marathas",
        vernacular: "सीताबर्डी किल्ला — भोसले मराठा दुर्ग",
        era: "1702 – 1817 CE",
        category: "palace",
        tagline: "Twin-Peaked Hilltop Fortress in the Heart of Nagpur City",
        civicLegacy: "Built atop twin hillocks in central Nagpur, Sitabuldi Fort witnessed the fierce Battle of Sitabuldi (1817) between the Bhonsle Marathas and the British. Now under the Indian Army, it opens annually on specific days as a memorial to Maratha resistance.",
        quote: "“Standing sentinel over Nagpur — twin peaks that witnessed the last stand of Bhonsle sovereignty.”",
        icon: Crown,
        color: "#991B1B",
        gradient: "from-red-600/20 via-orange-500/10 to-transparent",
      },
      {
        id: "ambazari-lake-garden",
        title: "Ambazari Lake & Garden — Nagpur's Urban Oasis",
        vernacular: "अंबाझरी तलाव आणि बाग — नागपूरचे नैसर्गिक वैभव",
        era: "18th Century CE",
        category: "water",
        tagline: "Largest Lake in Nagpur with Heritage Earthen Embankments",
        civicLegacy: "The largest of Nagpur's eleven lakes, Ambazari was constructed with basalt embankments and stone waste-weirs by the Bhonsle rulers. Its 30-acre garden, boating facilities, and surrounding biodiversity make it the green lung and recreational heart of the city.",
        quote: "“Water reservoirs engineered as permanent civic assets, sustaining Nagpur's urban ecology for centuries.”",
        icon: Droplets,
        color: "#0284C7",
        gradient: "from-sky-500/20 via-cyan-500/10 to-transparent",
      },
      {
        id: "zero-mile-marker",
        title: "Zero Mile Marker — Geographic Center of India",
        vernacular: "झिरो माईल स्टोन — भारताचे भौगोलिक केंद्र",
        era: "1907 CE",
        category: "civic",
        tagline: "Geodetic Datum Point of the Great Trigonometrical Survey",
        civicLegacy: "The Zero Mile Stone, a monument consisting of a sandstone pillar with four horses and a hexagonal pillar, marks the exact geographic center of India as determined by the Great Trigonometrical Survey. All major distances in India were historically measured from this point.",
        quote: "“All roads in India lead from this stone — the nation's geographic heartbeat etched in sandstone.”",
        icon: Building2,
        color: "#4338CA",
        gradient: "from-indigo-500/20 via-blue-500/10 to-transparent",
      },
    ],
  },
  chhatrapati_sambhajinagar: {
    cityName: "Chhatrapati Sambhajinagar",
    cityTitle: "जागतिक वारसा स्थळांची राजधानी",
    vernacularName: "छत्रपती संभाजीनगर · अजिंठा-वेरूळचे प्रवेशद्वार",
    epithet: "Gateway to Ajanta & Ellora — City of UNESCO World Heritage Caves",
    intro: "Home to two of the world's most celebrated UNESCO World Heritage Sites — the Ajanta and Ellora Caves — Chhatrapati Sambhajinagar is Maharashtra's unrivalled heritage destination. From the Mughal-inspired Bibi Ka Maqbara to the impregnable Daulatabad Fort, this city bridges ancient artistic genius with medieval military engineering.",
    stories: [
      {
        id: "ajanta-caves",
        title: "Ajanta Caves — UNESCO World Heritage",
        vernacular: "अजिंठा लेणी — युनेस्को जागतिक वारसा",
        era: "2nd Century BCE – 6th Century CE",
        category: "palace",
        tagline: "30 Rock-Cut Buddhist Masterpieces with Unrivalled Ancient Murals",
        civicLegacy: "Carved into a horseshoe-shaped cliff above the Waghora River, the 30 Ajanta caves (UNESCO, 1983) contain the finest surviving examples of ancient Indian painting and sculpture. Their depictions of the Jataka tales and Buddhist philosophy represent a pinnacle of human artistic achievement.",
        quote: "“Lost to the jungle for centuries, rediscovered in 1819 — Ajanta's murals remain the world's greatest gallery of ancient Indian art.”",
        icon: Sparkles,
        color: "#0D9488",
        gradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
      },
      {
        id: "ellora-caves",
        title: "Ellora Caves — UNESCO World Heritage",
        vernacular: "वेरूळ लेणी — युनेस्को जागतिक वारसा",
        era: "6th – 11th Century CE",
        category: "palace",
        tagline: "34 Caves Spanning Buddhist, Hindu & Jain Traditions in Living Rock",
        civicLegacy: "The 34 Ellora caves (UNESCO, 1983) represent an unparalleled feat of religious harmony — Buddhist, Hindu, and Jain monasteries carved side by side. The Kailasa Temple (Cave 16), carved top-down from a single basalt cliff, is the largest monolithic excavation in the world.",
        quote: "“The Kailasa Temple — carved from the sky downward, removing 200,000 tonnes of rock to reveal Mount Kailash on earth.”",
        icon: Landmark,
        color: "#9C27B0",
        gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
      },
      {
        id: "fifty-two-gates",
        title: "The 52 Historic Gates & Walled Civic Geometry",
        vernacular: "५२ ऐतिहासिक प्रवेशद्वारे",
        era: "16th – 17th Century CE",
        category: "civic",
        tagline: "Architectural Arches Defending Trade, Culture, and Urban Ingress",
        civicLegacy: "Delhi Gate, Makai Gate, Paithan Gate, and Bhadkal Gate regulated tax collection, civic defense, and sanitation control across the historic walled city of Marathwada.",
        quote: "“Every gateway tells the story of an empire entering through its portals.”",
        icon: Building2,
        color: "#D97706",
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
    ],
  },
};

export function CityHeritageSignal({ cityId }: { cityId: CityId }) {
  const cityData = HERITAGE_DATA[cityId] || HERITAGE_DATA.pune;
  const cityVisuals = getCityVisuals(cityId);
  const { t } = useI18n();
  const story = cityData.stories[0]!;
  const Icon = story.icon;

  return (
    <div className="civic-heritage-signal" style={{ "--heritage-accent": cityVisuals.accent } as React.CSSProperties}>
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--heritage-accent)]/30 bg-[var(--heritage-accent)]/10 text-[var(--heritage-accent)]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--heritage-accent)]">
            {cityVisuals.authority} · {t("home.heritage.signal", "Civic heritage signal")}
          </p>
          <p className="mt-1 line-clamp-2 break-words text-sm font-bold text-[var(--foreground)]">{story.title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {story.tagline} · {cityVisuals.architecture}
          </p>
        </div>
      </div>
      <a
        href="#city-heritage"
        className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--heritage-accent)] underline-offset-4 hover:underline"
      >
        {t("home.heritage.explore", "Explore {city} heritage").replace("{city}", cityData.cityName)}{" "}
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
      </a>
    </div>
  );
}

export function CityHeritagePanel({
  cityId,
  onSelectCity,
}: {
  cityId: CityId;
  onSelectCity?: (c: CityId) => void;
}) {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const { t } = useI18n();
  const cityData = HERITAGE_DATA[cityId] || HERITAGE_DATA.pune;

  const currentStory = cityData.stories.find((s) => s.id === activeStoryId) || cityData.stories[0]!;
  const Icon = currentStory.icon;

  const cities: Array<{ id: CityId; label: string }> = [
    { id: "pune", label: "Pune · PMC" },
    { id: "mumbai", label: "Mumbai · BMC" },
    { id: "nagpur", label: "Nagpur · NMC" },
    { id: "chhatrapati_sambhajinagar", label: "Sambhajinagar · CSMC" },
  ];

  return (
    <section id="city-heritage" className="space-y-6 pt-16 sm:pt-24">
      {/* Section Header with Maharashtra Bhagwa Accent */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-[0.68rem] tracking-[0.14em] font-semibold text-amber-800 dark:text-amber-300 uppercase">
              {t("heritage.heading", "Maharashtra Civic Heritage & Historical Engineering")}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-[var(--foreground)]">
            {cityData.cityName} <span className="jm-indian-gradient-text">· {cityData.cityTitle}</span>
          </h2>
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
            {cityData.vernacularName}
          </p>
        </div>

        {/* City Toggle if callback provided */}
        {onSelectCity && (
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            {cities.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelectCity(c.id);
                  setActiveStoryId(null);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                  cityId === c.id
                    ? "bg-[#1A2744] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {cityData.intro}
      </p>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cityData.stories.map((s) => {
          const StoryIcon = s.icon;
          const isActive = s.id === currentStory.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStoryId(s.id)}
              className={cn(
                "text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-3",
                isActive
                  ? "border-[#F4801A] bg-orange-50/50 dark:bg-orange-950/20 shadow-sm"
                  : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${s.color}15`, color: s.color }}
                  >
                    <StoryIcon className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                    {s.era}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground line-clamp-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{s.tagline}</p>
              </div>
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  {s.vernacular}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Story Spotlight */}
      <div className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
        <div className="flex items-start gap-4">
          <span
            className="p-3 rounded-xl hidden sm:inline-flex"
            style={{ backgroundColor: `${currentStory.color}15`, color: currentStory.color }}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-foreground">{currentStory.title}</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {currentStory.era}
              </span>
            </div>
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
              {currentStory.vernacular}
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed pt-1">
              {currentStory.civicLegacy}
            </p>
            <blockquote className="border-l-2 border-[#F4801A] pl-3 py-1 italic text-xs text-muted-foreground">
              {currentStory.quote}
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
