import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LANGUAGES, type Language } from "@/lib/translations";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useI18n();

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <Globe className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="glass press h-9 cursor-pointer appearance-none rounded-full border border-[var(--glass-border)] bg-[var(--glass)] pl-8 pr-4 text-xs font-medium uppercase tracking-[0.05em] text-muted-foreground outline-none hover:text-foreground"
        aria-label="Select language"
      >
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <option key={code} value={code} className="bg-[var(--surface-elevated)] text-foreground">
            {code.toUpperCase()} - {name}
          </option>
        ))}
      </select>
    </div>
  );
}
