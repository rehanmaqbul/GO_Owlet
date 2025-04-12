import { RouteObject } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import ChildDashboard from "@/pages/ChildDashboard";

export const studentRoutes: RouteObject[] = [
  // Protected routes - Student
  {
    path: "/student",
    element: (
      <PrivateRoute allowedRoles={['child']}>
        <ChildDashboard />
      </PrivateRoute>
    )
  }
]; 