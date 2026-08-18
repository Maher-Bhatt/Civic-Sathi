import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/glass-button-BU7SWYxP.js
var import_jsx_runtime = require_jsx_runtime();
var glassButton = cva("press inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-[0.06em] uppercase select-none disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[var(--shadow-lift)]",
			glass: "glass text-foreground hover:-translate-y-0.5 hover:bg-[var(--glass-strong)] hover:shadow-[var(--shadow-lift)]",
			outline: "border border-border bg-transparent text-foreground hover:-translate-y-0.5 hover:bg-[var(--glass)]",
			ghost: "text-muted-foreground hover:text-foreground hover:bg-[var(--glass)]",
			danger: "bg-critical text-primary-foreground hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[var(--shadow-lift)]"
		},
		size: {
			sm: "h-9 px-3.5 text-[0.7rem]",
			md: "h-11 px-5 text-xs",
			lg: "h-13 px-7 text-[0.8rem]",
			icon: "h-10 w-10 p-0"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function GlassButton({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(glassButton({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { GlassButton as t };
