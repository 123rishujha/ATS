import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";

const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-library-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-library-dark hover:text-library-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-library-dark hover:text-library-primary transition-colors"
            >
              How It Works
            </a>
            <a
              href="#community"
              className="text-library-dark hover:text-library-primary transition-colors"
            >
              Community
            </a>
            <a
              href="#contact"
              className="text-library-dark hover:text-library-primary transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <span
              onClick={() => {
                console.log("navigate called");
                navigate("/auth/login");
              }}
              className="cursor-pointer text-library-primary font-medium hover:text-library-primary/80 transition-colors"
            >
              Log in
            </span>
            <span
              onClick={() => navigate("/auth/signup")}
              className="cursor-pointer btn-primary text-center"
            >
              Sign up
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-library-dark"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-library-accent/20">
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-library-dark hover:text-library-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-library-dark hover:text-library-primary transition-colors"
              >
                How It Works
              </a>
              <a
                href="#community"
                className="text-library-dark hover:text-library-primary transition-colors"
              >
                Community
              </a>
              <a
                href="#contact"
                className="text-library-dark hover:text-library-primary transition-colors"
              >
                Contact
              </a>
              <div className="pt-4 flex flex-col space-y-4">
                <span
                  onClick={() => {
                    console.log("navigate called");
                    navigate("/auth/login");
                  }}
                  className="cursor-pointer text-library-primary font-medium hover:text-library-primary/80 transition-colors"
                >
                  Log in
                </span>
                <span
                  onClick={() => navigate("/auth/signup")}
                  className="cursor-pointer btn-primary text-center"
                >
                  Sign up
                </span>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicNavbar;
