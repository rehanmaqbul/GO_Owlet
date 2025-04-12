import { lazy, Suspense } from 'react';
import { RouteObject, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Questions from "@/pages/Questions";
import Resources from "@/pages/Resources";
import BulkUpload from "@/pages/BulkUpload";
import BulkUploadType from "@/pages/BulkUploadType";
import AdminTeachers from "@/pages/admin/AdminTeachers";
import AdminSchools from "@/pages/admin/AdminSchools";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminLogs from "@/pages/admin/AdminLogs";
import AdminSecurity from "@/pages/admin/AdminSecurity";
import AdminNewSchool from "@/pages/admin/AdminNewSchool";
import BulkUserUpload from "@/pages/admin/BulkUserUpload";
import CheckUsers from "@/pages/admin/CheckUsers";
import { Loader2 } from 'lucide-react';
import SchoolDashboard from '@/pages/school/SchoolDashboard';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import SchoolTeachers from '@/pages/school/teachers';
import SchoolStudents from '@/pages/school/students';
import SchoolClasses from '@/pages/school/classes';
import SchoolReports from '@/pages/school/reports';
import SchoolSettings from '@/pages/school/settings';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
  </div>
);

// Lazy loaded components wrapped with Suspense
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));
const AdminContent = lazy(() => import('@/pages/admin/AdminContent'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const NewTeacher = lazy(() => import('@/pages/admin/teachers/new'));
const NewUser = lazy(() => import('@/pages/admin/users/new'));

// Wrap lazy components with Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export const adminRoutes: RouteObject[] = [
  // Protected routes - Admin
  {
    path: "/admin",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </PrivateRoute>
    )
  },
  {
    path: "/admin/check-users",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <CheckUsers />
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
        {withSuspense(AdminUsers)}
      </PrivateRoute>
    )
  },
  {
    path: "/admin/users/new",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        {withSuspense(NewUser)}
      </PrivateRoute>
    )
  },
  {
    path: "/admin/users/bulk-upload",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <BulkUserUpload />
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
        {withSuspense(AdminContent)}
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
        {withSuspense(AdminAnalytics)}
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
  },
  {
    path: "/admin/teachers/new",
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        {withSuspense(NewTeacher)}
      </PrivateRoute>
    )
  },
  {
    path: "/school",
    element: (
      <PrivateRoute allowedRoles={['school_admin']}>
        <SchoolDashboard />
      </PrivateRoute>
    )
  },
  {
    path: "/teacher-dashboard",
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <TeacherDashboard />
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

export default function AdminRoutes() {
  return (
    <Routes>
      {adminRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}
