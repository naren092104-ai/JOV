import { createFileRoute } from "@tanstack/react-router";
import { DriverTrips } from "@/components/app-pages";

export const Route = createFileRoute("/driver/trips")({
  component: DriverTrips,
});
