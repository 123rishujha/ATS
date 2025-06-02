import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
// import { ThemeToggle } from "./components/theme-toggle";
// import { Toaster } from "sonner";
import "./styles/globals.css";
import "./styles/modern-components.css";
import { lazy } from "react";
import LandingPage from "./components/LandingPage";
import NotFound from "./components/layouts/NotFound";
import { ToastContainer } from "react-toastify";
import ProtectedRoute, { PublicOnlyRoute } from "./utils/RouteValidation";
import AuthRoutes from "./components/auth/AuthRoutes";
import JobSeekerRoutes from "./components/jobseeker/JobseekerRoutes";
import RecruiterRoutes from "./components/recruiter/RecruiterRoutes";

// const RecruiterRoutes = lazy(() =>
//   import("./components/recruiter/RecruiterRoutes")
// );
// const AuthRoutes = lazy(() => import("./components/auth/AuthRoutes"));
// const JobSeekerRoutes = lazy(() =>
//   import("./components/jobseeker/JobSeekerRoutes")
// );

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="masai-theme">
      <div className="min-h-screen bg-background text-foreground">
        {/* <div className="fixed top-3.5 right-4 z-50">
          <ThemeToggle />
        </div> */}
        <BrowserRouter>
          <Routes>
            <Route path="" element={<LandingPage />} />
            <Route
              path="/auth/*"
              element={
                <PublicOnlyRoute>
                  <AuthRoutes />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="jobseeker/*"
              element={
                <ProtectedRoute>
                  <JobSeekerRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/*"
              element={
                <ProtectedRoute>
                  <RecruiterRoutes />
                </ProtectedRoute>
              }
            />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate replace to="/404" />} />
          </Routes>
        </BrowserRouter>
      </div>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
