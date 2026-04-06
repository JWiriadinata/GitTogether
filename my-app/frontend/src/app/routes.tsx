import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./pages/Login.js";
import { Register } from "./pages/Register.js";
import { Home } from "./pages/Home.js";
import { Projects } from "./pages/Projects.js";
import { ProjectDetail } from "./pages/ProjectDetail.js";
import { Profile } from "./pages/Profile.js";
import { Layout } from "./components/Layout.js";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "home",
        Component: Home,
      },
      {
        path: "projects",
        Component: Projects,
      },
      {
        path: "projects/:id",
        Component: ProjectDetail,
      },
      {
        path: "profile",
        Component: Profile,
      },
    ],
  },
]);