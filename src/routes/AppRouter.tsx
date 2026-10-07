import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import OrganizerLayout from "../layouts/OrganizerLayout";

import HomePage from "../pages/public/HomePage";
import EventsPage from "../pages/public/EventsPage";
import EventDetailPage from "../pages/public/EventDetailPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import AccountPage from "../pages/account/AccountPage";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";
import OrganizerDashboardPage from "../components/organizer/OrganizerDashboardPage";
import MyEventsPage from "../components/organizer/MyEventsPage";
import CreateEventPage from "../components/organizer/CreateEventPage";

const router = createBrowserRouter([
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
        element: <EventDetailPage />,
      },

      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "register",
        element: <RegisterPage />,
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

  {
    path: "/organizer",
    element: (
      <RoleProtectedRoute allowedRoles={["Organizer"]}>
        <OrganizerLayout />
      </RoleProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <OrganizerDashboardPage />,
      },

      {
        path: "events",
        element: <MyEventsPage />,
      },

      {
        path: "events/create",
        element: <CreateEventPage />,
      },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
