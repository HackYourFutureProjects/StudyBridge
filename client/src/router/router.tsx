import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { RootLayout } from "../layouts/RootLayout";
import { authRoutes } from "./routesVariables/authRoutes";
import { publicRoutes } from "./routesVariables/publicRoutes";
import { RequireAuth } from "./RequireAuth";
import { PrivateLayout } from "../layouts/PrivateLayout.tsx";
import { studentPrivateRoutes } from "./routesVariables/studentPrivateRoutes.tsx";
import { RequireRole } from "./RequireRole.tsx";
import { RoleIndexRedirect } from "./RoleIndexRedirect.tsx";
import { teacherPrivateRoutes } from "./routesVariables/teacherPrivateRoutes.tsx";
import { VideoCallPage } from "../pages/videoCall/VideoCallPage.tsx";
import { moderatorPrivateRoutes } from "./routesVariables/moderatorPrivateRoutes.tsx";
import { ForbiddenPage } from "../pages/forbiddenPage/ForbiddenPage.tsx";
import { NotFoundPage } from "../pages/notFoundPage/NotFoundPage.tsx";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
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
        path: "/moderator",
        element: (
          <RequireAuth>
            <RequireRole allow={["moderator"]}>
              <PrivateLayout />
            </RequireRole>
          </RequireAuth>
        ),
        children: moderatorPrivateRoutes,
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
      {
        path: "/call/:callId",
        element: (
          <RequireAuth>
            <VideoCallPage />
          </RequireAuth>
        ),
      },

      { path: "/forbidden", element: <ForbiddenPage /> },
    ],
  },
]);
