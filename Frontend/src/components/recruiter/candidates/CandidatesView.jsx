import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useGetUserByIdQuery } from "../RecruiterQuery";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  DollarSign,
  Clock,
  Home,
  Link as LinkIcon,
  ChevronLeft,
  FileDown,
  IndianRupee,
  Video,
} from "lucide-react";
import { format } from "date-fns";
import { useJobApplicationOperMutation } from "@/components/jobseeker/JobSeekerQuery";
import { ToastHandler } from "@/components/myToast/ToastHandler";

const CandidatesView = () => {
  const { candidateId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    data: candidateData,
    isLoading,
    isError,
  } = useGetUserByIdQuery(candidateId);

  const [updateApplicationApi] = useJobApplicationOperMutation();

  const candidate = candidateData?.data;

  if (isLoading) {
    return <div>Loading candidate details...</div>;
  }

  if (isError) {
    return <div>Error loading candidate details.</div>;
  }

  if (!candidate) {
    return <div>Candidate not found.</div>;
  }

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleShortList = async () => {
    const body = {
      status: "interview_scheduled",
    };
    console.log("sssssss", body);
    await updateApplicationApi({
      body: body,
      url: `/${state?._id}`,
      method: "PUT",
      msz: false,
    });
    ToastHandler("suc", "Meeting Scheduled");
    navigate(-1);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={candidate.userPhoto} alt={candidate.name} />
            <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{candidate.name}</CardTitle>
            <CardDescription>{candidate.email}</CardDescription>
            {candidate.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {candidate.description}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Candidates
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resume */}
        {candidate.resume?.url && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Resume</h3>
            <Button
              variant="outline"
              onClick={() => window.open(candidate.resume.url, "_blank")}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" /> Download Resume
            </Button>
          </div>
        )}

        {/* Job Preferences */}
        {candidate.jobPreferences && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidate.jobPreferences.roles?.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Preferred Roles
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {candidate.jobPreferences.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {candidate.jobPreferences.locationPreference && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Location Preference
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.jobPreferences.locationPreference}</span>
                  </div>
                </div>
              )}
              {candidate.jobPreferences.salaryExpectation && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Salary Expectation/ Anually
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {candidate.jobPreferences.salaryExpectation.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              {candidate.jobPreferences.noticePeriod && (
                <div>
                  <p className="text-sm text-muted-foreground">Notice Period</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.jobPreferences.noticePeriod}</span>
                  </div>
                </div>
              )}
              {candidate.jobPreferences.remotePreferred !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Remote Preferred
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {candidate.jobPreferences.remotePreferred ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-end">
          {/* Created/Updated Dates */}
          <div className="text-sm text-muted-foreground flex gap-4">
            {candidate.createdAt && (
              <p>
                Applied On: {format(new Date(candidate.createdAt), "PPP p")}
              </p>
            )}
            {candidate.updatedAt && (
              <p>
                Last Updated: {format(new Date(candidate.updatedAt), "PPP p")}
              </p>
            )}
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => handleShortList()}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              schedule Meeting
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidatesView;
