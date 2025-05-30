import React, { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "../components/ui/suspense";
import Signup from "@/components/auth/signup";
import PublicNavbar from "@/components/Navbar/PublicNavbar";

const Login = lazy(() => import("../components/auth/Login"));

function AuthRoutes() {
  return (
    <>
      <PublicNavbar />
      <Suspense>
        <Routes>
          <Route path="" element={<Navigate replace to="login" />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default AuthRoutes;
