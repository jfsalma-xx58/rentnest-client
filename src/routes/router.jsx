import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import AllProperties from "../pages/AllProperties";
import PropertyDetails from "../pages/PropertyDetails";
import PaymentPage from "../pages/PaymentPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../pages/ErrorPage";
import DashboardHome from "../pages/dashboard/DashboardHome";
import MyBookings from "../pages/dashboard/MyBookings";
import Favorites from "../pages/dashboard/Favorites";
import Profile from "../pages/dashboard/Profile";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "properties", element: <AllProperties /> },
      {
        path: "properties/:id",
        element: (
          <PrivateRoute>
            <PropertyDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "payment/:id",
        element: (
          <PrivateRoute>
            <PaymentPage />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "my-bookings", element: <MyBookings /> },
      { path: "favorites", element: <Favorites /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);