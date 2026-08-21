import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Camera,
  ChevronRight,
  MapPin,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/site-nav";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { ClientCivicMap } from "@/components/civic-map-panel";
import { CityHeritagePanel, CityHeritageSignal } from "@/components/city-heritage-panel";
import { DEFAULT_FILTERS, areaActivity, nearestArea, type ComplaintPoint, type IssueKey, type AreaHealth } from "@/services/geography";
import { getDefaultCity, setPreferredCity, type CityId } from "@/services/cities";
import { useI18n } from "@/lib/i18n";
import { getPublicCityAggregate } from "@/services/api";
import { getCityVisuals } from "@civicsathi/visual-system";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Civic Sathi — India's Intelligent Civic & Grievance Platform" },
      {
        name: "description",
        content:
          "Report civic problems in Vadodara and Bengaluru with real-time evidence. Civic Sathi connects complaints into transparent public patterns.",
      },
      { property: "og:title", content: "Civic Sathi — Indian Civic Intelligence & Heritage" },
      {
        property: "og:description",
        content:
          "AI-driven civic grievance reporting, demographic impact modeling, and historic city infrastructure records.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    titleKey: "hiw.step1.title",
    bodyKey: "hiw.step1.body",
    titleFallback: "Report Issue",
    bodyFallback: "Tell Civic Sathi what happened in your locality.",
    icon: MessageSquareText,
    accent: "#FF6F00",
  },
  {
    n: "02",
    titleKey: "hiw.step2.title",
    bodyKey: "hiw.step2.body",
    titleFallback: "Pinpoint Location",
    bodyFallback: "Exact ward and GPS coordinates detected automatically.",
    icon: MapPin,
    accent: "#0A369D",
  },
  {
    n: "03",
    titleKey: "hiw.step3.title",
    bodyKey: "hiw.step3.body",
    titleFallback: "Visual Evidence",
    bodyFallback: "Upload geotagged photos or voice notes securely.",
    icon: Camera,
    accent: "#D97706",
  },
  {
    n: "04",
    titleKey: "hiw.step4.title",
    bodyKey: "hiw.step4.body",
    titleFallback: "Track Resolution",
    bodyFallback: "Live pipeline from municipality to verified contractors.",
    icon: Activity,
    accent: "#0E8A4B",
  },
];

function Landing() {
  const { t } = useI18n();
    const [cityId, setCityId] = useState<CityId>(() => getDefaultCity());
  const [cityAggregate, setCityAggregate] = useState<any>(null);
  const cityVisuals = useMemo(() => getCityVisuals(cityId), [cityId]);
  const cityEpithet = t(`city.${cityId}.epithet`, cityVisuals.epithet);
  const citySignal = t(`city.${cityId}.civicSignal`, cityVisuals.civicSignal);
  const cityLandmarks = t(`city.${cityId}.landmarkCue`, cityVisuals.landmarkCue);
  const cityDataLine = t(`city.${cityId}.dataLine`, cityVisuals.dataLine);

  useEffect(() => {
    let cancelled = false;
    setCityAggregate(null);
    getPublicCityAggregate(cityId)
      .then((value) => { if (!cancelled) setCityAggregate(value); })
      .catch(() => { if (!cancelled) setCityAggregate(null); });
    return () => { cancelled = true; };
  }, [cityId]);

  const publicPoints: ComplaintPoint[] = useMemo(() => (cityAggregate?.points ?? []).flatMap((point: any) => {
    const lat = Number(point.lat);
    const lng = Number(point.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];
    const category = String(point.category ?? "").toLowerCase();
    const issue: IssueKey = category.includes("water") ? "water" : category.includes("road") ? "roads" : category.includes("garbage") ? "garbage" : category.includes("drainage") ? "drainage" : category.includes("light") ? "lighting" : "other";
    const health = (["low", "moderate", "high", "critical"] as AreaHealth[]).includes(point.health) ? point.health as AreaHealth : "low";
    const area = nearestArea(cityId, lat, lng);
    return [{ id: String(point.id), areaId: area?.id ?? `${cityId}-unassigned`, issue, category: String(point.category ?? "other"), health, daysAgo: Math.max(0, Number(point.days_ago ?? 0)), lat, lng, count: Math.max(1, Number(point.count ?? 1)), resolved: Math.max(0, Number(point.resolved ?? 0)), risk: Math.max(0, Number(point.risk ?? 0)) }];
  }), [cityAggregate, cityId]);
  const publicActivities = useMemo(() => areaActivity(cityId, DEFAULT_FILTERS, publicPoints), [cityId, publicPoints]);

  const handleCitySelect = (c: CityId) => {
    setCityId(c);
    setPreferredCity(c);
  };

  return (
    <PageShell dataCity={cityId} className="pt-24 sm:pt-32">
      {/* Hero Section */}
      <section className="civic-atmosphere-panel grid items-center gap-10 rounded-[2rem] p-5 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:p-10">
        <div className="animate-rise space-y-7">
          {/* Indian Civic Trust Badge */}
          <div className="civic-city-chip w-fit">
            <span className="h-2 w-2 rounded-full bg-[var(--civic-city-accent)] animate-pulse" aria-hidden="true" />
            <span className="text-[0.68rem] tracking-[0.14em] font-bold uppercase">
              {cityVisuals.authority} · {t("home.hero.badge", "Civic intelligence")}
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-3xl leading-[1.05] font-extrabold sm:text-5xl lg:text-[3.55rem] text-[var(--foreground)]">
              {t("home.hero.title", "Civic intelligence for")} {" "}
              <span className="jm-indian-gradient-text">{cityVisuals.cityName}.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--civic-muted)]">
              <span className="civic-city-chip"><MapPin className="h-3.5 w-3.5" aria-hidden />{cityVisuals.vernacularName}</span>
              <span>{cityEpithet}</span>
            </div>
            <div className="civic-architecture-rule" aria-hidden="true" />
            <p className="max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
              {t(
                "home.hero.desc",
                "Report water contamination, broken roads, sanitation, and streetlights with instant location evidence. Civic Sathi groups local complaints into transparent municipal patterns.",
              )}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <GlassButton
              asChild
              size="lg"
              style={{ backgroundColor: cityVisuals.accent, boxShadow: `0 14px 30px ${cityVisuals.accent}33` }}
              className="w-full border border-white/25 text-white hover:brightness-110 sm:w-auto"
            >
              <Link to="/report">
                <Sparkles className="h-4 w-4 mr-1 text-amber-200" />
                {t("nav.report", "Report a problem")}
                <ChevronRight className="h-4 w-4 ml-1" aria-hidden />
              </Link>
            </GlassButton>
            <GlassButton asChild size="lg" variant="glass" className="w-full sm:w-auto border-orange-500/25 hover:border-orange-500/50">
              <a href="#how-it-works">{t("home.hero.howitworks", "How it works")}</a>
            </GlassButton>
          </div>

          <div className="civic-data-rail text-xs text-subtle">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{t("home.trust.privacy", "Privacy protected")}</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{t("home.trust.linked", "Municipality linked")}</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[var(--civic-teal-600)]" />{cityLandmarks}</span>
          </div>
        </div>

        {/* Home Hero Map with Neo-Glassmorphism */}
        <div className="animate-rise [animation-delay:120ms]">
          <GlassCard elevation="raised" className="civic-atmosphere-panel overflow-hidden rounded-[1.6rem] p-4 space-y-3 border-[var(--glass-border)] shadow-2xl">
            {/* Multi-City Equal Switcher */}
            <div className="flex items-center justify-between gap-2 px-1 pb-1">
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 dark:bg-black/30 border border-orange-500/25 shadow-sm">
                <button
                  type="button"
                  onClick={() => handleCitySelect("vadodara")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    cityId === "vadodara"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400/40"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("map.city.vadodara", "Vadodara · VMC")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCitySelect("bengaluru")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    cityId === "bengaluru"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-blue-400/40"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("map.city.bengaluru", "Bengaluru · BBMP")}
                </button>
              </div>

              <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-300">
                {cityAggregate ? `${Number(cityAggregate.aggregate_points ?? 0).toLocaleString("en-IN")} ${t("home.map.clusters", "live map clusters")}` : t("home.map.loading", "Loading live city data…")}
              </span>
            </div>

            <ClientCivicMap
              cityId={cityId}
              mode="health"
              activities={publicActivities}
              points={publicPoints}
              selectedAreaId={null}
              onSelectArea={() => {}}
              compact
              className="h-[320px] sm:h-[420px] rounded-2xl overflow-hidden shadow-inner"
            />
            <div className="flex items-center justify-between gap-3 px-1.5 pt-1.5 pb-0.5">
              <p className="text-[0.7rem] tracking-[0.08em] font-semibold text-amber-900 dark:text-amber-200 uppercase">
                {cityDataLine} · {citySignal}
              </p>
              <Link
                to="/map"
                className="text-xs font-bold text-orange-700 dark:text-orange-400 underline-offset-4 hover:underline"
              >
                {t("home.map.explore", "Explore Full Civic Map →")}
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* City Cultural & Civic Heritage Signal — visible before the deeper story panel */}
      <CityHeritageSignal cityId={cityId} />

      {/* City Cultural & Civic Heritage Section */}
      <CityHeritagePanel cityId={cityId} onSelectCity={handleCitySelect} />

      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-mt-28 pt-20 sm:pt-28">
        <SectionLabel>{t("hiw.label", "The Civic Journey")}</SectionLabel>
        <h2 className="mt-3 max-w-xl text-2xl font-bold sm:text-3xl lg:text-4xl text-[var(--foreground)]">
          {t("hiw.heading", "Four steps from a problem on your street to a tracked civic record.")}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <GlassCard
              key={s.n}
              interactive
              className="animate-rise p-5 border-orange-500/20 bg-white/75 dark:bg-slate-900/60"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300">
                  {s.n}
                </span>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl shadow-sm"
                  style={{ backgroundColor: `${s.accent}15`, color: s.accent }}
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                </span>
              </div>
<h3 className="mt-5 text-base font-bold text-[var(--foreground)]">{t(s.titleKey, s.titleFallback)}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{t(s.bodyKey, s.bodyFallback)}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* About Municipal Governance */}
      <section className="pt-20 sm:pt-28">
        <GlassCard elevation="raised" className="p-6 sm:p-9 border-amber-500/30 bg-gradient-to-br from-amber-50/40 via-white/80 to-orange-50/40 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-800/70">
<SectionLabel>{t("governance.label", "Indian Local Governance")}</SectionLabel>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl text-[var(--foreground)]">
            {t("governance.heading", "Empowered by the 74th Amendment")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t("governance.desc", "The 74th Constitutional Amendment Act of 1992 recognized Urban Local Bodies (ULBs) as the third tier of government. Civic Sathi empowers this democratic structure by directly connecting citizens with their local Ward Corporators, Municipal Engineers, and Civic Departments.")}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[var(--glass-border)]">
<h3 className="font-semibold text-amber-800 dark:text-amber-300">{t("governance.wards.title", "Wards")}</h3>
              <p className="text-xs text-muted-foreground">{t("governance.wards.body", "Cities are divided into administrative and electoral units called Wards, each representing a localized neighborhood.")}</p>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[var(--glass-border)]">
<h3 className="font-semibold text-emerald-800 dark:text-emerald-300">{t("governance.corporators.title", "Corporators")}</h3>
              <p className="text-xs text-muted-foreground">{t("governance.corporators.body", "Elected representatives of the ward who oversee local civic issues, budget allocation, and development projects.")}</p>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[var(--glass-border)]">
<h3 className="font-semibold text-blue-800 dark:text-blue-300">{t("governance.engineers.title", "Municipal Engineers")}</h3>
              <p className="text-xs text-muted-foreground">{t("governance.engineers.body", "Executive officers responsible for executing public works, managing contractors, and ensuring quality SLAs.")}</p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Pattern Detection Section */}
      <section className="pt-20 sm:pt-28">
        <GlassCard
          elevation="raised"
          className="grid gap-8 p-6 sm:p-9 lg:grid-cols-2 border-orange-500/30 bg-gradient-to-br from-white/90 via-amber-50/40 to-emerald-50/30 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-800/70"
        >
          <div className="space-y-4">
            <SectionLabel>{t("pattern.label", "AI Pattern Detection")}</SectionLabel>
            <h2 className="text-2xl font-bold sm:text-3xl text-[var(--foreground)]">
              {t("pattern.heading", "One report is a complaint. Many reports are a civic pattern.")}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t(
                "pattern.desc",
                "When several citizens describe a similar issue nearby, Civic Sathi groups them into an aggregated hotspot — without exposing anyone's identity or exact private address.",
              )}
            </p>
            <ul className="space-y-2.5 pt-1">
{[
                t("pattern.bullet1", "23 similar reports detected within approximately 500m"),
                t("pattern.bullet2", "Automated routing to verified municipal contractors"),
                t("pattern.bullet3", "Public aggregate view only — zero citizen surveillance"),
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground font-medium">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <SectionLabel>{t("pattern.issues.label", "Categories Covered")}</SectionLabel>
            <div className="flex flex-wrap gap-2 pt-1">
              {              [
                { key: "pattern.category.water", color: "bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30" },
                { key: "pattern.category.roads", color: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30" },
                { key: "pattern.category.drainage", color: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30" },
                { key: "pattern.category.sanitation", color: "bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30" },
                { key: "pattern.category.lighting", color: "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30" },
                { key: "pattern.category.parks", color: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30" },
              ].map((cat) => (
                <span
                  key={cat.key}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold shadow-xs ${cat.color}`}
                >
                  {t(cat.key, cat.key)}
                </span>
              ))}
            </div>
            <div className="pt-3">
              <GlassButton asChild variant="primary" size="md" className="shadow-md font-bold">
                <Link to="/report">{t("pattern.startreport", "Start a Report →")}</Link>
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Stats Summary */}
      <section className="pt-14 sm:pt-20">
              <SectionLabel>{t("stats.label", "Civic Live Intelligence")}</SectionLabel>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [cityAggregate ? Number(cityAggregate.total_reports ?? 0).toLocaleString("en-IN") : "—", t("stats.city_reports", "Reports in selected city · 30 days"), "📋"],
            [cityAggregate ? Number(cityAggregate.last7_days ?? 0).toLocaleString("en-IN") : "—", t("stats.last7_reports", "Reports in the last 7 days"), "📈"],
            [cityAggregate ? Number(cityAggregate.aggregate_points ?? 0).toLocaleString("en-IN") : "—", t("stats.aggregate_points", "Live map clusters"), "📍"],
            [cityId === "vadodara" ? "VMC" : "BBMP", t("stats.city_scope", "Selected municipal authority"), "🏛️"],
          ].map(([v, k, icon]) => (
            <GlassCard key={k} className="p-4 border-orange-500/20 bg-white/70 dark:bg-slate-900/60">
              <dd className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                <span>{icon}</span> {v}
              </dd>
              <dt className="text-[0.66rem] tracking-[0.08em] font-semibold text-muted-foreground uppercase mt-1.5">
                {k}
              </dt>
            </GlassCard>
          ))}
        </dl>
      </section>

      {/* Footer with Indian Civic Watermark */}
      <footer className="mt-20 border-t border-orange-500/20 pt-8 pb-6 text-xs text-subtle">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-[0.14em] uppercase text-amber-900 dark:text-amber-200">
              Civic Sathi · જન મન
            </span>
            <span className="text-[10px] text-muted-foreground">· {t("home.footer.built", "Built for Indian Cities")}</span>
          </div>
          <span className="text-muted-foreground font-medium">
            સત્યમેવ જયતે · सत्यमेव जयते · Satyameva Jayate
          </span>
        </div>
      </footer>
    </PageShell>
  );
}

