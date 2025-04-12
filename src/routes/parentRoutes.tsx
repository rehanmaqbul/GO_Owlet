import { RouteObject } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import ParentDashboard from "@/pages/ParentDashboard";
import ParentCheckTasks from "@/pages/ParentCheckTasks";
import TaskDetails from "@/pages/TaskDetails";
import SubjectAnswers from "@/pages/SubjectAnswers";
import ParentAssignTask from "@/pages/ParentAssignTask";
import ChildManagement from "@/pages/ChildManagement";
import ParentResources from "@/pages/ParentResources";
import ParentMessages from "@/pages/ParentMessages";
import ScheduleTasksParent from "@/pages/ScheduleTasksParent";
import TaskDetailsPage from "@/pages/TaskDetailsPage";
import ParentProgressReports from "@/pages/ParentProgressReports";

export const parentRoutes: RouteObject[] = [
  // Protected routes - Parent
  {
    path: "/parent",
    element: (
      <PrivateRoute allowedRoles={['parent']}>
        <ParentDashboard />
      </PrivateRoute>
    )
  },
  {
    path: "/parent-check-tasks",
    element: (
      <PrivateRoute allowedRoles={['parent']}>
        <ParentCheckTasks />
      </PrivateRoute>
    )
  },
  {
    path: "/task-details",
    element: (
      <PrivateRoute allowedRoles={['parent']}>
        <TaskDetails />
      </PrivateRoute>
    )
  },
  {
    path: "/task-details-page",
    element: (
      <PrivateRoute allowedRoles={['parent']}>
        <TaskDetailsPage />
      </PrivateRoute>
    )
  },
  {
    path: "/subject-answers",
    element: (
      <PrivateRoute allowedRoles={['parent']}>
        <SubjectAnswers />
      </PrivateRoute>
    )
  },
  {
    path: "/parent-assign-task",
    element: (
      <PrivateRoute allowedRoles={['parent']}>
        <ParentAssignTask />
      </PrivateRoute>
    )
  },
  {
    path: "/child-management",
    element: (
      <PrivateRoute allowedRoles={['parent']}>
        <ChildManagement />
      </PrivateRoute>
    )
  },
  {
    path: "/parent-resources",
    element: (
      <PrivateRoute allowedRoles={['parent']}>
        <ParentResources />
      </PrivateRoute>
    )
  },
  {
    path: "/parent-messages",
    element: (
      <PrivateRoute allowedRoles={['parent']}>
        <ParentMessages />
      </PrivateRoute>
    )
  },
  {
    path: "/schedule-tasks-parent",
    element: (
      <PrivateRoute allowedRoles={['parent']}>
        <ScheduleTasksParent />
      </PrivateRoute>
    )
  },
  {
    path: "/parent-progress-reports",
    element: (
      <PrivateRoute allowedRoles={['parent']}>
        <ParentProgressReports />
      </PrivateRoute>
    )
  }
];
