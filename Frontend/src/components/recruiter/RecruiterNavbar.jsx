import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../common/Logo";

import { userLogout } from "@/redux/user/userSlice";
import { ToastHandler } from "../myToast/ToastHandler";

const RecruiterNavbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {userState } = useSelector(s=>s.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userLogout());
    ToastHandler("Suc", "Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/recruiter" className="text-xl font-semibold">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User className="h-5 w-5" />
            </Button>

              {isProfileOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-1 z-50">
                            <div className="px-4 py-2 border-b">
                              <p className="text-sm font-medium">{userState?.name || ""}</p>
                              <p className="text-xs text-muted-foreground">
                                {userState?.email || ""}
                              </p>
                            </div>
                            <div className="py-1" onClick={()=>setIsProfileOpen(false)}>
                              <Link
                                to="/recruiter/profile"
                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <User className="h-4 w-4" />
                                Profile
                              </Link>
                              <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <LogOut className="h-4 w-4" />
                                Logout
                              </button>
                            </div>
                          </div>
                        )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RecruiterNavbar;
