import { createFileRoute } from "@tanstack/react-router";
import { CustomerSchedule } from "@/components/app-pages";

export const Route = createFileRoute("/customer/schedule")({
  component: CustomerSchedule,
});
