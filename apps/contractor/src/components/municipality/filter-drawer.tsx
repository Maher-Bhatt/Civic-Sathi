import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GlassButton } from "@/components/ui/glass-button";
import { CITIES } from "@/services/cities";
import { ISSUE_TYPES } from "@/services/types";
import { COMPLAINT_STATUSES } from "@/services/types";
import { DEPARTMENTS } from "@/services/types";
import type { ComplaintFilters } from "@/services/types";
import { useI18n } from "@/lib/i18n";

const SEVERITIES = ["Low", "Moderate", "High", "Critical"] as const;

export function FilterDrawer({
  open,
  onOpenChange,
  filters,
  onChange,
  onApply,
  onClear,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ComplaintFilters;
  onChange: (patch: Partial<ComplaintFilters>) => void;
  onApply: () => void;
  onClear: () => void;
}) {
    const { t } = useI18n();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="glass-strong flex w-full flex-col border-l border-[var(--glass-border)] sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('ui.filters')}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          <Field label={t('ui.city')}>
            <select
              value={filters.city}
              onChange={(e) => onChange({ city: e.target.value as ComplaintFilters["city"] })}
              className="filter-input"
            >
              <option value="all">{t('ui.all_cities')}</option>
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('ui.area')}>
            <input
              value={filters.area}
              onChange={(e) => onChange({ area: e.target.value })}
              className="filter-input"
              placeholder={t('ui.area_name')}
            />
          </Field>
          <Field label={t('ui.ward')}>
            <input
              value={filters.ward}
              onChange={(e) => onChange({ ward: e.target.value })}
              className="filter-input"
              placeholder={t('ui.ward')}
            />
          </Field>
          <Field label={t('ui.issue')}>
            <select
              value={filters.category}
              onChange={(e) =>
                onChange({ category: e.target.value as ComplaintFilters["category"] })
              }
              className="filter-input"
            >
              <option value="all">{t('ui.all_categories')}</option>
              {ISSUE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('ui.severity')}>
            <select
              value={filters.severity}
              onChange={(e) =>
                onChange({ severity: e.target.value as ComplaintFilters["severity"] })
              }
              className="filter-input"
            >
              <option value="all">{t('ui.all_severities')}</option>
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('ui.department')}>
            <select
              value={filters.department}
              onChange={(e) =>
                onChange({ department: e.target.value as ComplaintFilters["department"] })
              }
              className="filter-input"
            >
              <option value="all">{t('ui.all_departments')}</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('ui.status')}>
            <select
              value={filters.status}
              onChange={(e) =>
                onChange({ status: e.target.value as ComplaintFilters["status"] })
              }
              className="filter-input"
            >
              <option value="all">{t('ui.all_statuses')}</option>
              {COMPLAINT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('ui.risk_range')}>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                max={100}
                value={filters.riskMin}
                onChange={(e) => onChange({ riskMin: Number(e.target.value) })}
                className="filter-input"
                placeholder={t('ui.min')}
              />
              <input
                type="number"
                min={0}
                max={100}
                value={filters.riskMax}
                onChange={(e) => onChange({ riskMax: Number(e.target.value) })}
                className="filter-input"
                placeholder={t('ui.max')}
              />
            </div>
          </Field>
        </div>
        <SheetFooter className="flex-row gap-2 border-t border-[var(--glass-border)] pt-4">
          <GlassButton variant="outline" className="flex-1" onClick={onClear}>
            {t('ui.clear')}</GlassButton>
          <GlassButton className="flex-1" onClick={onApply}>
            {t('ui.apply')}</GlassButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    const { t } = useI18n();
  return (
    <div>
      <label className="label-xs mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
