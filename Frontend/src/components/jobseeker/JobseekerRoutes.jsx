import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import JobSeekerLayout from "./JobSeekerLayout";
import JobSeekerHome from "./JobSeekerHome";
import JobListings from "./job/JobListings";
import JobDetails from "./job/JobDetails";
import Applications from "./application/Applications";
import ApplicationDetails from "./application/ApplicationDetails";
import Profile from "./profile/Profile";

const JobSeekerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<JobSeekerLayout />}>
        <Route index element={<JobSeekerHome />} />
        <Route path="jobs" element={<JobListings />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="applications" element={<Applications />} />
        <Route path="applications/:id" element={<ApplicationDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default JobSeekerRoutes;
