import { createFileRoute } from "@tanstack/react-router";
import { AdminDataPage } from "@/components/app-pages";

export const Route = createFileRoute("/admin/corporate")({
  component: () => <AdminDataPage type="corporate" />,
});
