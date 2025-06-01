import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetApplicationMatchScoreMutation,
  useGetJobPostByIdQuery,
  useJobApplicationOperMutation,
} from "../JobSeekerQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, MapPin, Wallet, Target } from "lucide-react";
import { formatSalary } from "@/utils/formatSalary";
import { Progress } from "@/components/ui/progress";
import ViewOnlyEditor from "@/components/common/ViewOnlyEditor";
// import { Plain } from "slate";
// import Plain from "slate-plain-serializer";
import { Node } from "slate";
import { useSelector } from "react-redux";
import EnhancedProgressBar from "./MatchScore";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matchScore, setMatchScore] = useState(0);
  const { userState } = useSelector((state) => state.user);

  const {
    data: jobPost,
    isLoading,
    isError,
    error,
  } = useGetJobPostByIdQuery(id);

  const [getApplicationMatchScore, { isLoading: isMatchScoreLoading }] =
    useGetApplicationMatchScoreMutation();

  const [applyAPI, { isLoading: isApplying }] = useJobApplicationOperMutation();

  useEffect(() => {
    if (jobPost?.description && userState?.resume?.url) {
      getMatchScore();
    }
  }, [jobPost]);

  const getMatchScore = async () => {
    const plainTextDescription = slateToPlainText(jobPost?.description);

    // Create salary range string
    const salaryRangeText = jobPost?.salaryRange
      ? `Salary Range: ${jobPost.salaryRange.min} - ${jobPost.salaryRange.max}`
      : "";

    // Create experience required string
    const experienceText = jobPost?.experienceRequired
      ? `Experience Required: ${jobPost.experienceRequired.min} - ${jobPost.experienceRequired.max} years`
      : "";

    // Create required skills string
    const skillsText = jobPost?.requiredSkills?.length
      ? `Required Skills: ${jobPost.requiredSkills.join(", ")}`
      : "";

    // Create job title string
    const titleText = jobPost?.title ? `Job Title: ${jobPost.title}` : "";

    // Combine all parts into one string
    const combinedJobDescription = [
      titleText,
      salaryRangeText,
      experienceText,
      skillsText,
      plainTextDescription,
    ]
      .filter((text) => text.trim() !== "") // Remove empty strings
      .join("\n\n"); // Join with double line breaks for readability

    const res = await getApplicationMatchScore({
      body: {
        resumeUrl: userState?.resume?.url,
        jobDescription: combinedJobDescription, // Use the combined string here
      },
    });
    if (res?.data) {
      setMatchScore(res?.data?.data || 0);
    }
  };

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

  const slateToPlainText = (nodes) => {
    return nodes
      .filter((el) => Node.string(el))
      .map((node) => Node.string(node))
      .join("\n");
  };

  const handleApply = async () => {
    const res = await applyAPI({
      body: {
        jobId: jobPost._id,
        aiFitScore: matchScore,
      },
      method: "POST",
    });
    if (res?.data?.status_code === 200 || res?.data?.status_code === 201) {
      navigate("/jobseeker/applications");
    }
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

      <div className="w-[100%]">
        {/* <div className="flex justify-center items-center gap-2 w-[100%]">
          <Target className={`h-4 w-4 ${getMatchScoreColor(matchScore)}`} />
          <span
            className={`text-lg font-medium ${getMatchScoreColor(matchScore)}`}
          >
            Match Score: {isMatchScoreLoading ? "Loading.." : `${matchScore}%`}
          </span>
        </div>
        <Progress value={matchScore} className="w-full" /> */}
        <EnhancedProgressBar
          matchScore={matchScore}
          isMatchScoreLoading={isMatchScoreLoading}
          animationDuration={1500}
          animationDelay={300}
        />
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">
                {jobPost.title}
              </CardTitle>
            </div>
            <Badge className={getJobTypeColor(jobPost.jobType)}>
              {jobPost.jobType}
            </Badge>
          </div>
          <div className="flex items-center gap-8 text-muted-foreground flex-wrap">
            <div className="text-center">
              <div className="flex items-center gap-2 text-sm text-slate-800">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{jobPost.location}</span>
              </div>
              <p className="text-xs text-slate-500">Location</p>
            </div>
            <span>|</span>

            <div className="text-center">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Wallet className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-slate-800 text-sm">
                  {formatSalary(
                    jobPost.salaryRange.min,
                    jobPost.salaryRange.max
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500">Salary/Anually</p>
            </div>

            <span>|</span>

            <div className="text-center">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-slate-800 text-sm">
                  {jobPost.experienceRequired.min}-
                  {jobPost.experienceRequired.max} yrs
                </span>
              </div>
              <p className="text-xs text-slate-500">Experience</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <div className="mt-2 text-gray-700">
              {/* {renderDescription(jobPost.description)} */}
              <ViewOnlyEditor documentData={jobPost.description} />
            </div>
          </div>

          <div>
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Required Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {jobPost.requiredSkills &&
                  jobPost.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              className="w-full sm:w-auto"
              size="lg"
              disabled={isApplying}
              onClick={() => handleApply()}
            >
              {isApplying ? "Applying..." : "Apply Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetails;
