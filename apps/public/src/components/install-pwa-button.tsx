import { useEffect, useState } from "react";
import { Check, Download, ExternalLink, Smartphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function InstallPwaButton({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsInstalled(standalone);
    setIsIos(/iphone|ipad|ipod/i.test(window.navigator.userAgent) && !standalone);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowHelp(false);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowHelp((current) => !current);
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <span className={`inline-flex min-h-10 items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--civic-teal-600)_32%,transparent)] bg-[color-mix(in_oklab,var(--civic-teal-600)_10%,transparent)] px-3 py-2 text-xs font-semibold text-[var(--civic-teal-600)] ${className}`}>
        <Check className="h-3.5 w-3.5" aria-hidden />
        {t("ui.app_installed", "App installed")}
      </span>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleInstallClick}
        aria-expanded={showHelp}
        aria-haspopup="dialog"
        title={isIos ? t("ui.install_civicsathi_iphone", "Install Civic Sathi on iPhone or iPad") : t("ui.install_civicsathi_android", "Install Civic Sathi on Android or desktop")}
        className={`press inline-flex min-h-10 items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--civic-saffron-600)_38%,transparent)] bg-[color-mix(in_oklab,var(--civic-saffron-600)_10%,transparent)] px-3.5 py-2 text-xs font-semibold text-[var(--civic-saffron-600)] shadow-[var(--shadow-soft)] transition hover:bg-[color-mix(in_oklab,var(--civic-saffron-600)_17%,transparent)] ${className}`}
      >
        <Download className="h-3.5 w-3.5" aria-hidden />
        {t("ui.install_app", "Install app")}
      </button>
      {showHelp && (
        <div role="dialog" aria-label={t("ui.install_civicsathi", "Install Civic Sathi")} className="absolute right-0 top-full z-[60] mt-2 w-72 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] p-4 text-left shadow-[var(--shadow-lift)] backdrop-blur-2xl">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-primary"><Smartphone className="h-4 w-4" aria-hidden /></span>
            <div>
              <p className="text-sm font-semibold text-foreground">{t("ui.use_civicsathi_like_an_app", "Use Civic Sathi like an app")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {isIos
                  ? t("ui.ios_install_instructions", "In Safari, tap Share → Add to Home Screen → turn on Open as Web App → Add.")
                  : t("ui.android_install_instructions", "Choose Install Civic Sathi or Add to Home screen from your browser menu.")}
              </p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[0.68rem] text-subtle"><ExternalLink className="h-3 w-3" aria-hidden /> {t("ui.secure_install_live_data", "Secure install; live civic data stays online.")}</p>
        </div>
      )}
    </div>
  );
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
