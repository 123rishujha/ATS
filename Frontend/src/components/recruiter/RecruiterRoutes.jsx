import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import RecruiterNavbar from "./RecruiterNavbar";
import RecruiterSidebar from "./RecruiterSidebar";
import JobPostMain from "./jobpost/JobPostMain";
import Profile from "./profile/Profile";
import Candidates from "./candidates/Candidates";
import ProtectedRoute from "@/utils/RouteValidation";
import CandidatesView from "./candidates/CandidatesView";

const RecruiterRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <RecruiterNavbar toggleSidebar={toggleSidebar} />

        {/* Mobile overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="pt-16 flex">
          {/* Sidebar */}
          <RecruiterSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isMobile={isMobile}
          />

          {/* Main content */}
          <div
            className={`
            flex-1 p-4 md:p-6 transition-all duration-300 min-h-[calc(100vh-4rem)]
            ${isSidebarOpen && !isMobile ? "ml-64" : "ml-0"}
            ${isMobile ? "w-full" : ""}
          `}
          >
            <div className="w-full max-w-7xl mx-auto">
              <Routes>
                <Route path="/jobpost/*" element={<JobPostMain />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<div>Dashboard</div>} />
                <Route path="/candidates" element={<Candidates />} />
                <Route
                  path="/candidates/:candidateId"
                  element={<CandidatesView />}
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default RecruiterRoutes;
