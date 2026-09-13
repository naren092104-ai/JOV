import { createFileRoute } from "@tanstack/react-router";
import { AdminDataPage } from "@/components/app-pages";

export const Route = createFileRoute("/admin/offers")({
  component: () => <AdminDataPage type="offers" />,
});
