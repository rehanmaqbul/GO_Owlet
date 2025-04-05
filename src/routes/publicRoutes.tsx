
import { RouteObject } from 'react-router-dom';
import MainLandingPage from '@/pages/MainLandingPage';
import AuthPage from '@/pages/AuthPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import SelectRolePage from '@/pages/SelectRolePage';
import NotFound from '@/pages/NotFound';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLandingPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/select-role',
    element: <SelectRolePage />,
  },
  {
    path: '/404',
    element: <NotFound />,
  }
];
