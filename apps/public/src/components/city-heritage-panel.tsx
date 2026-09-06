import { useState } from "react";
import { Landmark, Sparkles, Building2, Droplets, Crown, Scroll, ChevronRight } from "lucide-react";
import { type CityId } from "@/services/cities";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { getCityVisuals } from "@civicsathi/visual-system";
import { GlassCard } from "@/components/ui/glass-card";

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
    cityTitle: "સંસ્કારી નગરી — City of Culture",
    vernacularName: "વડોદરા · ગાયકવાડ રાજવંશનો ગૌરવશાળી વારસો",
    epithet: "The Cultural Capital of Gujarat & Seat of the Gaekwad Dynasty",
    intro: "Known as the 'Sanskari Nagari' (City of Culture), Vadodara rose to prominence under the visionary Gaekwad rulers who championed education, art, and modern governance. Home to the magnificent Laxmi Vilas Palace — one of the largest private residences in the world — and the sprawling Sayaji Baug gardens, Vadodara seamlessly blends royal heritage with progressive civic infrastructure.",
    stories: [
      {
        id: "laxmi-vilas-palace",
        title: "Laxmi Vilas Palace — Crown of the Gaekwad Dynasty",
        vernacular: "લક્ષ્મી વિલાસ પૅલેસ — ગાયકવાડ રાજવંશનો તાજ",
        era: "1890 CE",
        category: "palace",
        tagline: "Indo-Saracenic Marvel, Four Times the Size of Buckingham Palace",
        civicLegacy: "Commissioned by Maharaja Sayajirao Gaekwad III, Laxmi Vilas Palace is an Indo-Saracenic architectural masterpiece spread over 700 acres. Its intricate mosaics, Venetian glass, and sprawling gardens reflect the Gaekwad dynasty's vision for blending Eastern and Western aesthetics into a symbol of progressive Indian governance.",
        quote: "A palace built not merely for royalty, but as a testament to what Indian civic ambition can achieve.",
        icon: Crown,
        color: "#C86B18",
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "sayaji-baug",
        title: "Sayaji Baug — Gujarat's Green Heritage",
        vernacular: "સયાજી બાગ — ગુજરાતનો હરિયાળો વારસો",
        era: "1879 CE",
        category: "nature",
        tagline: "Historic 113-Acre Urban Garden with Museum, Zoo & Planetarium",
        civicLegacy: "Designed by Maharaja Sayajirao III, these sprawling gardens house the Baroda Museum, a zoo, a planetarium, and a health museum. They stand as a pioneering example of public civic infrastructure in colonial India, bringing education and recreation to all citizens regardless of caste.",
        quote: "Sayajirao opened these gates for every citizen of Vadodara — a radical act of inclusion in 19th-century India.",
        icon: Landmark,
        color: "#16A34A",
        gradient: "from-green-500/20 via-emerald-500/10 to-transparent",
      },
      {
        id: "kirti-mandir",
        title: "Kirti Mandir — Gaekwad Royal Memorial",
        vernacular: "કીર્તિ મંદિર — ગાયકવાડ રાજવી સ્મારક",
        era: "1936 CE",
        category: "civic",
        tagline: "Hindu-Gothic Memorial with Murals by Nandalal Bose",
        civicLegacy: "A memorial to the Gaekwad royal family, Kirti Mandir features stunning murals by the legendary painter Nandalal Bose, depicting scenes from the life of the Gaekwads. It serves as a cultural anchor connecting modern Vadodara to its royal past.",
        quote: "Within these walls, the story of Vadodara's enlightened rulers lives on through art and stone.",
        icon: Building2,
        color: "#B91C1C",
        gradient: "from-red-500/20 via-rose-500/10 to-transparent",
      },
      {
        id: "sursagar-lake",
        title: "Sursagar Lake — Heart of the City",
        vernacular: "સુરસાગર તળાવ — શહેરનું હૃદય",
        era: "Historic",
        category: "water",
        tagline: "Iconic Urban Lake with 120-ft Shiva Statue",
        civicLegacy: "Located in the heart of old Vadodara, Sursagar Lake has been a civic gathering space for centuries. Its recent beautification, centered around a towering 120-ft statue of Lord Shiva, transformed it into a landmark of urban rejuvenation and community pride.",
        quote: "From a neglected tank to the jewel of Vadodara's skyline — Sursagar embodies civic renewal.",
        icon: Droplets,
        color: "#0E7490",
        gradient: "from-cyan-500/20 via-teal-500/10 to-transparent",
      },
    ],
  },
  mumbai: {
    cityName: "Mumbai",
    cityTitle: "मुंबई · Gateway of Dreams",
    vernacularName: "मुंबई · भारत का आर्थिक हृदय",
    epithet: "India's Financial Capital & City of Dreams",
    intro: "From the grandeur of the Gateway of India to the bustling lanes of Dadar, Mumbai is a city where colonial-era civic engineering meets modern ambition. Home to UNESCO World Heritage Sites and some of the world's most iconic civic infrastructure, Mumbai's heritage tells the story of India's commercial and cultural evolution.",
    stories: [
      {
        id: "gateway-of-india",
        title: "Gateway of India — Monument of Empire & Freedom",
        vernacular: "गेटवे ऑफ इंडिया — साम्राज्य और स्वतंत्रता का स्मारक",
        era: "1924 CE",
        category: "civic",
        tagline: "Indo-Saracenic Arch Overlooking the Arabian Sea",
        civicLegacy: "Built to commemorate the landing of King George V and Queen Mary, the Gateway of India later witnessed the departure of the last British troops in 1948. This iconic arch, blending Hindu and Muslim architectural motifs, stands as Mumbai's eternal symbol of resilience and transformation.",
        quote: "Through this gate, an empire arrived — and through it, a nation reclaimed its destiny.",
        icon: Landmark,
        color: "#1D4ED8",
        gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
      },
      {
        id: "cst-station",
        title: "Chhatrapati Shivaji Terminus (CST) — UNESCO Heritage",
        vernacular: "छत्रपती शिवाजी टर्मिनस — युनेस्को विश्व वारसा",
        era: "1888 CE",
        category: "civic",
        tagline: "Victorian-Gothic Railway Cathedral, UNESCO World Heritage Site",
        civicLegacy: "Originally named Victoria Terminus, CST is a masterpiece of Victorian-Gothic architecture fused with traditional Indian elements. Designed by F.W. Stevens, it has served as Mumbai's lifeline — handling over 3 million commuters daily. Its stained glass, ornate stonework, and soaring dome make it one of the finest railway stations ever built.",
        quote: "More than a station, CST is the beating heart of Mumbai — where millions begin their journey every dawn.",
        icon: Building2,
        color: "#9333EA",
        gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
      },
      {
        id: "marine-drive",
        title: "Marine Drive — The Queen's Necklace",
        vernacular: "मरीन ड्राईव्ह — राणीचा हार",
        era: "1940 CE",
        category: "nature",
        tagline: "3.6 km Art Deco Promenade Along Back Bay",
        civicLegacy: "This sweeping crescent-shaped boulevard lined with Art Deco buildings is Mumbai's most iconic promenade. When lit at night, its streetlights form a glittering arc known as the Queen's Necklace. It represents a triumph of early 20th-century urban planning and coastal engineering.",
        quote: "Mumbai's soul lives on Marine Drive — where the city meets the sea under a necklace of lights.",
        icon: Crown,
        color: "#C86B18",
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "elephanta-caves",
        title: "Elephanta Caves — UNESCO World Heritage",
        vernacular: "एलिफंटा लेणी — युनेस्को जागतिक वारसा",
        era: "5th–8th Century CE",
        category: "palace",
        tagline: "Rock-Cut Cave Temples Dedicated to Lord Shiva",
        civicLegacy: "Located on Elephanta Island in Mumbai Harbour, these magnificent rock-cut cave temples contain some of the finest examples of Indian rock art. The 20-foot Trimurti sculpture of Shiva is considered one of the masterpieces of Indian sculpture. Designated a UNESCO World Heritage Site in 1987.",
        quote: "Carved from living rock, the Elephanta Trimurti embodies the eternal creative force of Indian civilization.",
        icon: Scroll,
        color: "#059669",
        gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      },
    ],
  },
  bengaluru: {
    cityName: "Bengaluru",
    cityTitle: "ಬೆಂಗಳೂರು · Silicon Valley of India",
    vernacularName: "ಬೆಂಗಳೂರು · ಉದ್ಯಾನನಗರಿ — Garden City",
    epithet: "India's Technology Capital & Garden City",
    intro: "From the majestic Vidhana Soudha to the serene Lalbagh Botanical Garden, Bengaluru harmonizes centuries of Dravidian and colonial heritage with cutting-edge innovation. Home to India's space program and tech industry, Bengaluru's civic legacy is built on a foundation of gardens, tanks, and forward-thinking governance.",
    stories: [
      {
        id: "vidhana-soudha",
        title: "Vidhana Soudha — Seat of Karnataka's Democracy",
        vernacular: "ವಿಧಾನ ಸೌಧ — ಕರ್ನಾಟಕ ಪ್ರಜಾಪ್ರಭುತ್ವದ ಕೇಂದ್ರ",
        era: "1956 CE",
        category: "civic",
        tagline: "Neo-Dravidian Granite Legislative Assembly Building",
        civicLegacy: "One of the most impressive legislative buildings in India, Vidhana Soudha was built by Chief Minister Kengal Hanumanthaiah to showcase Indian talent and craftsmanship. Constructed entirely with Indian materials and labor, its inscription 'Government Work is God's Work' captures the spirit of public service.",
        quote: "Built by the people, for the people — Vidhana Soudha is democracy carved in granite.",
        icon: Building2,
        color: "#B91C1C",
        gradient: "from-red-500/20 via-rose-500/10 to-transparent",
      },
      {
        id: "lalbagh",
        title: "Lalbagh Botanical Garden — Living Heritage",
        vernacular: "ಲಾಲ್‌ಬಾಗ್ ಸಸ್ಯೋದ್ಯಾನ — ಜೀವಂತ ಪರಂಪರೆ",
        era: "1760 CE",
        category: "nature",
        tagline: "240-Acre Garden with 1,854 Species of Plants",
        civicLegacy: "Founded by Hyder Ali and expanded by Tipu Sultan, Lalbagh is home to one of the largest collections of tropical and sub-tropical plants in India. Its iconic Glass House, modeled after London's Crystal Palace, hosts the famous biannual flower shows that draw millions of visitors.",
        quote: "From Hyder Ali's royal garden to Bengaluru's green lung — Lalbagh breathes life into the city.",
        icon: Landmark,
        color: "#16A34A",
        gradient: "from-green-500/20 via-emerald-500/10 to-transparent",
      },
      {
        id: "bangalore-palace",
        title: "Bangalore Palace — Tudor-Revival Grandeur",
        vernacular: "ಬೆಂಗಳೂರು ಅರಮನೆ — ಟ್ಯೂಡರ್ ವೈಭವ",
        era: "1878 CE",
        category: "palace",
        tagline: "English Tudor-Style Palace on 454-Acre Grounds",
        civicLegacy: "Inspired by England's Windsor Castle, Bangalore Palace was built by the Wadiyar dynasty and features fortified towers, Gothic windows, and elegant wooden interiors. The surrounding grounds, now in the heart of the city, serve as a major cultural and event venue.",
        quote: "A slice of Tudor England in tropical India — the Palace bridges two worlds across centuries.",
        icon: Crown,
        color: "#C86B18",
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "tipu-sultan-palace",
        title: "Tipu Sultan's Summer Palace — Tiger of Mysore",
        vernacular: "ಟಿಪ್ಪು ಸುಲ್ತಾನ್ ಬೇಸಿಗೆ ಅರಮನೆ",
        era: "1791 CE",
        category: "palace",
        tagline: "Indo-Islamic Teak Palace with Ornate Frescoes",
        civicLegacy: "Known as 'Rash-e-Jannat' (Envy of Heaven), this entirely teak-built palace served as Tipu Sultan's summer retreat. Its ornate arches, balconies, and floral frescoes showcase the finest Indo-Islamic architecture. Today it houses a museum dedicated to the Tiger of Mysore.",
        quote: "Tipu dreamed of paradise on earth — and built it in wood, paint, and defiance.",
        icon: Scroll,
        color: "#059669",
        gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      },
    ],
  },
  delhi: {
    cityName: "Delhi",
    cityTitle: "दिल्ली · India's Eternal Capital",
    vernacularName: "दिल्ली · सात शहरों का शहर — City of Seven Cities",
    epithet: "India's Political Capital & Living Museum of Civilizations",
    intro: "From the Mughal magnificence of the Red Fort to the colonial grandeur of Rashtrapati Bhavan, Delhi is a living museum spanning seven historic cities and over a millennium of continuous civilization. Its streets weave through the relics of Sultanate, Mughal, British, and modern democratic India.",
    stories: [
      {
        id: "red-fort",
        title: "Red Fort (Lal Qila) — UNESCO World Heritage",
        vernacular: "लाल क़िला — युनेस्को विश्व धरोहर",
        era: "1648 CE",
        category: "palace",
        tagline: "Mughal Citadel Where India's Independence Was Proclaimed",
        civicLegacy: "Commissioned by Emperor Shah Jahan, the Red Fort served as the main residence of Mughal emperors for nearly 200 years. Every year on India's Independence Day, the Prime Minister hoists the national flag from its ramparts and addresses the nation — making it the living symbol of Indian sovereignty.",
        quote: "From these ramparts, the tricolor was unfurled to declare a nation's freedom — a moment carved into eternity.",
        icon: Crown,
        color: "#B91C1C",
        gradient: "from-red-500/20 via-rose-500/10 to-transparent",
      },
      {
        id: "india-gate",
        title: "India Gate — Memorial to the Fallen",
        vernacular: "इंडिया गेट — शहीदों का स्मारक",
        era: "1931 CE",
        category: "civic",
        tagline: "42-Metre War Memorial on Rajpath",
        civicLegacy: "Originally named the All India War Memorial, India Gate commemorates the 82,000 soldiers of the British Indian Army who died in World War I and the Third Anglo-Afghan War. The Amar Jawan Jyoti beneath its arch burns as an eternal flame honoring India's fallen warriors.",
        quote: "India Gate stands where grief meets gratitude — a nation's salute to those who gave everything.",
        icon: Landmark,
        color: "#C86B18",
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "qutub-minar",
        title: "Qutub Minar — UNESCO World Heritage",
        vernacular: "क़ुतुब मीनार — युनेस्को विश्व धरोहर",
        era: "1193 CE",
        category: "civic",
        tagline: "73-Metre Victory Tower, World's Tallest Brick Minaret",
        civicLegacy: "The Qutub Minar complex marks the beginning of Islamic rule in India. This soaring five-storey tower of red sandstone and marble, with its intricate Quranic inscriptions and geometric patterns, is surrounded by a complex of historically significant monuments including the Iron Pillar of Delhi.",
        quote: "Eight centuries tall and still reaching — Qutub Minar is Delhi's oldest sentinel.",
        icon: Building2,
        color: "#9333EA",
        gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
      },
      {
        id: "humayuns-tomb",
        title: "Humayun's Tomb — Garden of the Sleeping King",
        vernacular: "हुमायूँ का मक़बरा — सोते हुए बादशाह का बाग़",
        era: "1572 CE",
        category: "palace",
        tagline: "Mughal Garden Tomb, Precursor to the Taj Mahal",
        civicLegacy: "Commissioned by Empress Bega Begum, Humayun's Tomb was the first garden-tomb on the Indian subcontinent and inspired the architectural lineage that culminated in the Taj Mahal. Its Persian charbagh garden, red sandstone facade, and white marble dome set new standards for Mughal funerary architecture.",
        quote: "In this garden of eternity, a grieving queen created the architectural language that would birth the Taj Mahal.",
        icon: Scroll,
        color: "#059669",
        gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      },
    ],
  },
};

export function CityHeritageSignal({ cityId }: { cityId: CityId }) {
  const cityData = HERITAGE_DATA[cityId] || HERITAGE_DATA.vadodara;
  const cityVisuals = getCityVisuals(cityId);
  const story = cityData.stories[0]!;
  const Icon = story.icon;

  return (
    <div className="civic-heritage-signal" style={{ "--heritage-accent": cityVisuals.accent } as React.CSSProperties}>
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--heritage-accent)]/30 bg-[var(--heritage-accent)]/10 text-[var(--heritage-accent)]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--heritage-accent)]">{cityVisuals.authority} · Civic heritage signal</p>
          <p className="mt-1 truncate text-sm font-bold text-[var(--foreground)]">{story.title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{story.tagline} · {cityVisuals.architecture}</p>
        </div>
      </div>
      <a href="#city-heritage" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--heritage-accent)] underline-offset-4 hover:underline">
        Explore {cityData.cityName} heritage <ChevronRight className="h-3.5 w-3.5" aria-hidden />
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
  const cityData = HERITAGE_DATA[cityId] || HERITAGE_DATA.vadodara;

  const currentStory = cityData.stories.find((s) => s.id === activeStoryId) || cityData.stories[0]!;
  const Icon = currentStory.icon;

  const cities: Array<{ id: CityId; label: string }> = [
    { id: "vadodara", label: "Vadodara · VMC" },
    { id: "mumbai", label: "Mumbai · BMC" },
    { id: "bengaluru", label: "Bengaluru · BBMP" },
    { id: "delhi", label: "Delhi · MCD" },
  ];

  return (
    <section id="city-heritage" className="space-y-6 pt-16 sm:pt-24">
      {/* Section Header */}
      <GlassCard className="p-6 sm:p-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-[0.68rem] tracking-[0.14em] font-semibold text-amber-800 dark:text-amber-300 uppercase">
                {t("heritage.heading", "Indian Civic Heritage & Historical Engineering")}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-foreground">
              {cityData.cityName} <span className="jm-indian-gradient-text">· {cityData.cityTitle}</span>
            </h2>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {cityData.vernacularName}
            </p>
          </div>

          {/* City Toggle if callback provided */}
          {onSelectCity && (
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-elevated)] border border-[var(--glass-border)] shadow-sm">
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
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="max-w-3xl text-sm leading-relaxed text-foreground font-medium">
          {cityData.intro}
        </p>
      </GlassCard>

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
                "p-5 text-left transition-all border rounded-2xl group",
                isActive
                  ? "border-[#F4801A] bg-[var(--surface-elevated)] shadow-md ring-1 ring-[#F4801A]"
                  : "border-[var(--glass-border)] bg-[var(--glass)] hover:bg-[var(--surface)]"
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
              <div className="pt-2 border-t border-[var(--glass-border)] mt-3">
                <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  {s.vernacular}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Story Spotlight */}
      <GlassCard className="p-6">
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
      </GlassCard>
    </section>
  );
}
