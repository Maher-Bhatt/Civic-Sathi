import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, FileText, Home, Map, Menu, MoreHorizontal, PlusCircle, User, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlassButton } from "@/components/ui/glass-button";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";
import { InstallPwaButton } from "@/components/install-pwa-button";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { to: "/", tKey: "nav.home", defaultLabel: "Home" },
  { to: "/map", tKey: "nav.map", defaultLabel: "Civic Map" },
  { to: "/report", tKey: "nav.report", defaultLabel: "Report Problem" },
  { to: "/complaints", tKey: "nav.complaints", defaultLabel: "My Complaints" },
] as const;

const secondaryLinks = [
  { to: "/contractors", tKey: "nav.contractors", defaultLabel: "Contractor Ratings" },
  { to: "/", tKey: "nav.howitworks", defaultLabel: "How It Works", hash: true },
] as const;

const mobileTabs = [
  { to: "/", tKey: "nav.home", defaultLabel: "Home", icon: Home },
  { to: "/map", tKey: "nav.map", defaultLabel: "Map", icon: Map },
  { to: "/report", tKey: "nav.report", defaultLabel: "Report", icon: PlusCircle },
  { to: "/complaints", tKey: "nav.complaints", defaultLabel: "Reports", icon: FileText },
  { to: "/profile", tKey: "nav.profile", defaultLabel: "Profile", icon: User },
] as const;

function NavLink({ link, pathname, onClick }: { link: (typeof primaryLinks)[number] | (typeof secondaryLinks)[number]; pathname: string; onClick?: () => void }) {
  const { t } = useI18n();
  const active = pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));
  if ("hash" in link && link.hash) {
    return <a href="/#how-it-works" onClick={onClick} className="rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-[var(--glass)] hover:text-foreground">{t(link.tKey, link.defaultLabel)}</a>;
  }
  return <Link to={link.to} onClick={onClick} className={cn("rounded-xl px-3 py-2.5 text-sm transition hover:bg-[var(--glass)] hover:text-foreground", active ? "bg-[var(--surface-elevated)] font-semibold text-foreground" : "text-muted-foreground")}>{t(link.tKey, link.defaultLabel)}</Link>;
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setMoreOpen(false); }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav aria-label={t("ui.primary")} className={cn("mx-auto flex max-w-6xl items-center gap-2 rounded-2xl border border-[var(--glass-border)] px-3 py-2.5 transition-all duration-300 sm:px-4", scrolled ? "bg-[var(--glass-strong)] shadow-[var(--shadow-lift)] backdrop-blur-2xl" : "bg-[var(--glass)] shadow-[var(--shadow-soft)] backdrop-blur-xl")}>
        <Link to="/" className="group flex min-h-10 shrink-0 items-center gap-2.5 pr-2" aria-label={t("ui.civicsathi_home", "Civic Sathi home")}>
          <span className="civic-heritage-mark" aria-hidden="true" />
          <span className="hidden text-[0.9rem] font-bold tracking-[0.12em] text-[var(--civic-indigo-950)] sm:inline dark:text-foreground">Civic Sathi</span>
        </Link>

        <div className="ml-1 hidden items-center gap-0.5 lg:flex">
          {primaryLinks.map((link) => <NavLink key={link.tKey} link={link} pathname={pathname} />)}
          <div className="relative">
            <button type="button" aria-expanded={moreOpen} onClick={() => setMoreOpen((value) => !value)} className={cn("press flex min-h-10 items-center gap-1 rounded-xl px-3 py-2.5 text-sm transition hover:bg-[var(--glass)]", moreOpen ? "bg-[var(--surface-elevated)] text-foreground" : "text-muted-foreground")}>
              {t("ui.more", "More")} <MoreHorizontal className="h-4 w-4" aria-hidden />
            </button>
            {moreOpen && <div className="absolute left-0 top-full z-50 mt-2 grid min-w-52 gap-1 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] p-2 shadow-[var(--shadow-lift)] backdrop-blur-2xl">{secondaryLinks.map((link) => <NavLink key={link.tKey} link={link} pathname={pathname} onClick={() => setMoreOpen(false)} />)}</div>}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <InstallPwaButton className="hidden xl:inline-flex" />
          <LanguageToggle className="hidden md:inline-flex" />
          <ThemeToggle className="hidden md:inline-flex" />
          <Link to="/notifications" aria-label={t("ui.notifications")} className="press flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:text-foreground"><Bell className="h-4 w-4" aria-hidden /></Link>
          {user ? <Link to="/profile" className="press hidden min-h-10 items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] pr-3 pl-1.5 text-sm text-foreground hover:bg-[var(--glass-strong)] sm:flex"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_22%,transparent)] text-xs font-semibold text-primary">{user.name.slice(0, 1).toUpperCase()}</span><span className="max-w-24 truncate">{user.name.split(" ")[0]}</span></Link> : <GlassButton asChild size="sm" variant="glass" className="hidden min-h-10 sm:inline-flex"><Link to="/login" search={{ redirect: undefined }}>{t("nav.signin", "Sign In")}</Link></GlassButton>}
          <button type="button" aria-label={open ? t("ui.close_menu", "Close menu") : t("ui.open_menu", "Open menu")} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="press flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-foreground lg:hidden">{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div>
      </nav>

      {open && <div className="animate-rise mx-auto mt-2 max-w-6xl rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] p-2 shadow-[var(--shadow-lift)] backdrop-blur-2xl lg:hidden"><div className="grid gap-1">{primaryLinks.map((link) => <NavLink key={link.tKey} link={link} pathname={pathname} onClick={() => setOpen(false)} />)}{secondaryLinks.map((link) => <NavLink key={link.tKey} link={link} pathname={pathname} onClick={() => setOpen(false)} />)}<Link to={user ? "/profile" : "/login"} className="rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground">{user ? t("nav.profile", "Profile") : t("nav.signin", "Sign In")}</Link><div className="mt-1 flex items-center justify-between gap-2 border-t border-[var(--glass-border)] px-2 pt-3"><InstallPwaButton /><div className="flex gap-2"><LanguageToggle /><ThemeToggle /></div></div></div></div>}
    </header>
  );
}

export function MobileTabBar() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return <nav aria-label={t("ui.mobile")} className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--glass-border)] bg-[var(--glass-strong)] pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(16,27,61,0.12)] backdrop-blur-2xl sm:hidden"><ul className="mx-auto flex max-w-md items-stretch">{mobileTabs.map(({ to, tKey, defaultLabel, icon: Icon }) => { const active = pathname === to || (to !== "/" && pathname.startsWith(to)); return <li key={to} className="flex-1"><Link to={to} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 py-2 text-[0.62rem] font-semibold tracking-[0.06em] uppercase transition-colors", active ? "text-primary" : "text-subtle")}><Icon className="h-[19px] w-[19px]" aria-hidden />{t(tKey, defaultLabel)}</Link></li>; })}</ul></nav>;
}

export function PageShell({ children, className, dataCity }: { children: React.ReactNode; className?: string; dataCity?: string }) {
  return <div data-city={dataCity} className="ambient-field civic-city-shell min-h-screen"><SiteNav /><main className={cn("mx-auto w-full max-w-6xl px-4 pt-28 pb-28 sm:px-6 sm:pb-20", className)}>{children}</main><MobileTabBar /></div>;
}
