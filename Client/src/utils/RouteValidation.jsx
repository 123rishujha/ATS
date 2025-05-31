import { USER_ROLES } from "@/imports/mainExports";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { userState } = useSelector((store) => store.user);
  const { pathname } = useLocation();

  if (!userState) {
    return <Navigate to="/auth/login" state={{ pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

export const PublicOnlyRoute = ({ children }) => {
  const { userState } = useSelector((store) => store.user);
  console.log("userState aaaaaa", userState);

  if (userState) {
    if (userState.role === USER_ROLES.recruiter) {
      return <Navigate to={"/recruiter"} />;
    } else {
      return <Navigate to={"/jobseeker"} />;
    }
  }

  return <div>{children}</div>;
};
