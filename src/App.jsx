import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Dashboard,
  HomeLayout,
  Login,
  Register,
  ResetPassword,
  Portfolio,
  Admin,
  Funds,
  Profile,
  Order,
  Users,
} from "./pages";
import { ToastContainer, toast } from "react-toastify";

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

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
