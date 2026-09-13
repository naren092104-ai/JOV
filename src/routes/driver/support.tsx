import { createFileRoute } from "@tanstack/react-router";
import { DriverSupport } from "@/components/app-pages";

export const Route = createFileRoute("/driver/support")({
  component: DriverSupport,
});
