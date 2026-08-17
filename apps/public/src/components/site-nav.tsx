import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, FileText, Home, Map, Menu, PlusCircle, User, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlassButton } from "@/components/ui/glass-button";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", tKey: "nav.home", defaultLabel: "Home" },
  { to: "/map", tKey: "nav.map", defaultLabel: "Civic Map" },
  { to: "/", tKey: "nav.howitworks", defaultLabel: "How It Works", hash: true },
  { to: "/report", tKey: "nav.report", defaultLabel: "Report Problem" },
  { to: "/complaints", tKey: "nav.complaints", defaultLabel: "My Complaints" },
] as const;

const mobileTabs = [
  { to: "/", tKey: "nav.home", defaultLabel: "Home", icon: Home },
  { to: "/map", tKey: "nav.map", defaultLabel: "Map", icon: Map },
  { to: "/report", tKey: "nav.report", defaultLabel: "Report", icon: PlusCircle },
  { to: "/complaints", tKey: "nav.complaints", defaultLabel: "Reports", icon: FileText },
  { to: "/profile", tKey: "nav.profile", defaultLabel: "Profile", icon: User },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label={t('ui.primary')}
        className={cn(
          "mx-auto flex max-w-6xl items-center gap-3 rounded-2xl border border-[var(--glass-border)] px-3 py-2.5 transition-all duration-300 ease-out sm:px-4",
          scrolled
            ? "bg-[var(--glass-strong)] shadow-[var(--shadow-lift)] backdrop-blur-2xl"
            : "bg-[var(--glass)] shadow-[var(--shadow-soft)] backdrop-blur-xl",
        )}
      >
        <Link to="/" className="group flex items-center gap-2.5 pr-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[color-mix(in_oklab,var(--primary)_45%,transparent)] bg-[color-mix(in_oklab,var(--primary)_16%,transparent)]">
            <span className="h-2 w-2 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
            <span className="absolute inset-0 rounded-lg border border-[color-mix(in_oklab,var(--primary)_25%,transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </span>
          <span className="text-[0.95rem] font-semibold tracking-[0.18em]">{t('ui.janmind')}</span>
        </Link>

        <ul className="ml-2 hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.tKey}>
              {"hash" in l && l.hash ? (
                <a
                  href="/#how-it-works"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-[var(--glass)] hover:text-foreground"
                >
                  {t(l.tKey, l.defaultLabel)}
                </a>
              ) : (
                <Link
                  to={l.to}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm transition-colors duration-200 hover:bg-[var(--glass)] hover:text-foreground",
                    pathname === l.to ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {t(l.tKey, l.defaultLabel)}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <ThemeToggle className="hidden sm:inline-flex" />
          <Link
            to="/notifications"
            aria-label={t('ui.notifications')}
            className="press flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" aria-hidden />
          </Link>
          {user ? (
            <Link
              to="/profile"
              className="press hidden h-9 items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] pr-3 pl-1.5 text-sm text-foreground hover:bg-[var(--glass-strong)] sm:flex"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_22%,transparent)] text-[0.65rem] font-semibold text-primary">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="max-w-24 truncate">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <GlassButton asChild size="sm" variant="glass" className="hidden sm:inline-flex">
              <Link to="/login" search={{ redirect: undefined }}>{t("nav.signin", "Sign In")}</Link>
            </GlassButton>
          )}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="press flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="animate-rise mx-auto mt-2 max-w-6xl rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] p-2 shadow-[var(--shadow-lift)] backdrop-blur-2xl lg:hidden">
          <ul className="space-y-0.5">
            {navLinks.map((l) => (
              <li key={l.tKey}>
                {"hash" in l && l.hash ? (
                  <a
                    href="/#how-it-works"
                    className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground"
                  >
                    {t(l.tKey, l.defaultLabel)}
                  </a>
                ) : (
                  <Link
                    to={l.to}
                    className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground"
                  >
                    {t(l.tKey, l.defaultLabel)}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                to={user ? "/profile" : "/login"}
                className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground"
              >
                {user ? t("nav.profile", "Profile") : t("nav.signin", "Sign In")}
              </Link>
            </li>
          </ul>
          <div className="flex justify-center gap-2 px-3 py-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}

export function MobileTabBar() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label={t('ui.mobile')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--glass-border)] bg-[var(--glass-strong)] pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl sm:hidden"
    >
      <ul className="flex items-stretch">
        {mobileTabs.map(({ to, tKey, defaultLabel, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[0.62rem] tracking-[0.08em] uppercase transition-colors duration-200",
                  active ? "text-primary" : "text-subtle",
                )}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden />
                {t(tKey, defaultLabel)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
    const { t } = useI18n();
  return (
    <div className="ambient-field min-h-screen">
      <SiteNav />
      <main className={cn("mx-auto w-full max-w-6xl px-4 pt-28 pb-28 sm:px-6 sm:pb-20", className)}>
        {children}
      </main>
      <MobileTabBar />
    </div>
  );
}
