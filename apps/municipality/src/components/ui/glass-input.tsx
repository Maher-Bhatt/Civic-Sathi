import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border border-border bg-[var(--glass)] px-4 text-sm text-foreground placeholder:text-subtle outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out hover:border-[color-mix(in_oklab,var(--foreground)_18%,transparent)] focus:border-primary focus:bg-[var(--glass-strong)] focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)]";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(function GlassInput(
  { className, label, hint, error, id, ...props },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="label-xs block">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${inputId}-desc` : undefined}
        className={cn(fieldBase, "h-11", error && "border-critical", className)}
        {...props}
      />
      {(hint || error) && (
        <p
          id={`${inputId}-desc`}
          className={cn("text-xs", error ? "text-critical" : "text-subtle")}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  function GlassTextarea({ className, label, hint, id, ...props }, ref) {
    const auto = useId();
    const areaId = id ?? auto;
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={areaId} className="label-xs block">
            {label}
          </label>
        )}
        <textarea
          id={areaId}
          ref={ref}
          className={cn(fieldBase, "resize-none py-3.5 leading-relaxed", className)}
          {...props}
        />
        {hint && <p className="text-xs text-subtle">{hint}</p>}
      </div>
    );
  },
);

export { fieldBase };
