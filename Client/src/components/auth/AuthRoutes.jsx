import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import PublicNavbar from "../Navbar/PublicNavbar";

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
