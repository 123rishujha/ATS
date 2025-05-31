import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetAllJobPostsQuery } from "../JobSeekerQuery";

const JobListings = () => {
  const {
    data: jobPosts,
    isLoading,
    isError,
    error,
  } = useGetAllJobPostsQuery();
  const navigate = useNavigate();

  console.log("ajlkdjjobPosts", jobPosts);

  if (isLoading) {
    return <div>Loading job listings...</div>;
  }

  if (isError) {
    return <div>Error fetching job listings: {error.message}</div>;
  }

  const getJobTypeColor = (jobType) => {
    switch (jobType) {
      case "Full-time":
        return "bg-green-100 text-green-800";
      case "Part-time":
        return "bg-yellow-100 text-yellow-800";
      case "Contract":
        return "bg-blue-100 text-blue-800";
      case "Remote":
        return "bg-purple-100 text-purple-800";
      case "Hybrid":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Available Job Listings
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobPosts && jobPosts.length > 0 ? (
          jobPosts?.map((job) => (
            <Card key={job._id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {job.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getJobTypeColor(job.jobType)}>
                    {job.jobType}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {job.location}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {job.description}
                </p>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Salary: {job.salaryRange}</p>
                  <p>Experience: {job.experienceRequired}</p>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <Button
                  onClick={() => navigate(`/jobseeker/jobs/${job._id}`)}
                  className="w-full"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div>No job listings available at the moment.</div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
