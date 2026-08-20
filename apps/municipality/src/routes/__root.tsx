import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import leafletCss from "leaflet/dist/leaflet.css?url";
import { ThemeProvider, themeInitScript } from "@/lib/theme";
import { MuniAuthProvider } from "@/lib/muni-auth";
import { ContractorAuthProvider } from "@/lib/contractor-auth";
import { AdminAuthProvider } from "@/lib/admin-auth";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n";

// These render OUTSIDE I18nProvider so must NOT call useI18n()
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to={"/dashboard" as any}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. You can try refreshing or head back to the dashboard.
        </p>
        <div className="mt-4 p-3 text-left bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-xs font-mono overflow-auto max-h-56">
          <p className="font-bold">{error?.name || "Error"}: {error?.message}</p>
          <pre className="mt-1 whitespace-pre-wrap">{error?.stack}</pre>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { name: "theme-color", content: "#B95232" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Civic Sathi Muni" },
      { title: "Civic Sathi — Municipality Operations" },
      { name: "description", content: "Municipal operations dashboard for civic complaint intelligence, emerging issues, and city-wide monitoring." },
      { name: "author", content: "Civic Sathi" },
      { property: "og:title", content: "Civic Sathi — Municipal Intelligence" },
      { property: "og:description", content: "Officer dashboard for civic intelligence and operational response." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: leafletCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" },
      { rel: "icon", href: "/brand/civic-sathi-app-icon-192.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/brand/civic-sathi-app-icon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        
      </head>
            <body className="civic-heritage-shell">
        {children}

        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <MuniAuthProvider>
            <ContractorAuthProvider>
              <AdminAuthProvider>
                <Outlet />
                <Toaster position="top-center" />
              </AdminAuthProvider>
            </ContractorAuthProvider>
          </MuniAuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
