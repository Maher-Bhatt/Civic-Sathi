import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useMuniAuth } from "@/lib/muni-auth";
import { CITIES, getCity } from "@/services/cities";
import { cn } from "@/lib/utils";
import { MuniSearchCommand } from "./muni-search";
import { NotificationDrawer } from "./notification-drawer";
import { useI18n } from "@/lib/i18n";

export function MuniHeader({
  onMenuClick,
  sidebarCollapsed,
}: {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}) {
    const { t } = useI18n();
  const { officer } = useMuniAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const city = officer ? getCity(officer.city) : CITIES[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--glass-border)] bg-[var(--glass-strong)] px-4 backdrop-blur-xl transition-all duration-300 lg:px-6",
          sidebarCollapsed ? "lg:pl-[calc(4.5rem+1rem)]" : "lg:pl-[calc(15rem+1rem)]",
        )}
      >
        <button
          type="button"
          onClick={onMenuClick}
          className="press rounded-lg p-2 text-muted-foreground hover:bg-[var(--glass)] lg:hidden"
          aria-label={t('ui.open_navigation')}
        >
          <Menu className="h-5 w-5" />
        </button>



        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1 text-xs text-muted-foreground md:inline">
            {city?.name}
          </span>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="press flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-xs text-muted-foreground"
            aria-label={t('ui.search_press')}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('ui.search')}</span>
            <kbd className="hidden rounded border border-[var(--glass-border)] px-1.5 py-0.5 text-[0.6rem] sm:inline">
              /
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setNotifOpen(true)}
            className="press relative rounded-lg p-2 text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground"
            aria-label={t('ui.notifications')}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-critical" />
          </button>

          <LanguageToggle />
          <ThemeToggle />

          <Link
            to={"/profile" as any}
            className="press flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-1.5 sm:px-3"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
              <User className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="hidden min-w-0 lg:block">
              <p className="truncate text-xs font-medium">{officer?.department}</p>
              <p className="truncate text-[0.65rem] text-muted-foreground">{officer?.role}</p>
            </div>
          </Link>
        </div>
      </header>

      <MuniSearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
      <NotificationDrawer open={notifOpen} onOpenChange={setNotifOpen} />
    </>
  );
}

