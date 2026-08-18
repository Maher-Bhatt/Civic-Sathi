import { useState } from "react";
import { Landmark, Compass, Sparkles, Building2, Trees, Droplets, Crown, Scroll, ChevronRight } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { type CityId } from "@/services/cities";
import { cn } from "@/lib/utils";

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
  vadodara: {
    cityName: "Vadodara",
    cityTitle: "Sanskari Nagari",
    vernacularName: "વડોદરા · સંસ્કારી નગરી",
    epithet: "The Cultural & Intellectual Capital of Gujarat",
    intro: "Shaped by the visionary governance of Maharaja Sayajirao Gaekwad III, Vadodara was among the first Indian cities to build underground civic drainage, municipal libraries, and public botanical reserves in the 1890s.",
    stories: [
      {
        id: "sayajirao-vision",
        title: "The Sayajirao Gaekwad III Urban Vision",
        vernacular: "મહારાજા સયાજીરાવ ગાયકવાડ ત્રીજાની નગર રચના",
        era: "1875 – 1939 CE",
        category: "civic",
        tagline: "Pioneered India's First Universal Public Drainage & Free Municipal Education",
        civicLegacy: "Maharaja Sayajirao III instituted compulsory free schooling, established the Central Library network, and engineered the 1890 underground drainage & water works long before most global cities.",
        quote: "“The remedy for all ills is education and enlightened civic infrastructure.” — Maharaja Sayajirao III",
        icon: Crown,
        color: "#FF6F00",
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "laxmi-vilas",
        title: "Laxmi Vilas Palace & Royal Planning",
        vernacular: "લક્ષ્મી વિલાસ મહેલ",
        era: "Built 1890 CE",
        category: "palace",
        tagline: "Indo-Saracenic Wonder (4× the Size of Buckingham Palace)",
        civicLegacy: "Designed by Major Charles Mant with European hydraulic elevators and ornate civic courtyards, setting the architectural standard for Baroda's public buildings.",
        quote: "A testament to harmonious blend of Maratha, Mughal, Rajput, and Gothic civic architecture.",
        icon: Building2,
        color: "#D97706",
        gradient: "from-yellow-500/20 via-amber-500/10 to-transparent",
      },
      {
        id: "nyay-mandir",
        title: "Mandvi Gate & Nyay Mandir",
        vernacular: "માંડવી દરવાજો અને ન્યાય મંદિર",
        era: "16th – 19th Century",
        category: "civic",
        tagline: "The Historic Citadel Crossroads & Temple of Justice",
        civicLegacy: "Mandvi Gate stood as the fortified gateway to old Baroda, while Robert Chisholm's Byzantine-inspired Nyay Mandir served as the apex of transparent municipal justice.",
        quote: "The historic central heart where four ancient trade pathways converged.",
        icon: Landmark,
        color: "#0A369D",
        gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
      },
      {
        id: "sayaji-baug-ajwa",
        title: "Kamati Baug & The Ajwa Water Reservoir",
        vernacular: "કમટી બાગ અને આજવા જળાશય",
        era: "Dedicated 1879 CE",
        category: "water",
        tagline: "113-Acre Botanical Sanctuary & Gravity Water Pipeline",
        civicLegacy: "The Ajwa Reservoir engineered a perennial gravity-fed pure water supply to Vadodara residents, paired with Kamati Baug's 98 rare tree species along the Vishwamitri river.",
        quote: "Lifeline water engineering that still powers Vadodara's east ward distribution.",
        icon: Droplets,
        color: "#0E8A4B",
        gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      },
    ],
  },
  bengaluru: {
    cityName: "Bengaluru",
    cityTitle: "Garden City & Tech Horizon",
    vernacularName: "ಬೆಂಗಳೂರು · ಉದ್ಯಾನ ನಗರಿ",
    epithet: "The Silicon Valley & Garden Capital of India",
    intro: "From Kempe Gowda's 1537 medieval Pete and 4 watchtowers to Sir M. Visvesvaraya's engineering masterworks, Bengaluru pioneered high-plateau cascade lake systems and Asia's first electrified streetlights.",
    stories: [
      {
        id: "kempegowda-fort",
        title: "Kempe Gowda I & The 1537 Pete Settlement",
        vernacular: "ಕೆಂಪೇಗೌಡರ ಪೇಟೆ ಮತ್ತು ನಾಲ್ಕು ಗೋಪುರಗಳು",
        era: "1537 CE",
        category: "civic",
        tagline: "Visionary Four Watchtowers & Guild Trading Markets",
        civicLegacy: "Kempe Gowda demarcated Bengaluru with 4 cardinal watchtowers (Lalbagh, Kempe Gowda Tower, Bugle Rock, Ulsoor) and created specialized trade petes (Chickpet, Balepet, Tharagupet).",
        quote: "“May this settlement grow to encompass the four watchtowers.” — Kempe Gowda I",
        icon: Crown,
        color: "#FF6F00",
        gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
      },
      {
        id: "lalbagh-gardens",
        title: "Lalbagh Botanical Gardens & The Glass House",
        vernacular: "ಲಾಲ್‌ಬಾಗ್ ಸಸ್ಯತೋಟ ಮತ್ತು ಗಾಜಿನ ಮನೆ",
        era: "1760 – 1889 CE",
        category: "nature",
        tagline: "240-Acre Royal Botanical Haven with 1,854 Species",
        civicLegacy: "Commissioned by Hyder Ali and enriched by Tipu Sultan with exotic saplings from Persia and France. The 1889 Glasshouse was modeled after London's Crystal Palace.",
        quote: "The green lungs that earned Bengaluru its global title of 'The Garden City of India'.",
        icon: Trees,
        color: "#0E8A4B",
        gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
      },
      {
        id: "vidhana-soudha",
        title: "Vidhana Soudha & Attara Kacheri",
        vernacular: "ವಿಧಾನ ಸೌಧ ಮತ್ತು ಅಠಾರಾ ಕಛೇರಿ",
        era: "Built 1956 CE",
        category: "palace",
        tagline: "Neo-Dravidian Architectural Marvel of Public Governance",
        civicLegacy: "Conceived by Chief Minister Kengal Hanumanthaiah as a monument to democratic sovereignty, carved entirely from Bangalore granite and inscribed with 'Government's Work is God's Work'.",
        quote: "“Government’s Work is God’s Work” — Inscribed over the grand entrance portico.",
        icon: Landmark,
        color: "#0A369D",
        gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
      },
      {
        id: "cascade-lakes",
        title: "The 1537 Cascade Lakes & Visvesvaraya Works",
        vernacular: "ಜಲ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಸರ್ ಎಂ.ವಿ. ತಂತ್ರಜ್ಞಾನ",
        era: "16th – 20th Century",
        category: "water",
        tagline: "Gravity-Fed Interconnected Lake Reservoirs",
        civicLegacy: "Sir M. Visvesvaraya engineered gravity reservoirs and hydro-power schemes, connecting Sankey, Ulsoor, Bellandur, and Hebbal into an intelligent storm-water cascade.",
        quote: "India's greatest engineering marvel of rainwater harvesting on a high granite plateau.",
        icon: Droplets,
        color: "#0F766E",
        gradient: "from-teal-500/20 via-cyan-500/10 to-transparent",
      },
    ],
  },
};

export function CityHeritagePanel({ cityId, onSelectCity }: { cityId: CityId; onSelectCity?: (c: CityId) => void }) {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const cityData = HERITAGE_DATA[cityId] || HERITAGE_DATA.vadodara;

  const currentStory = cityData.stories.find((s) => s.id === activeStoryId) || cityData.stories[0]!;

  return (
    <section className="space-y-6 pt-16 sm:pt-24">
      {/* Section Header with Indian Tricolor Accent */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-[0.68rem] tracking-[0.14em] font-semibold text-amber-800 dark:text-amber-300 uppercase">
              Civic Heritage & Historical Foundations
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
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm backdrop-blur-xl">
            <button
              type="button"
              onClick={() => {
                onSelectCity("vadodara");
                setActiveStoryId("sayajirao-vision");
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200",
                cityId === "vadodara"
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-500/40 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              🏛️ Vadodara (VMC)
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectCity("bengaluru");
                setActiveStoryId("kempegowda-fort");
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200",
                cityId === "bengaluru"
                  ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/40 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              🌸 Bengaluru (BBMP)
            </button>
          </div>
        )}
      </div>

      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {cityData.intro}
      </p>

      {/* Main Grid: Story Selector Cards + Active Story Detail Showcase */}
      <div className="grid gap-5 lg:grid-cols-[1.1fr_1.3fr] items-start">
        {/* Left: 4 Historic Capsules */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {cityData.stories.map((story) => {
            const Icon = story.icon;
            const isSelected = currentStory.id === story.id;
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => setActiveStoryId(story.id)}
                className={cn(
                  "press relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-300 backdrop-blur-2xl group",
                  isSelected
                    ? "bg-gradient-to-br from-white/95 to-amber-50/80 dark:from-slate-900/90 dark:to-slate-800/90 border-orange-500/50 shadow-[0_12px_32px_rgba(255,111,0,0.12)] -translate-y-0.5"
                    : "bg-white/60 dark:bg-white/5 border-[var(--glass-border)] hover:bg-white/80 dark:hover:bg-white/10 hover:border-orange-500/30"
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-110 shadow-sm"
                      style={{
                        backgroundColor: `${story.color}18`,
                        border: `1px solid ${story.color}40`,
                        color: story.color,
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--foreground)] group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                        {story.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {story.era}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isSelected && "text-orange-500 translate-x-1")} />
                </div>

                <p className="mt-2.5 text-xs text-subtle line-clamp-2 leading-relaxed">
                  {story.tagline}
                </p>

                {isSelected && (
                  <span className="absolute bottom-0 inset-x-6 h-0.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Active Deep-Dive Showcase Card */}
        <GlassCard
          elevation="raised"
          className="jm-heritage-card p-6 sm:p-7 space-y-5 border-orange-500/30 bg-gradient-to-br from-white/95 via-amber-50/40 to-emerald-50/30 dark:from-slate-900/95 dark:via-slate-900/80 dark:to-slate-800/80"
        >
          <div className="flex items-center justify-between gap-3 border-b border-orange-500/15 pb-4">
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm"
                style={{
                  backgroundColor: `${currentStory.color}20`,
                  border: `1px solid ${currentStory.color}50`,
                  color: currentStory.color,
                }}
              >
                <currentStory.icon className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-orange-700 dark:text-orange-400">
                  {currentStory.era} · {cityData.cityName} Heritage
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
                  {currentStory.title}
                </h3>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <Scroll className="h-3 w-3" /> Historic Record
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              {currentStory.vernacular}
            </p>
            <p className="text-sm font-semibold text-foreground/90">
              {currentStory.tagline}
            </p>
          </div>

          {/* Civic Legacy Context */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/20 border border-amber-500/20 space-y-1.5 shadow-sm">
            <p className="text-[11px] font-bold tracking-wider text-amber-800 dark:text-amber-400 uppercase">
              🏛️ Modern Civic Infrastructure Relevance
            </p>
            <p className="text-xs leading-relaxed text-foreground/80">
              {currentStory.civicLegacy}
            </p>
          </div>

          {/* Quote Pill */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-emerald-500/10 border border-orange-500/20 italic text-xs text-muted-foreground leading-relaxed">
            {currentStory.quote}
          </div>

          {/* Tricolor Micro-Accent */}
          <div className="pt-2">
            <div className="jm-tricolor-bar" />
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
