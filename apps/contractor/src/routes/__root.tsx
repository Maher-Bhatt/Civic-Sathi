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
import { useI18n, I18nProvider } from "@/lib/i18n";

function NotFoundComponent() {
    const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t('ui.page_not_found')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('ui.the_page_you_re_looking_for_do')}</p>
        <div className="mt-6">
          <Link
            to={"/dashboard" as any}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t('ui.go_to_dashboard')}</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
    const { t } = useI18n();
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t('ui.this_page_didn_t_load')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('ui.something_went_wrong_on_our_en')}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t('ui.try_again')}</button>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t('ui.dashboard')}</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JANMIND — Municipal Intelligence" },
      {
        name: "description",
        content:
          "Municipal operations dashboard for civic complaint intelligence, emerging issues, and city-wide monitoring.",
      },
      { name: "author", content: "JANMIND" },
      { property: "og:title", content: "JANMIND — Municipal Intelligence" },
      {
        property: "og:description",
        content: "Officer dashboard for civic intelligence and operational response.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: leafletCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
    const { t } = useI18n();
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
    const { t } = useI18n();
  const { queryClient } = Route.useRouteContext();

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

