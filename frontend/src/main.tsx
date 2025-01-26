import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthPage from './pages/AuthPage.tsx';
import { SnackbarProvider } from 'notistack';
import { GlobalContextProvider } from './contexts/GlobalContext.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import MyAccountPage from './pages/MyAccountPage.tsx';
import Home from './pages/Home.tsx';
import ProblemsPage from './pages/ProblemsPage.tsx';
import ProblemCodingPage from './pages/ProblemCodingPage.tsx';
import AdminAddProblemPage from './pages/AdminAddProblemsPage.tsx';
import Layout from './layouts/Layout.tsx';
import SuperAdmin from './pages/SuperAdmin.tsx';
import Compiler from './pages/Compiler.tsx';

const router = createBrowserRouter([
   {
      path: '/',
      element: <Home />,
   },
   {
      path: '/auth/signin',
      element: <AuthPage isLogin={true} />,
   },
   {
      path: '/auth/signup',
      element: <AuthPage isLogin={false} />,
   },
   {
      path: '/problems',
      element: <ProtectedRoute roles={['ADMIN', 'CREATOR', 'LEARNER']} component={ProblemsPage} />,
   },
   {
      path: '/problems/:problemId',
      element: <ProblemCodingPage />,
   },
   {
      path: '/compiler',
      element: <Compiler />,
   },
   {
      path: '/admin/addproblem',
      element: (
         <Layout>
            <AdminAddProblemPage />
         </Layout>
      ),
   },
   {
      path: '/myaccount',
      element: <ProtectedRoute roles={['ADMIN', 'CREATOR', 'LEARNER']} component={MyAccountPage} />,
   },
   {
      path: '/superadmin',
      element: <ProtectedRoute roles={['ADMIN']} component={SuperAdmin} />,
   },
   {
      path: '/unauthorized',
      element: (
         <Layout>
            <h1 className="text-xl text-white font-semibold p-3">You are not authorized to view this page</h1>
         </Layout>
      ),
   },
   {
      path: '*',
      element: (
         <Layout>
            <h1 className="text-xl text-white font-semibold p-3">Page Not Found</h1>
         </Layout>
      ),
   },
]);

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <SnackbarProvider maxSnack={3}>
         <GlobalContextProvider>
            <RouterProvider router={router} />
         </GlobalContextProvider>
      </SnackbarProvider>
   </StrictMode>
);
