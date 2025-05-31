import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetJobPostByIdQuery } from "../JobSeekerQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: jobPost,
    isLoading,
    isError,
    error,
  } = useGetJobPostByIdQuery(id);

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

  const renderDescription = (description) => {
    if (!description) return null;
    // Assuming description is an array of objects like Slate's value
    return description.map((node, index) => {
      if (node.type === "paragraph") {
        return (
          <p key={index} className="mb-4">
            {node.children.map((child, childIndex) => {
              let content = child.text;
              if (child.bold) {
                content = <strong key={childIndex}>{content}</strong>;
              }
              if (child.italic) {
                content = <em key={childIndex}>{content}</em>;
              }
              return content;
            })}
          </p>
        );
      }
      // Add handling for other node types if necessary
      return null; // Or a default rendering
    });
  };

  if (isLoading) {
    return <div>Loading job details...</div>;
  }

  if (isError) {
    return <div>Error fetching job details: {error.message}</div>;
  }

  if (!jobPost) {
    return <div>Job post not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => navigate("/jobseeker/jobs")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-3xl font-bold">
              {jobPost.title}
            </CardTitle>
            <Badge className={getJobTypeColor(jobPost.jobType)}>
              {jobPost.jobType}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>{jobPost.location}</span>
            <span>|</span>
            <span>Salary: {jobPost.salaryRange.min-jobPost.salaryRange.max}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Description</h3>
            <div className="mt-2 text-gray-700">
              {/* {renderDescription(jobPost.description)} */}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Requirements</h3>
            <p className="mt-2 text-gray-700">
              Experience: {jobPost.experienceRequired.min-jobPost.experienceRequired.max}
            </p>
            <div className="mt-2">
              <h4 className="text-md font-semibold">Required Skills:</h4>
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-700">
                {jobPost.requiredSkills &&
                  jobPost.requiredSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
              </ul>
            </div>
          </div>
          {/* Add Apply button here later */}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetails;
