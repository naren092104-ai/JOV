import { createFileRoute } from "@tanstack/react-router";
import { AdminDataPage } from "@/components/app-pages";

export const Route = createFileRoute("/admin/settlements")({
  component: () => <AdminDataPage type="settlements" />,
});
