import { RouteObject } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import SchoolDashboard from "@/pages/school/SchoolDashboard";
import SchoolTeachers from "@/pages/school/teachers";
import SchoolStudents from "@/pages/school/students";
import SchoolClasses from "@/pages/school/classes";
import SchoolReports from "@/pages/school/reports";
import SchoolSettings from "@/pages/school/settings";

export const schoolRoutes: RouteObject[] = [
  {
    path: "/school",
    element: (
      <PrivateRoute allowedRoles={['school_admin']}>
        <SchoolDashboard />
      </PrivateRoute>
    )
  },
  {
    path: "/school/teachers",
    element: (
      <PrivateRoute allowedRoles={['school_admin']}>
        <SchoolTeachers />
      </PrivateRoute>
    )
  },
  {
    path: "/school/students",
    element: (
      <PrivateRoute allowedRoles={['school_admin']}>
        <SchoolStudents />
      </PrivateRoute>
    )
  },
  {
    path: "/school/classes",
    element: (
      <PrivateRoute allowedRoles={['school_admin']}>
        <SchoolClasses />
      </PrivateRoute>
    )
  },
  {
    path: "/school/reports",
    element: (
      <PrivateRoute allowedRoles={['school_admin']}>
        <SchoolReports />
      </PrivateRoute>
    )
  },
  {
    path: "/school/settings",
    element: (
      <PrivateRoute allowedRoles={['school_admin']}>
        <SchoolSettings />
      </PrivateRoute>
    )
  }
]; 