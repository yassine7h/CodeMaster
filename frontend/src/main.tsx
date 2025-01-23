import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage.tsx";
import { SnackbarProvider } from "notistack";
import { GlobalContextProvider } from "./contexts/GlobalContext.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import MyAccountPage from "./pages/MyAccountPage.tsx";
import Home from "./pages/Home.tsx";
import ProblemsPage from "./pages/ProblemsPage.tsx";
import CodingPage from "./pages/CodingPage.tsx";
import SolutionPage from "./pages/SolutionPage.tsx";
import AdminAddProblemPage from "./pages/AdminAddProblemsPage.tsx";
import Layout from "./layouts/Layout.tsx";
import SuperAdmin from "./pages/SuperAdmin.tsx";

const router = createBrowserRouter([
   {
      path: "/",
      element: <Layout><Home /></Layout>,
   },
   {
      path: "/auth/signin",
      element: <Layout><AuthPage isLogin={true} /></Layout>,
   },
   {
      path: "/auth/signup",
      element: <Layout><AuthPage isLogin={false} /></Layout>,
   },
   {
      path: "/problems",
      element: <Layout><ProblemsPage /></Layout>,
   },
   {
      path: "/problems/:problemId",
      element: <Layout><CodingPage /></Layout>,
   },
   {
      path: "/solutions/:solutionId",
      element: <Layout><SolutionPage /></Layout>,
   },
   {
      path: "/admin/addproblem",
      element: <Layout><AdminAddProblemPage/></Layout>,
   },
   {
      path: "/myaccount",
      element: <ProtectedRoute roles={["ADMIN", "USER", "SUPADMIN"]} component={MyAccountPage} />,
   },
   {
      path: "/superadmin",
      element: <SuperAdmin/>,
   },
   {
      path: "/unauthorized",
      element: <Layout><h1 className="text-xl font-semibold p-3">You are not authorized to view this page</h1></Layout>,
   },
   {
      path: "*",
      element: <Layout><h1 className="text-xl font-semibold p-3">Page Not Found</h1></Layout>,
   },
]);

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <SnackbarProvider maxSnack={3}>
         <GlobalContextProvider>
            <RouterProvider router={router} />
         </GlobalContextProvider>
      </SnackbarProvider>
   </StrictMode>
);

