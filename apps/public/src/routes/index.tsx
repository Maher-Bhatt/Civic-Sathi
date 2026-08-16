import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Camera,
  ChevronRight,
  MapPin,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/site-nav";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { ClientCivicMap } from "@/components/civic-map-panel";
import { DEFAULT_FILTERS, areaActivity } from "@/services/geography";
import { ISSUE_TYPES } from "@/services/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JANMIND — Report civic problems, see the bigger pattern" },
      {
        name: "description",
        content:
          "JANMIND lets citizens report water, road, garbage, drainage and lighting issues with location and photo evidence, then connects them into civic patterns.",
      },
      { property: "og:title", content: "JANMIND — Government Grievance Intelligence" },
      {
        property: "og:description",
        content:
          "Report civic problems with location and evidence. JANMIND connects individual complaints into larger patterns.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    title: "Report",
    body: "Tell JANMIND what happened.",
    icon: MessageSquareText,
  },
  {
    n: "02",
    title: "Location",
    body: "Use your current location or choose a location manually.",
    icon: MapPin,
  },
  { n: "03", title: "Evidence", body: "Upload a photo if available.", icon: Camera },
  { n: "04", title: "Track", body: "Follow your complaint and receive updates.", icon: Activity },
];

function Landing() {
  const { t } = useI18n();
  return (
    <PageShell className="pt-24 sm:pt-32">
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="animate-rise space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1.5 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
            <span className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">
              {t("home.hero.badge", "Citizen portal")}
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="text-3xl leading-[1.08] font-semibold sm:text-5xl lg:text-[3.4rem]">
              {t("home.hero.subtitle", "Tell us what's happening in your city.")}
            </h1>
            <p className="max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
              {t(
                "home.hero.desc",
                "Report a civic problem with your location and evidence. JANMIND helps connect similar reports so important issues can be identified faster.",
              )}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <GlassButton asChild size="lg" className="w-full sm:w-auto">
              <Link to="/report">
                {t("nav.report", "Report a problem")}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </GlassButton>
            <GlassButton asChild size="lg" variant="glass" className="w-full sm:w-auto">
              <a href="#how-it-works">{t("home.hero.howitworks", "How it works")}</a>
            </GlassButton>
          </div>

          <p className="text-xs leading-relaxed text-subtle">
            {t("home.hero.smallprint", "Takes about a minute. You don't need to know the department or the category — JANMIND suggests them for you.")}
          </p>
        </div>

        <div className="animate-rise [animation-delay:120ms]">
          <GlassCard elevation="raised" className="overflow-hidden p-3">
            <ClientCivicMap
              cityId="vadodara"
              mode="health"
              activities={areaActivity("vadodara", DEFAULT_FILTERS)}
              points={[]}
              selectedAreaId={null}
              onSelectArea={() => {}}
              compact
              className="h-[320px] sm:h-[420px]"
            />
            <div className="flex items-center justify-between gap-3 px-1.5 pt-2.5 pb-0.5">
              <p className="text-[0.68rem] tracking-[0.08em] text-subtle uppercase">
                {t("map.card.label", "Locality civic activity — sample data")}
              </p>
              <Link
                to="/map"
                className="text-xs text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80"
              >
                {t("map.card.open", "Open Civic Map")}
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 pt-20 sm:pt-28">
        <SectionLabel>{t("hiw.label", "How it works")}</SectionLabel>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold sm:text-3xl">
          {t("hiw.heading", "Four steps from a problem on your street to a tracked civic record.")}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", titleKey: "hiw.step1.title", bodyKey: "hiw.step1.body", icon: MessageSquareText },
            { n: "02", titleKey: "hiw.step2.title", bodyKey: "hiw.step2.body", icon: MapPin },
            { n: "03", titleKey: "hiw.step3.title", bodyKey: "hiw.step3.body", icon: Camera },
            { n: "04", titleKey: "hiw.step4.title", bodyKey: "hiw.step4.body", icon: Activity },
          ].map((s, i) => (
            <GlassCard
              key={s.n}
              interactive
              className="animate-rise p-5"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="label-xs">{s.n}</span>
                <s.icon className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <h3 className="mt-6 text-base font-semibold">{t(s.titleKey)}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t(s.bodyKey)}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="pt-20 sm:pt-28">
        <GlassCard elevation="raised" className="grid gap-8 p-6 sm:p-9 lg:grid-cols-2">
          <div className="space-y-4">
            <SectionLabel>{t("pattern.label", "Pattern detection")}</SectionLabel>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              {t("pattern.heading", "One report is a complaint. Many reports are a pattern.")}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("pattern.desc", "When several citizens describe a similar issue nearby, JANMIND groups them into an aggregated hotspot — without exposing anyone's identity or exact private address.")}
            </p>
            <ul className="space-y-2.5 pt-1">
              {[
                t("pattern.bullet1", "23 similar reports within approximately 500m"),
                t("pattern.bullet2", "127 related reports in Ward 14"),
                t("pattern.bullet3", "Aggregate view only — no personal details shared"),
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <SectionLabel>{t("pattern.issues.label", "Issues you can report")}</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {ISSUE_TYPES.map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-border bg-[var(--glass)] px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {type}
                </span>
              ))}
            </div>
            <GlassButton asChild className="mt-4" variant="glass">
              <Link to="/report">{t("pattern.startreport", "Start a report")}</Link>
            </GlassButton>
          </div>
        </GlassCard>
      </section>

      <section className="pt-14 sm:pt-20">
        <SectionLabel>{t("stats.label", "Civic intelligence — sample data")}</SectionLabel>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["127", t("stats.reports", "Related reports in Ward 14")],
            ["9",   t("stats.types",   "Issue types")],
            ["24h", t("stats.update",  "Median first update")],
            ["2",   t("stats.cities",  "Cities supported")],
          ].map(([v, k]) => (
            <GlassCard key={k} className="px-4 py-4">
              <dd className="text-xl font-semibold">{v}</dd>
              <dt className="label-xs mt-1">{k}</dt>
            </GlassCard>
          ))}
        </dl>
      </section>

      <footer className="mt-20 border-t border-border pt-8 pb-4 text-xs text-subtle">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="tracking-[0.14em] uppercase">{t("footer.brand", "JANMIND — Citizen Portal")}</span>
          <span>{t("footer.note", "Prototype interface. Data shown is sample data.")}</span>
        </div>
      </footer>
    </PageShell>
  );
}
