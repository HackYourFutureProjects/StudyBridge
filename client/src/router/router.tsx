import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { RootLayout } from "../layouts/RootLayout";
import { authRoutes } from "./routesVariables/authRoutes";
import { publicRoutes } from "./routesVariables/publicRoutes";
import { RequireAuth } from "./RequireAuth";
import { PrivateLayout } from "../layouts/PrivadeLayout";
import { privateRoutes } from "./routesVariables/privateRoutes";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <div>Page not found</div>,
    children: [
      {
        element: <AuthLayout />,
        children: [...authRoutes],
      },
      {
        element: <PublicLayout />,
        children: [...publicRoutes],
      },
      {
        element: (
          <RequireAuth>
            <PrivateLayout />
          </RequireAuth>
        ),
        children: [...privateRoutes],
      },
    ],
  },
]);
