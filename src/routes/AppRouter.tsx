import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { adminRoutes } from "./adminRoutes";
import { teacherRoutes } from "./teacherRoutes";
import { parentRoutes } from "./parentRoutes";
import { schoolRoutes } from "./schoolRoutes";
import { studentRoutes } from "./studentRoutes";
import NotFound from "@/pages/NotFound";

// Define a catch-all route for the 404 page
const notFoundRoute = {
  path: "*",
  element: <NotFound />
};

// Combine all routes with public routes first to ensure proper precedence
const router = createBrowserRouter([
  ...publicRoutes,  // Public routes MUST come first for proper authentication flow
  ...adminRoutes,
  ...teacherRoutes,
  ...parentRoutes,
  ...schoolRoutes,
  ...studentRoutes,
  notFoundRoute // Add the catch-all route at the end
]);

export const AppRouter = () => {
  console.log("Available routes:", [...publicRoutes, ...adminRoutes, ...teacherRoutes, ...parentRoutes, ...schoolRoutes, ...studentRoutes].map(r => r.path));
  return <RouterProvider router={router} />;
};
