import { useState } from "react";
import { cn } from "@/lib/utils";
import { MuniSidebar } from "./muni-sidebar";
import { MuniHeader } from "./muni-header";

export function MuniLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="ambient-field min-h-screen bg-background">
      <MuniSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          collapsed ? "lg:pl-[4.5rem]" : "lg:pl-60",
        )}
      >
        <MuniHeader onMenuClick={() => setMobileOpen(true)} sidebarCollapsed={collapsed} />
        <main className="animate-fade p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
