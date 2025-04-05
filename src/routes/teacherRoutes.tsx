import { RouteObject } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import TeacherDashboard from "@/pages/TeacherDashboard";
import CheckTasksPage from "@/pages/CheckTasksPage";
import TaskDetailsPage from "@/pages/TaskDetailsPage";
import StudentTaskPage from "@/pages/StudentTaskPage";
import ClassDetail from "@/pages/ClassDetail";
import CreateClass from "@/pages/CreateClass";
import TeacherMessages from "@/pages/TeacherMessages";
import CreateReport from "@/pages/CreateReport";
import CreateTask from "@/pages/CreateTask";
import ScheduleTasks from "@/pages/ScheduleTasks";

export const teacherRoutes: RouteObject[] = [
  // Protected routes - Teacher
  {
    path: "/teacher-dashboard",
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <TeacherDashboard />
      </PrivateRoute>
    )
  },
  {
    path: "/check-tasks",
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <CheckTasksPage />
      </PrivateRoute>
    )
  },
  {
    path: "/task-details",
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <TaskDetailsPage />
      </PrivateRoute>
    )
  },
  {
    path: "/student-task",
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <StudentTaskPage />
      </PrivateRoute>
    )
  },
  {
    path: "/classes/:classId",
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <ClassDetail />
      </PrivateRoute>
    )
  },
  {
    path: "/create-class",
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <CreateClass />
      </PrivateRoute>
    )
  },
  {
    path: "/teacher-messages",
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <TeacherMessages />
      </PrivateRoute>
    )
  },
  {
    path: "/create-report",
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <CreateReport />
      </PrivateRoute>
    )
  },
  {
    path: "/create-task",
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <CreateTask />
      </PrivateRoute>
    )
  },
  {
    path: "/schedule-tasks",
    element: (
      <PrivateRoute allowedRoles={['teacher']}>
        <ScheduleTasks />
      </PrivateRoute>
    )
  }
];
