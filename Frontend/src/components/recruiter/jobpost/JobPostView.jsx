import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetJobPostByIdQuery } from "../RecruiterQuery";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import ViewOnlyEditor from "@/components/common/ViewOnlyEditor";

const JobPostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: jobPostData, isLoading, isError } = useGetJobPostByIdQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading job post.</div>;
  }

  const jobPost = jobPostData || {};

  const getJobTypeColor = (type) => {
    const colors = {
      "full-time": "bg-blue-500",
      "part-time": "bg-green-500",
      contract: "bg-orange-500",
      remote: "bg-purple-500",
      hybrid: "bg-cyan-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const renderDescription = (description) => {
    if (!description || !Array.isArray(description)) return null;

    return description.map((block, index) => {
      if (block.type === "paragraph") {
        return (
          <p key={index} className="mb-4">
            {block.children.map((child, childIndex) => {
              let text = child.text;
              if (child.bold) text = <strong key={childIndex}>{text}</strong>;
              if (child.italic) text = <em key={childIndex}>{text}</em>;
              return text;
            })}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{jobPost.title}</CardTitle>
          <CardDescription className="mt-2">
            <Badge className={getJobTypeColor(jobPost.jobType)}>
              {jobPost?.jobType?.charAt(0)?.toUpperCase() +
                jobPost?.jobType?.slice(1)}
            </Badge>
            <span className="ml-2">•</span>
            <span className="ml-2">{jobPost.location}</span>
          </CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/recruiter/jobpost")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Salary Range</h3>
            <p>
              ${jobPost?.salaryRange?.min?.toLocaleString()} - $
              {jobPost?.salaryRange?.max?.toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Experience Required</h3>
            <p>
              {jobPost?.experienceRequired?.min} -{" "}
              {jobPost?.experienceRequired?.max} years
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {jobPost?.requiredSkills?.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Job Description</h3>
          <div className="prose prose-sm max-w-none">
            {/* {renderDescription(jobPost.description)} */}
            {jobPost.description && (
              <ViewOnlyEditor documentData={jobPost.description} />
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/recruiter/jobpost/form/${jobPost._id}`)}
          >
            Edit Job Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobPostView;
