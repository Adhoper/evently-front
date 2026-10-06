import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import HomePage from "../pages/public/HomePage";
import EventsPage from "../pages/public/EventsPage";
import EventDetailPage from "../pages/public/EventDetailPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AccountPage from "../pages/account/AccountPage";

import ProtectedRoute from "../components/ProtectedRoute";

const router =
  createBrowserRouter([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },

        {
          path: "events",
          element: <EventsPage />,
        },

        {
          path: "events/:id",
          element: (
            <EventDetailPage />
          ),
        },

        {
          path: "login",
          element: <LoginPage />,
        },

        {
          path: "register",
          element: (
            <RegisterPage />
          ),
        },

        {
          path: "account",
          element: (
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

function AppRouter() {
  return (
    <RouterProvider
      router={router}
    />
  );
}

export default AppRouter;