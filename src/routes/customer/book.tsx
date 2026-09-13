import { createFileRoute } from "@tanstack/react-router";
import { CustomerBook } from "@/components/app-pages";

export const Route = createFileRoute("/customer/book")({
  component: CustomerBook,
});
