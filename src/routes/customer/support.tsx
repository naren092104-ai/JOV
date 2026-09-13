import { createFileRoute } from "@tanstack/react-router";
import { CustomerSupport } from "@/components/app-pages";

export const Route = createFileRoute("/customer/support")({
  component: CustomerSupport,
});
