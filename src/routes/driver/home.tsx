import { createFileRoute } from "@tanstack/react-router";
import { DriverHome } from "@/components/app-pages";

export const Route = createFileRoute("/driver/home")({
  component: DriverHome,
});
