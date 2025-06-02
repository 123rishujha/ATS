import React from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";

const JobSeekerHome = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <Dashboard />
    </div>
  );
};

export default JobSeekerHome;
