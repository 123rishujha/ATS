import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Wallet,
} from "lucide-react";
import { useGetAllJobPostsQuery } from "../JobSeekerQuery";
import { Link } from "react-router-dom";
import Loading from "@/components/common/Loading";

const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [salaryRange, setSalaryRange] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError, error } = useGetAllJobPostsQuery();

  const filteredJobs = useMemo(() => {
    if (!data) return [];

    return data.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requiredSkills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesJobType =
        selectedJobType === "all" || job.jobType === selectedJobType;

      const matchesLocation =
        selectedLocation === "all" ||
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesSalary =
        salaryRange === "all" ||
        (() => {
          const maxSalary = job.salaryRange.max;
          switch (salaryRange) {
            case "0-500000":
              return maxSalary <= 500000;
            case "500000-1000000":
              return maxSalary > 500000 && maxSalary <= 1000000;
            case "1000000+":
              return maxSalary > 1000000;
            default:
              return true;
          }
        })();

      const matchesExperience =
        experienceLevel === "all" ||
        (() => {
          const maxExp = job.experienceRequired.max;
          switch (experienceLevel) {
            case "entry":
              return maxExp <= 1;
            case "mid":
              return maxExp > 1 && maxExp <= 4;
            case "senior":
              return maxExp > 4;
            default:
              return true;
          }
        })();

      return (
        matchesSearch &&
        matchesJobType &&
        matchesLocation &&
        matchesSalary &&
        matchesExperience
      );
    });
  }, [
    data,
    searchTerm,
    selectedJobType,
    selectedLocation,
    salaryRange,
    experienceLevel,
  ]);

  const getJobTypeColor = (jobType) => {
    switch (jobType.toLowerCase()) {
      case "full-time":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "part-time":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "contract":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "remote":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "hybrid":
        return "bg-pink-100 text-pink-700 border-pink-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatSalary = (min, max) => {
    const formatNumber = (num) => {
      if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
      return num.toString();
    };
    return `₹${formatNumber(min)} - ₹${formatNumber(max)}`;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-red-600">Error fetching job listings</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Discover amazing opportunities from top companies. Your next career
          move starts here.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Job Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Locations</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
              <option value="pune">Pune</option>
              <option value="hyderabad">Hyderabad</option>
            </select>

            <select
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Salaries</option>
              <option value="0-500000">Up to ₹5L</option>
              <option value="500000-1000000">₹5L - ₹10L</option>
              <option value="1000000+">₹10L+</option>
            </select>

            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Experience</option>
              <option value="entry">Entry Level (0-1 years)</option>
              <option value="mid">Mid Level (2-4 years)</option>
              <option value="senior">Senior Level (5+ years)</option>
            </select>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-slate-600">
        Found{" "}
        <span className="font-semibold text-slate-800">
          {filteredJobs.length}
        </span>{" "}
        jobs
      </div>

      {/* Job Listings - Horizontal Layout */}
      <div className="space-y-4 ">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Card
              key={job._id}
              className="group hover:shadow-lg transition-all duration-300 border-slate-200 bg-white"
            >
              <Link to={`/jobseeker/jobs/${job._id}`} className="mb-2">
                <CardContent className="p-4 md:p-6">
                  {/* Desktop Layout */}
                  <div className="hidden lg:flex items-center justify-between gap-6 cursor-pointer">
                    {/* Left Section - Job Info */}
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex items-end justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                            {job.title}
                          </h3>
                          <p className="text-sm font-medium text-slate-600 truncate">
                            {job.company}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                        </div>
                        <Badge
                          className={`${getJobTypeColor(
                            job.jobType
                          )} border font-medium flex-shrink-0`}
                        >
                          {job.jobType}
                        </Badge>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.slice(0, 4).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {job.requiredSkills.length > 4 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-100 text-slate-500"
                          >
                            +{job.requiredSkills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Middle Section - Details */}
                    <div className="flex  items-center gap-8 px-6 border-l border-r border-slate-200 flex-shrink-0">
                      <div className="text-center">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                          <Wallet className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-slate-800 text-sm">
                            {formatSalary(
                              job.salaryRange.min,
                              job.salaryRange.max
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Salary</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-slate-800 text-sm">
                            {job.experienceRequired.min}-
                            {job.experienceRequired.max} yrs
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Experience</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-slate-800 text-sm">
                            {job.applicantsCount}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Applicants</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile/Tablet Layout */}
                  <div className="lg:hidden space-y-4 cursor-pointer">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <h3 className="text-lg md:text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-600">
                          {job.company}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <Badge
                        className={`${getJobTypeColor(
                          job.jobType
                        )} border font-medium flex-shrink-0`}
                      >
                        {job.jobType}
                      </Badge>
                    </div>

                    {/* Skills Row */}
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.slice(0, 4).map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {job.requiredSkills.length > 4 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-slate-100 text-slate-500"
                        >
                          +{job.requiredSkills.length - 4} more
                        </Badge>
                      )}
                    </div>

                    {/* Details Row */}
                    <div className="grid grid-cols-3 gap-4 py-3 border-t border-slate-200">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-slate-800 text-sm">
                            {formatSalary(
                              job.salaryRange.min,
                              job.salaryRange.max
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Salary</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-slate-800 text-sm">
                            {job.experienceRequired.min}-
                            {job.experienceRequired.max} yrs
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Experience</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-slate-800 text-sm">
                            {job.applicantsCount}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Applicants</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-xl font-semibold text-slate-700">
                No jobs found
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find more
                opportunities.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedJobType("all");
                  setSelectedLocation("all");
                  setSalaryRange("all");
                  setExperienceLevel("all");
                }}
                variant="outline"
                className="mt-4"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
