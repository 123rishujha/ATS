import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RecruiterSidebar = ({ isOpen }) => {
  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/recruiter",
    },
    {
      title: "Job Posts",
      icon: Briefcase,
      path: "/recruiter/jobpost",
    },
    {
      title: "Candidates",
      icon: Users,
      path: "/recruiter/candidates",
    },
    {
      title: "Applications",
      icon: FileText,
      path: "/recruiter/applications",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/recruiter/settings",
    },
  ];

  return (
    <aside
      className={cn(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-50 border-r transition-transform duration-300 ease-in-out z-40",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default RecruiterSidebar;
