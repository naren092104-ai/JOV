import { createFileRoute } from "@tanstack/react-router";
import { CustomerWallet } from "@/components/app-pages";

export const Route = createFileRoute("/customer/wallet")({
  component: CustomerWallet,
});
