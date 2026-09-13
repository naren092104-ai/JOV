import { createFileRoute } from "@tanstack/react-router";
import { CustomerAccount } from "@/components/app-pages";

export const Route = createFileRoute("/customer/account")({
  component: CustomerAccount,
});
