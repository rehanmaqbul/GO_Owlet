import { RouteObject } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import AdminDashboard from "@/pages/AdminDashboard";
import Questions from "@/pages/Questions";
import Resources from "@/pages/Resources";
import BulkUpload from "@/pages/BulkUpload";
import BulkUploadType from "@/pages/BulkUploadType";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminTeachers from "@/pages/admin/AdminTeachers";
import AdminContent from "@/pages/admin/AdminContent";
import AdminSchools from "@/pages/admin/AdminSchools";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminLogs from "@/pages/admin/AdminLogs";
import AdminSecurity from "@/pages/admin/AdminSecurity";
import AdminNewSchool from "@/pages/admin/AdminNewSchool";

export const adminRoutes: RouteObject[] = [
  // Protected routes - Admin
  {
    path: "/admin-dashboard",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </PrivateRoute>
    )
  },
  {
    path: "/questions",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <Questions />
      </PrivateRoute>
    )
  },
  {
    path: "/resources",
    element: (
      <PrivateRoute allowedRoles={['admin', 'parent']}>
        <Resources />
      </PrivateRoute>
    )
  },
  {
    path: "/bulk-upload",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <BulkUpload />
      </PrivateRoute>
    )
  },
  {
    path: "/bulk-upload/:contentType",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <BulkUploadType />
      </PrivateRoute>
    )
  },
  // New admin routes
  {
    path: "/admin/users",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminUsers />
      </PrivateRoute>
    )
  },
  {
    path: "/admin/teachers",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminTeachers />
      </PrivateRoute>
    )
  },
  {
    path: "/admin/content",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminContent />
      </PrivateRoute>
    )
  },
  {
    path: "/admin/schools",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminSchools />
      </PrivateRoute>
    )
  },
  {
    path: "/admin/schools/new",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminNewSchool />
      </PrivateRoute>
    )
  },
  {
    path: "/admin/settings",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminSettings />
      </PrivateRoute>
    )
  },
  {
    path: "/admin/analytics",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminAnalytics />
      </PrivateRoute>
    )
  },
  {
    path: "/admin/logs",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminLogs />
      </PrivateRoute>
    )
  },
  {
    path: "/admin/security",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminSecurity />
      </PrivateRoute>
    )
  }
];
