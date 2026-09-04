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
    intro: "Conceived under the visionary guidance of Rajmata Jijau and Chhatrapati Shivaji Maharaj, Pune evolved into the nerve center of the Maratha Empire. In the 18th century, it pioneered underground masonry water aqueducts and orderly civic peths long before modern municipal town planning.",
    stories: [
      {
        id: "shaniwar-wada-katraj",
        title: "Shaniwar Wada & Katraj Gravity Aqueduct",
        vernacular: "शनिवार वाडा आणि कात्रजचा ऐतिहासिक जलमार्ग",
        era: "1732 – 1755 CE",
        category: "water",
        tagline: "Engineered 18th-Century Gravity Masonry Conduit Supplying Pure Water",
        civicLegacy: "Peshwa Balaji Baji Rao engineered an underground brick-and-stone gravity aqueduct from Katraj lake spanning over 6 km to feed 50+ public fountains (karanje) in Shaniwar Wada and public civilian peths.",
        quote: "“Pure water, public reservoirs, and broad paved peths are the foundation of good municipal rule.” — Peshwa Governance Code",
        icon: Droplets,
        color: "#C86B18",
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "lal-mahal-jijau",
        title: "Lal Mahal & Rajmata Jijau's Civic Revival",
        vernacular: "लाल महाल आणि राजमाता जिजाऊंची नगर रचना",
        era: "1630 – 1645 CE",
        category: "civic",
        tagline: "Rebuilt Pune from Ruins with a Golden Plough to Consecrate Swarajya",
        civicLegacy: "After devastating Adilshahi raids, Rajmata Jijau restored civilian life in Pune by exempting peasant taxes, consecrating Kasba Ganpati, and constructing Lal Mahal as a safe citadel of justice.",
        quote: "“Civilization revives when the state protects the cultivator, builds water channels, and assures fearlessness.”",
        icon: Crown,
        color: "#B91C1C",
        gradient: "from-red-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "sinhagad-fort",
        title: "Sinhagad Citadel & Watershed Fortress",
        vernacular: "सिंहगड किल्ला आणि सह्याद्रीची जलसुरक्षा",
        era: "13th – 17th Century CE",
        category: "palace",
        tagline: "Impregnable Giri-Durga Shielding the Mutha River Valley",
        civicLegacy: "Standing 1,300 meters high, Sinhagad served as the supreme military bastion of Hindavi Swarajya and a pristine natural rainwater catchment harvesting runoffs for the Pune basin.",
        quote: "“Gad aala pan sinh gela” — A symbol of ultimate courage, institutional vigilance, and sacrifice for the soil.",
        icon: Landmark,
        color: "#78350F",
        gradient: "from-stone-500/20 via-amber-500/10 to-transparent",
      },
      {
        id: "fergusson-deccan",
        title: "Fergusson College & Deccan Public Awakening",
        vernacular: "डेक्कन एज्युकेशन सोसायटी आणि सार्वजनिक सुधारणा",
        era: "1885 CE",
        category: "civic",
        tagline: "Gothic and Vernacular Stone Halls Fostering Indian Self-Rule",
        civicLegacy: "Founded by Lokmanya Bal Gangadhar Tilak and Gopal Krishna Gokhale, this institution catalyzed Maharashtra's municipal movements, citizen journalism, and scientific civil engineering.",
        quote: "“Public education and civic consciousness are the twin pillars of true Swarajya.”",
        icon: Scroll,
        color: "#1E3A8A",
        gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
      },
    ],
  },
  mumbai: {
    cityName: "Mumbai",
    cityTitle: "उर्ब्स प्राइमा इन इंडिस",
    vernacularName: "मुंबई · भारताचे आर्थिक प्रवेशद्वार",
    epithet: "Urbs Prima in Indis — The Great Maritime and Financial Metropolis",
    intro: "From seven separate fishing archipelagos defended by Maratha naval fleets to India's premier commercial and industrial gateway, Mumbai represents the triumph of civil engineering, coastal resilience, and relentless public energy.",
    stories: [
      {
        id: "kanhoji-angre-navy",
        title: "Sarkhel Kanhoji Angre & Maratha Naval Bastions",
        vernacular: "सरखेल कान्होजी आंग्रे आणि मराठा आरमार",
        era: "1698 – 1729 CE",
        category: "palace",
        tagline: "Impregnable Marine Fortresses Guarding the Konkan Gateway",
        civicLegacy: "Admiral Kanhoji Angre built and fortified Khanderi, Underi, and maritime sea forts with basalt wave-breakers, establishing indigenous sovereignty over the western seaboard.",
        quote: "“The ruler whose naval ramparts command the sea holds the keys to the continent.”",
        icon: Crown,
        color: "#0A369D",
        gradient: "from-blue-600/20 via-cyan-500/10 to-transparent",
      },
      {
        id: "hornby-vellard-reclamation",
        title: "Hornby Vellard & Seven Islands Unification",
        vernacular: "हॉर्नबी व्हेलार्ड आणि सात बेटांचे एकत्रीकरण",
        era: "1784 – 1845 CE",
        category: "civic",
        tagline: "Engineered Sea Walls Unifying Seven Separate Islands into a Metropolis",
        civicLegacy: "William Hornby built the breach-closing masonry causeway at Mahalakshmi without East India Company sanction to end devastating monsoon seawater surges, enabling South and Central Mumbai to become contiguous.",
        quote: "“Daring civil engineering that halted the Arabian Sea and forged a world city.”",
        icon: Building2,
        color: "#0F766E",
        gradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
      },
      {
        id: "csmt-bmc-gothic",
        title: "BMC Headquarters & Gothic Municipal Architecture",
        vernacular: "बृहन्मुंबई महानगरपालिका मुख्यालय आणि सीएसएमटी",
        era: "1893 CE",
        category: "civic",
        tagline: "Indo-Gothic Stone Dome Symbolizing Modern Municipal Self-Rule",
        civicLegacy: "Designed by F. W. Stevens with a 255-foot soaring central stone dome, winged allegorical figures of 'Urbs Prima in Indis', and an enduring granite chamber housing India's oldest municipal corporation.",
        quote: "“Municipal self-governance embodied in monumental stone.”",
        icon: Landmark,
        color: "#D97706",
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
    ],
  },
  nagpur: {
    cityName: "Nagpur",
    cityTitle: "मध्य भारताचे हृदय व संत्री नगरी",
    vernacularName: "नागपूर · उपराजधानी व भौगोलिक केंद्र",
    epithet: "Winter Capital of Maharashtra & Geographical Baseline of India",
    intro: "Founded by the Gond rulers and brought to prominence by the Bhonsle Marathas, Nagpur serves as the winter legislative capital of Maharashtra and the geographical anchor point of the Indian subcontinent.",
    stories: [
      {
        id: "zero-mile-great-survey",
        title: "The Zero Mile Stone of India",
        vernacular: "झिरो माईल स्टोन · भारताचे भौगोलिक केंद्र",
        era: "1907 CE",
        category: "civic",
        tagline: "Geodetic Datum Point for the Great Trigonometrical Survey",
        civicLegacy: "British surveyors chose Nagpur as the exact geographical datum point to measure all national distances with four sandstone horses and a hexagonal stone pillar.",
        quote: "“All national arterial distances, latitudes, and civic coordinates find their baseline here.”",
        icon: Landmark,
        color: "#E65100",
        gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
      },
      {
        id: "bhonsle-sitabuldi",
        title: "Bhonsle Maratha Dynasty & Sitabuldi Fort",
        vernacular: "भोसले घराणे आणि सीताबर्डी किल्ला",
        era: "1702 – 1817 CE",
        category: "palace",
        tagline: "Founders of Modern Nagpur and Twin-Peaked Basalt Fortifications",
        civicLegacy: "Raja Raghoji Bhonsle established Nagpur as the capital of the eastern Maratha confederacy, building Sitabuldi Fort and establishing civic water channels through the Nag river basin.",
        quote: "“Guarding the eastern frontier with valour, broad boulevards, and civic foresight.”",
        icon: Crown,
        color: "#991B1B",
        gradient: "from-red-600/20 via-orange-500/10 to-transparent",
      },
      {
        id: "futala-ambazari-lakes",
        title: "Ambazari & Futala Heritage Reservoirs",
        vernacular: "अंबाझरी आणि फुटाळा तलाव जलव्यवस्थापन",
        era: "18th Century CE",
        category: "water",
        tagline: "Historic Earthen Bunds Sustaining Vidarbha's Urban Oasis",
        civicLegacy: "Constructed by the Bhonsle kings with basalt embankments and stone waste-weirs, ensuring continuous drinking water recharge and climate resilience across central Nagpur.",
        quote: "“Water reservoirs engineered as permanent civic assets for centuries to come.”",
        icon: Droplets,
        color: "#0284C7",
        gradient: "from-sky-500/20 via-cyan-500/10 to-transparent",
      },
    ],
  },
  chhatrapati_sambhajinagar: {
    cityName: "Chhatrapati Sambhajinagar",
    cityTitle: "ऐतिहासिक पर्यटनाची राजधानी",
    vernacularName: "छत्रपती संभाजीनगर · ५२ दरवाजांचे शहर",
    epithet: "The City of 52 Gates & Medieval Hydraulic Engineering",
    intro: "Steeped in medieval Maratha and Deccan history, Chhatrapati Sambhajinagar is world-renowned for its gravity-fed subterranean terracotta water channels, impregnable hill fortresses, and architectural gateways.",
    stories: [
      {
        id: "panchakki-nahar-ambari",
        title: "Panchakki & The Nahar-e-Ambari Gravity Aqueduct",
        vernacular: "पानचक्की आणि नहरे अंबरी जलप्रणाली",
        era: "1617 CE",
        category: "water",
        tagline: "Medieval Underground Earthen-Pipe Aqueduct Powering a Flour Mill",
        civicLegacy: "Pioneered by Malik Ambar, this subterranean terracotta siphon conduit brought water from natural mountain springs 8 km away to drive an overhead masonry waterwheel grinding corn for pilgrims.",
        quote: "“A hydraulic masterpiece providing renewable energy, public drinking water, and tranquility without a single electric pump.”",
        icon: Droplets,
        color: "#0D9488",
        gradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
      },
      {
        id: "daulatabad-devgiri",
        title: "Daulatabad (Devgiri) Fort Defensive Geometry",
        vernacular: "दौलताबाद (देवगिरी) किल्ला",
        era: "1187 CE",
        category: "palace",
        tagline: "Impregnable Hill Citadel with Subterranean Acoustic Traps",
        civicLegacy: "Built by the Yadava kings with a 50-foot sheer vertical rock scarp, subterranean labyrinth (Andhari), and moat, standing as the supreme military engineering feat of the Deccan.",
        quote: "“A fortress carved directly from the living basalt rock of the Deccan.”",
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
