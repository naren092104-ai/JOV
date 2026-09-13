import { createFileRoute } from "@tanstack/react-router";
import { CustomerOffers } from "@/components/app-pages";

export const Route = createFileRoute("/customer/offers")({
  component: CustomerOffers,
});
