import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import OrganizerLayout from "../layouts/OrganizerLayout";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/public/HomePage";
import EventsPage from "../pages/public/EventsPage";
import EventDetailPage from "../pages/public/EventDetailPage";
import NotFoundPage from "../pages/public/NotFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AccountPage from "../pages/account/AccountPage";
import MyTicketsPage from "../pages/tickets/MyTicketsPage";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";
import OrganizerDashboardPage from "../components/organizer/OrganizerDashboardPage";
import MyEventsPage from "../components/organizer/MyEventsPage";
import CreateEventPage from "../components/organizer/CreateEventPage";
import EditEventPage from "../components/organizer/EditEventPage";
import CheckInPage from "../components/organizer/CheckInPage";
import EventAttendeesPage from "../pages/organizer/EventAttendeesPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminEventsPage from "../pages/admin/AdminEventsPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "events", element: <EventsPage /> },
      { path: "events/:id", element: <EventDetailPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "account",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tickets",
        element: (
          <ProtectedRoute>
            <MyTicketsPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
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
      { index: true, element: <OrganizerDashboardPage /> },
      { path: "events", element: <MyEventsPage /> },
      { path: "events/create", element: <CreateEventPage /> },
      { path: "events/:id/edit", element: <EditEventPage /> },
      { path: "events/:id/attendees", element: <EventAttendeesPage /> },
      { path: "check-in", element: <CheckInPage /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin"]}>
        <AdminLayout />
      </RoleProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "events", element: <AdminEventsPage /> },
      { path: "categories", element: <AdminCategoriesPage /> },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
