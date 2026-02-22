import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { RootLayout } from "../layouts/RootLayout";
import { authRoutes } from "./routesVariables/authRoutes";
import { publicRoutes } from "./routesVariables/publicRoutes";
import { RequireAuth } from "./RequireAuth";
import { PrivateLayout } from "../layouts/PrivadeLayout";
import { studentPrivateRoutes } from "./routesVariables/studentPrivateRoutes.tsx";
import { RequireRole } from "./RequireRole.tsx";
import { RoleIndexRedirect } from "./RoleIndexRedirect.tsx";
import { teacherPrivateRoutes } from "./routesVariables/teacherPrivateRoutes.tsx";

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
        path: "/app",
        element: (
          <RequireAuth>
            <RoleIndexRedirect />
          </RequireAuth>
        ),
      },
      {
        path: "/clients-dashboard",
        element: (
          <RequireAuth>
            <RequireRole allow={["student"]}>
              <PrivateLayout />
            </RequireRole>
          </RequireAuth>
        ),
        children: studentPrivateRoutes,
      },
      {
        path: "/teacher",
        element: (
          <RequireAuth>
            <RequireRole allow={["teacher"]}>
              <PrivateLayout />
            </RequireRole>
          </RequireAuth>
        ),
        children: teacherPrivateRoutes,
      },

      { path: "/forbidden", element: <div>403 Forbidden</div> },
    ],
  },
]);
