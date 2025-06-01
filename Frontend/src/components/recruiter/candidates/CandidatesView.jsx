import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  useGetUserByIdQuery,
  useGetRecruiterApplicationByJobAndCandidateQuery,
} from "../RecruiterQuery";
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
  Calendar as CalendarIconLucide,
  Mail,
  User,
  Briefcase,
  CalendarDays,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Phone,
  Globe,
  Star,
  Timer,
} from "lucide-react";
import { format } from "date-fns";
import { useJobApplicationOperMutation } from "@/components/jobseeker/JobSeekerQuery";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const CandidatesView = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId;

  const {
    data: candidateData,
    isLoading: isLoadingCandidate,
    isError: isErrorCandidate,
  } = useGetUserByIdQuery(candidateId);
  const {
    data: applicationData,
    isLoading: isLoadingApplication,
    isError: isErrorApplication,
    refetch: refetchApplication,
  } = useGetRecruiterApplicationByJobAndCandidateQuery(
    { jobId, candidateId },
    { skip: !jobId || !candidateId ? true : false }
  );

  const candidate = candidateData?.data;
  const application = applicationData?.data;

  const isLoading = isLoadingCandidate || isLoadingApplication;
  const isError = isErrorCandidate || isErrorApplication;

  const [updateApplicationApi, { isLoading: isUpdatingApplication }] =
    useJobApplicationOperMutation();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [scheduledTime, setScheduledTime] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  const handleDateSelect = (date) => {
    if (date) {
      setScheduledDate(date);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground font-medium">
            Loading candidate details...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          <p className="text-destructive font-medium">Error loading details.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <User className="h-16 w-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground font-medium">
            Candidate not found.
          </p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground font-medium">
            Application for this job not found for this candidate.
          </p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleScheduleMeeting = async () => {
    if (!scheduledDate || !scheduledTime || !zoomLink) {
      toast.error("Please fill all meeting details.");
      return;
    }

    const [year, month, day] = scheduledDate.split("-").map(Number);
    const [hours, minutes] = scheduledTime.split(":").map(Number);
    const scheduledDateTime = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes,
      0,
      0
    );

    const body = {
      status: "interview_scheduled",
      interview: {
        scheduledAt: scheduledDateTime.toISOString(),
        zoomLink: zoomLink,
      },
    };

    try {
      await updateApplicationApi({
        url: `/${application._id}`,
        method: "PUT",
        body: body,
      }).unwrap();
      toast.success("Interview scheduled successfully!");
      setIsScheduleModalOpen(false);
      refetchApplication();
    } catch (error) {
      toast.error(error?.data?.msg || "Failed to schedule interview");
    }
  };

  console.log("aaaaaaaaaa lica", application);

  const handleSaveFeedback = async () => {
    if (!feedback.trim()) {
      toast.error("Feedback cannot be empty.");
      return;
    }

    const body = {
      status: "interview_done",
      interview: {
        ...application.interview,
        feedback: feedback.trim(),
      },
    };

    try {
      setIsSavingFeedback(true);
      await updateApplicationApi({
        url: `/${application._id}`,
        method: "PUT",
        body: body,
      }).unwrap();
      refetchApplication();
    } catch (error) {
      toast.error(error?.data?.msg || "Failed to save feedback");
    } finally {
      setIsSavingFeedback(false);
    }
  };

  const hasMeetingScheduled = application.interview?.zoomLink;
  const hasFeedback = application.interview?.feedback?.trim();

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-primary/10 text-primary border-primary/20";
      case "interview_scheduled":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
      case "interviewed":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "hired":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Candidates
          </Button>

          {application?.status && (
            <Badge
              className={`px-4 py-2 font-medium border ${getStatusColor(
                application.status
              )}`}
            >
              {application.status.replace("_", " ").toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Candidate Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 ring-4 ring-background shadow-lg">
                      <AvatarImage
                        src={candidate.userPhoto}
                        alt={candidate.name}
                      />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                        {getInitials(candidate.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <CardTitle className="text-2xl font-bold text-foreground">
                        {candidate.name}
                      </CardTitle>
                      {candidate.email && (
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground text-base">
                          <Mail className="h-4 w-4" />
                          <p>{candidate.email}</p>
                        </div>
                      )}
                      {candidate.phone && (
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground text-base">
                          <Phone className="h-4 w-4" />
                          <p>{candidate.phone}</p>
                        </div>
                      )}
                      {candidate.website && (
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground text-base">
                          <Globe className="h-4 w-4" />
                          <a
                            href={candidate.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600 dark:text-blue-400"
                          >
                            {candidate.website}
                          </a>
                        </div>
                      )}
                    </div>
                    {candidate.description && (
                      <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                        <p className="text-foreground leading-relaxed">
                          {candidate.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Preferences Card */}
            {candidate.jobPreferences && (
              <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <CardTitle className="text-xl">Job Preferences</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {candidate.jobPreferences.roles?.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <Star className="h-4 w-4 text-primary" />
                          <p className="font-semibold">Preferred Roles</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {candidate.jobPreferences.roles.map((role) => (
                            <Badge
                              key={role}
                              variant="secondary"
                              className="px-3 py-1 hover:bg-secondary/80 transition-colors"
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {candidate.jobPreferences.locationPreference && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <p className="font-semibold">Location Preference</p>
                        </div>
                        <p className="text-muted-foreground bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
                          {candidate.jobPreferences.locationPreference}
                        </p>
                      </div>
                    )}

                    {candidate.jobPreferences.salaryExpectation && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <IndianRupee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <p className="font-semibold">
                            Salary Expectation (Annual)
                          </p>
                        </div>
                        <p className="text-muted-foreground bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 font-medium">
                          ₹
                          {candidate.jobPreferences.salaryExpectation.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {candidate.jobPreferences.noticePeriod && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <Timer className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          <p className="font-semibold">Notice Period</p>
                        </div>
                        <p className="text-muted-foreground bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-800">
                          {candidate.jobPreferences.noticePeriod}
                        </p>
                      </div>
                    )}

                    {candidate.jobPreferences.remotePreferred !== undefined && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-foreground">
                          <Home className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <p className="font-semibold">Remote Work</p>
                        </div>
                        <div
                          className={`px-3 py-2 rounded-lg border ${
                            candidate.jobPreferences.remotePreferred
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400"
                              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400"
                          }`}
                        >
                          {candidate.jobPreferences.remotePreferred
                            ? "Preferred"
                            : "Not Preferred"}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Actions and Details */}
          <div className="space-y-6">
            {/* Resume Card */}
            {candidate.resume?.url && (
              <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                      <FileDown className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">Resume</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => window.open(candidate.resume.url, "_blank")}
                    className="w-full shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Meeting Card */}
            <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">Interview Meeting</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasMeetingScheduled ? (
                  <div className="space-y-4">
                    {application.interview.scheduledAt && (
                      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                          <CalendarDays className="h-5 w-5" />
                          <p className="font-semibold">Scheduled Meeting</p>
                        </div>
                        <p className="text-primary/80 text-sm">
                          {format(
                            new Date(application.interview.scheduledAt),
                            "EEEE, MMMM do, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={() =>
                        window.open(application.interview.zoomLink, "_blank")
                      }
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </Button>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-foreground">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <Label className="font-semibold">
                          Interview Feedback
                        </Label>
                      </div>
                      <Textarea
                        placeholder="Enter detailed feedback about the candidate's performance..."
                        value={feedback || application.interview.feedback || ""}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="min-h-[120px] resize-none border-border focus:border-primary transition-colors"
                      />
                      <Button
                        onClick={handleSaveFeedback}
                        disabled={
                          isSavingFeedback ||
                          !feedback.trim() ||
                          feedback.trim() ===
                            (application.interview.feedback || "")
                        }
                        className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isSavingFeedback ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Saving Feedback...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Save Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Dialog
                    open={isScheduleModalOpen}
                    onOpenChange={setIsScheduleModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={isUpdatingApplication}
                      >
                        {isUpdatingApplication ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Scheduling...
                          </>
                        ) : (
                          <>
                            <CalendarDays className="h-4 w-4 mr-2" />
                            Schedule Interview
                          </>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-sm p-6">
                      <DialogHeader className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                            <CalendarDays className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div>
                            <DialogTitle className="text-xl">
                              Schedule Interview Meeting
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                              Set up the interview details for {candidate.name}.
                            </DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>

                      <div className="space-y-6 py-4">
                        {/* Date Selection */}
                        <div className="space-y-3">
                          <Label
                            htmlFor="scheduledDate"
                            className="flex items-center gap-2 text-base font-semibold"
                          >
                            <CalendarIconLucide className="h-4 w-4 text-primary" />
                            Interview Date
                          </Label>
                          <div className="relative">
                            <CalendarIconLucide className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                              id="scheduledDate"
                              type="date"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                              className="pl-12 h-12 text-base border-2 hover:border-primary/50 focus:border-primary"
                            />
                          </div>
                        </div>

                        {/* Time Selection */}
                        <div className="space-y-3">
                          <Label
                            htmlFor="scheduledTime"
                            className="flex items-center gap-2 text-base font-semibold"
                          >
                            <Clock className="h-4 w-4 text-primary" />
                            Interview Time
                          </Label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                              id="scheduledTime"
                              type="time"
                              value={scheduledTime}
                              onChange={(e) => setScheduledTime(e.target.value)}
                              className="pl-12 h-12 text-base border-2 hover:border-primary/50 focus:border-primary"
                            />
                          </div>
                        </div>

                        {/* Zoom Link */}
                        <div className="space-y-3">
                          <Label
                            htmlFor="zoomLink"
                            className="flex items-center gap-2 text-base font-semibold"
                          >
                            <Video className="h-4 w-4 text-primary" />
                            Zoom Meeting Link
                          </Label>
                          <div className="relative">
                            <Video className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input
                              id="zoomLink"
                              type="url"
                              value={zoomLink}
                              onChange={(e) => setZoomLink(e.target.value)}
                              placeholder="https://zoom.us/j/..."
                              className="pl-12 h-12 text-base border-2 hover:border-primary/50 focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsScheduleModalOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleScheduleMeeting}
                          disabled={
                            isUpdatingApplication ||
                            !scheduledDate ||
                            !scheduledTime ||
                            !zoomLink
                          }
                          className="flex-1"
                        >
                          {isUpdatingApplication ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                              Scheduling...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Schedule Meeting
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>

            {/* Application Timeline Card */}
            <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-lg">
                    Application Timeline
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {application?.createdAt && (
                  <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <p className="font-medium text-primary">
                        Application Submitted
                      </p>
                      <p className="text-sm text-primary/80">
                        {format(
                          new Date(application.createdAt),
                          "MMM do, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {application?.updatedAt &&
                  application.updatedAt !== application.createdAt && (
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border border-accent/70 text-accent-foreground">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <div>
                        <p className="font-medium">Last Updated</p>
                        <p className="text-sm text-accent-foreground/80">
                          {format(
                            new Date(application.updatedAt),
                            "MMM do, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                {hasMeetingScheduled && application.interview.scheduledAt && (
                  <div className="flex items-center gap-3 p-3 bg-orange-100 rounded-lg border border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Interview Scheduled</p>
                      <p className="text-sm">
                        {format(
                          new Date(application.interview.scheduledAt),
                          "MMM do, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {hasFeedback && (
                  <div className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg border border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Feedback Provided</p>
                      <p className="text-sm">
                        {format(
                          new Date(application.updatedAt),
                          "MMM do, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesView;
