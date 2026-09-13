import { createFileRoute } from "@tanstack/react-router";
import { DriverIncentives } from "@/components/app-pages";

export const Route = createFileRoute("/driver/incentives")({
  component: DriverIncentives,
});
