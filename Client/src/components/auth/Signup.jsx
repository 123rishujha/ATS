import React, { useState } from "react";
import { User, Mail, Lock, Briefcase, Search, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUserSignupMutation } from "./AuthQuery";

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState("jobseeker");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [API, { isLoading: apiLoading }] = useAuthUserSignupMutation();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData((prev) => ({
      ...prev,
      role: role,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords must match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { name, email, password, role } = formData;
    const res = await API({ body: { name: name, email, password, role } });
    if (res?.data?.status_code === 200) {
      navigate("/auth/login");
    }
  };

  const roleOptions = [
    {
      value: "jobseeker",
      label: "Job Seeker",
      description: "Looking for opportunities",
      icon: Search,
      bgColor: "bg-primary",
      hoverColor: "hover:bg-primary/90",
    },
    {
      value: "recruiter",
      label: "Recruiter",
      description: "Finding the right talent",
      icon: Briefcase,
      bgColor: "bg-secondary",
      hoverColor: "hover:bg-secondary/90",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-lg">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join us and start your journey today
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-border">
          <div className="space-y-6">
            {/* Role Selection Cards */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-4">
                Choose your role
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = selectedRole === option.value;

                  return (
                    <div
                      key={option.value}
                      onClick={() => handleRoleChange(option.value)}
                      className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                          : "border-border bg-card hover:border-muted hover:shadow-md"
                      }`}
                    >
                      <div className="p-4 flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-lg ${option.bgColor} ${option.hoverColor} flex items-center justify-center shadow-md transition-colors`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-card-foreground">
                            {option.label}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 rounded-xl bg-primary/5 pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.role && (
                <p className="mt-2 text-sm text-destructive flex items-center">
                  <span className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center mr-2 text-xs">
                    !
                  </span>
                  {errors.role}
                </p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                {selectedRole === "recruiter" ? "Recruiter Name" : "Full Name"}
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
                <input
                  name="name"
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-muted/50 focus:bg-card text-foreground placeholder:text-muted-foreground"
                  placeholder={"John Doe"}
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-destructive flex items-center">
                  <span className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center mr-2 text-xs">
                    !
                  </span>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                {selectedRole === "recruiter"
                  ? "Recruiter Email"
                  : "Email Address"}
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
                <input
                  name="email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-muted/50 focus:bg-card text-foreground placeholder:text-muted-foreground"
                  placeholder={
                    selectedRole === "recruiter"
                      ? "hr@company.com"
                      : "john@example.com"
                  }
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-destructive flex items-center">
                  <span className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center mr-2 text-xs">
                    !
                  </span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
                <input
                  name="password"
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-muted/50 focus:bg-card text-foreground placeholder:text-muted-foreground"
                  placeholder="Create a strong password"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-destructive flex items-center">
                  <span className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center mr-2 text-xs">
                    !
                  </span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
                <input
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-muted/50 focus:bg-card text-foreground placeholder:text-muted-foreground"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-destructive flex items-center">
                  <span className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center mr-2 text-xs">
                    !
                  </span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/auth/login">
                  <button className="font-semibold text-primary hover:text-primary/80 transition-colors">
                    Sign in
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
