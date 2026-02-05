import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Router() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
