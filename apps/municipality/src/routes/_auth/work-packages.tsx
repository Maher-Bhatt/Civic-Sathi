import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/work-packages")({
  beforeLoad: () => {
    throw redirect({ to: "/tenders" as any });
  },
  component: () => null,
});
