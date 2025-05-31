import React from "react";
import { Outlet } from "react-router-dom";
import JobSeekerNavbar from "./JobSeekerNavbar";

const JobSeekerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <JobSeekerNavbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default JobSeekerLayout;
