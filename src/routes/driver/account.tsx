import { createFileRoute } from "@tanstack/react-router";
import { DriverAccount } from "@/components/app-pages";

export const Route = createFileRoute("/driver/account")({
  component: DriverAccount,
});
