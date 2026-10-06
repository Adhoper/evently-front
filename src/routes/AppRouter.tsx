import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/public/HomePage";
import EventsPage from "../pages/public/EventsPage";
import EventDetailPage from "../pages/public/EventDetailPage";

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