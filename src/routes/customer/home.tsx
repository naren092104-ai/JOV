import { createFileRoute } from "@tanstack/react-router";
import { CustomerHome } from "@/components/app-pages";

export const Route = createFileRoute("/customer/home")({
  component: CustomerHome,
});
