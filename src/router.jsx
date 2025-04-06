// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import {
  Dashboard,
  HomeLayout,
  Login,
  Register,
  ResetPassword,
  Portfolio,
  Funds,
  Profile,
  Order,
  Users,
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "reset",
        element: <ResetPassword />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
      },
      {
        path: "fund",
        element: <Funds />,
      },
      {
        path: "order",
        element: <Order />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

export default router;
