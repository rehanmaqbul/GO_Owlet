import { RouteObject, Navigate } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import Messages from "@/pages/Messages";
import NotFound from "@/pages/NotFound";
import ChildDashboard from "@/pages/ChildDashboard";
import ChildTasks from "@/pages/ChildTasks";
import ChildSubjectTasks from "@/pages/ChildSubjectTasks";
import ChildSuggestions from "@/pages/ChildSuggestions";
import ChildMessages from "@/pages/ChildMessages";
import TaskDetail from "@/pages/TaskDetail";
import FixedTaskDetail from "@/pages/FixedTaskDetail";
import FixedTask1 from "@/pages/FixedTask1";
import FixedTask2 from "@/pages/FixedTask2";
import FixedTask3 from "@/pages/FixedTask3";
import FixedTask4 from "@/pages/FixedTask4";
import FixedReadingTask from "@/pages/FixedReadingTask";
import FixedStoryTask from "@/pages/FixedStoryTask";
import FixedListeningTask from "@/pages/FixedListeningTask";
import FixedUploadTask from "@/pages/FixedUploadTask";
import LearningHub from "@/pages/LearningHub";
import FunGames from "@/pages/FunGames";
import MyRewards from "@/pages/MyRewards";
import LearningTips from "@/pages/LearningTips";

export const sharedRoutes: RouteObject[] = [
  {
    path: "/messages",
    element: (
      <PrivateRoute allowedRoles={['child', 'parent']}>
        <Messages />
      </PrivateRoute>
    )
  },
  {
    path: "/child-messages",
    element: (
      <PrivateRoute allowedRoles={['child']}>
        <ChildMessages />
      </PrivateRoute>
    )
  },
  {
    path: "/child-dashboard",
    element: (
      <PrivateRoute allowedRoles={['child']}>
        <ChildDashboard />
      </PrivateRoute>
    )
  },
  {
    path: "/child-tasks",
    element: (
      <PrivateRoute allowedRoles={['child']}>
        <ChildTasks />
      </PrivateRoute>
    )
  },
  {
    path: "/child-subject-tasks/:subject",
    element: (
      <PrivateRoute allowedRoles={['child']}>
        <ChildSubjectTasks />
      </PrivateRoute>
    )
  },
  {
    path: "/child-suggestions",
    element: (
      <PrivateRoute allowedRoles={['child']}>
        <ChildSuggestions />
      </PrivateRoute>
    )
  },
  // Redirect for /task without an ID
  {
    path: "/task",
    element: (
      <Navigate to="/child-tasks" replace />
    )
  },
  // Specific task routes first for explicit matching
  {
    path: "/task/1",
    element: (
      <PrivateRoute allowedRoles={['child', 'parent']}>
        <FixedTask1 />
      </PrivateRoute>
    )
  },
  {
    path: "/task/2",
    element: (
      <PrivateRoute allowedRoles={['child', 'parent']}>
        <FixedTask2 />
      </PrivateRoute>
    )
  },
  {
    path: "/task/3",
    element: (
      <PrivateRoute allowedRoles={['child', 'parent']}>
        <FixedTask3 />
      </PrivateRoute>
    )
  },
  {
    path: "/task/4",
    element: (
      <PrivateRoute allowedRoles={['child', 'parent']}>
        <FixedTask4 />
      </PrivateRoute>
    )
  },
  {
    path: "/task/reading",
    element: (
      <PrivateRoute allowedRoles={['child', 'parent']}>
        <FixedReadingTask />
      </PrivateRoute>
    )
  },
  {
    path: "/task/story",
    element: (
      <PrivateRoute allowedRoles={['child', 'parent']}>
        <FixedStoryTask />
      </PrivateRoute>
    )
  },
  {
    path: "/task/listening",
    element: (
      <PrivateRoute allowedRoles={['child', 'parent']}>
        <FixedListeningTask />
      </PrivateRoute>
    )
  },
  {
    path: "/task/upload",
    element: (
      <PrivateRoute allowedRoles={['child', 'parent']}>
        <FixedUploadTask />
      </PrivateRoute>
    )
  },
  // Generic task route last for fallback
  {
    path: "/task/:taskId",
    element: (
      <PrivateRoute allowedRoles={['child', 'parent']}>
        <TaskDetail />
      </PrivateRoute>
    )
  },
  // Fun Activity pages
  {
    path: "/learning-hub",
    element: (
      <PrivateRoute allowedRoles={['child']}>
        <LearningHub />
      </PrivateRoute>
    )
  },
  {
    path: "/fun-games",
    element: (
      <PrivateRoute allowedRoles={['child']}>
        <FunGames />
      </PrivateRoute>
    )
  },
  {
    path: "/my-rewards",
    element: (
      <PrivateRoute allowedRoles={['child']}>
        <MyRewards />
      </PrivateRoute>
    )
  },
  {
    path: "/learning-tips",
    element: (
      <PrivateRoute allowedRoles={['child']}>
        <LearningTips />
      </PrivateRoute>
    )
  },
  // 404 catch-all route
  {
    path: "*",
    element: <NotFound />
  }
];
