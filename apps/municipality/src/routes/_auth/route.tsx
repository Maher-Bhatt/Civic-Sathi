import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MuniAuthGate } from "@/lib/require-muni-auth";
import { MuniLayout } from "@/components/municipality/muni-layout";
import { AiCopilotWidget } from "@/components/municipality/ai-copilot";

export const Route = createFileRoute("/_auth")({
  component: MuniAuthLayout,
});

function MuniAuthLayout() {
  return (
    <MuniAuthGate>
      <MuniLayout>
        <Outlet />
      </MuniLayout>
      <AiCopilotWidget />
    </MuniAuthGate>
  );
}
