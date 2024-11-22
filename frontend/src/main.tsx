import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, NavLink, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import ProblemsPage from "./pages/ProblemsPage.tsx";
import CodingPage from "./pages/CodingPage.tsx";
import "./index.css";
import { MainContextProvider } from "./contexts/MainContext.tsx";

function Layout() {
   return (
      <div className="flex flex-col w-[100vw] h-[100vh]">
         {/* Navigation Bar */}
         <nav className="w-full flex items-center justify-between px-10 h-[60px] bg-green-600 text-white text-lg shadow-md z-50">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
               <img src="/logo.png" alt="Logo" className="h-8" />
               <span className="font-bold text-xl">CodeMaster</span>
            </div>

            {/* Center: Navigation Links */}
            <div className="flex gap-10">
               <NavLink to="/" className={({ isActive }) => (isActive ? "font-bold" : "hover:font-bold transition-colors duration-300")}>
                  Home
               </NavLink>
               <NavLink to="/problems" className={({ isActive }) => (isActive ? "font-bold" : "hover:font-bold transition-colors duration-300")}>
                  Problems
               </NavLink>
            </div>

            {/* Right: Sign In and Sign Up Buttons */}
            <div className="flex gap-4">
               <button className="px-4 py-1 bg-gray-100 text-green-600 rounded hover:bg-gray-200 transition-colors duration-300">Sign In</button>
               <button className="px-4 py-1 bg-white text-green-600 rounded border border-green-600 hover:bg-green-100 transition-colors duration-300">
                  Sign Up
               </button>
            </div>
         </nav>

         {/* Page Content */}
         <div className="flex-grow block overflow-y-scroll">
            <Outlet />
         </div>
      </div>
   );
}

const router = createBrowserRouter([
   {
      path: "/",
      element: <Layout />,
      children: [
         {
            path: "/",
            element: <Home />,
         },
         {
            path: "problems",
            element: <ProblemsPage />,
         },
         {
            path: "problems/:problemId",
            element: <CodingPage />,
         },
      ],
   },
]);

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <MainContextProvider>
         <RouterProvider router={router} />
      </MainContextProvider>
   </StrictMode>
);
