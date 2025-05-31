import React from "react";
import { Routes, Route } from "react-router-dom";
import JobPostTable from "./JobPostTable";
import JobPostForm from "./JobPostForm";
import JobPostView from "./JobPostView";

const JobPostMain = () => {
  return (
    <Routes>
      <Route path="/" element={<JobPostTable />} />
      <Route path="form" element={<JobPostForm />} />
      <Route path="form/:id" element={<JobPostForm />} />
      <Route path="view/:id" element={<JobPostView />} />
    </Routes>
  );
};

export default JobPostMain;
