import { createFileRoute } from "@tanstack/react-router";
import { CustomerTrips } from "@/components/app-pages";

export const Route = createFileRoute("/customer/trips")({
  component: CustomerTrips,
});
