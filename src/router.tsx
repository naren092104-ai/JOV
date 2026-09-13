import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { authService } from "@/services/auth.service";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient, session: authService.getSession() },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
