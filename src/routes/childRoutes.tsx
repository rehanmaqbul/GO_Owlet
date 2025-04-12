import React from 'react';
import { RouteObject } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import StudentDashboard from "../pages/StudentDashboard";
import ChildTasks from "../pages/ChildTasks";
import ChildSubjectTasks from "../pages/ChildSubjectTasks";
import ChildMessages from "../pages/ChildMessages";
import ChildSuggestions from "../pages/ChildSuggestions";
import MyRewards from "../pages/MyRewards";
import FunGames from "../pages/FunGames";
import LearningTips from "../pages/LearningTips";
import LearningHub from "../pages/LearningHub";

export const childRoutes: RouteObject[] = [
  // Protected routes - Student
  {
    path: "/student-dashboard",
    element: (
      <PrivateRoute allowedRoles={['student']}>
        <StudentDashboard />
      </PrivateRoute>
    )
  },
  {
    path: "/child-tasks",
    element: (
      <PrivateRoute allowedRoles={['student']}>
        <ChildTasks />
      </PrivateRoute>
    )
  },
  {
    path: "/child-subject-tasks",
    element: (
      <PrivateRoute allowedRoles={['student']}>
        <ChildSubjectTasks />
      </PrivateRoute>
    )
  },
  {
    path: "/child-messages",
    element: (
      <PrivateRoute allowedRoles={['student']}>
        <ChildMessages />
      </PrivateRoute>
    )
  },
  {
    path: "/child-suggestions",
    element: (
      <PrivateRoute allowedRoles={['student']}>
        <ChildSuggestions />
      </PrivateRoute>
    )
  },
  {
    path: "/my-rewards",
    element: (
      <PrivateRoute allowedRoles={['student']}>
        <MyRewards />
      </PrivateRoute>
    )
  },
  {
    path: "/fun-games",
    element: (
      <PrivateRoute allowedRoles={['student']}>
        <FunGames />
      </PrivateRoute>
    )
  },
  {
    path: "/learning-tips",
    element: (
      <PrivateRoute allowedRoles={['student']}>
        <LearningTips />
      </PrivateRoute>
    )
  },
  {
    path: "/learning-hub",
    element: (
      <PrivateRoute allowedRoles={['student']}>
        <LearningHub />
      </PrivateRoute>
    )
  }
]; 