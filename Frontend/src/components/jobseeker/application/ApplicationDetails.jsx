import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  CalendarDays,
  MapPin,
  DollarSign,
  Clock,
  FileDown,
  IndianRupee,
  Building2,
  Briefcase,
  User,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  FileText,
  Timer,
} from "lucide-react";
import { format } from "date-fns";
import {
  useGetApplicationByIdQuery,
  useJobApplicationOperMutation,
} from "../JobSeekerQuery";
import { formatSalary } from "@/utils/formatSalary";
import ViewOnlyEditor from "@/components/common/ViewOnlyEditor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: applicationData,
    isLoading,
    isError,
  } = useGetApplicationByIdQuery(id);

  const [updateApplicationApi, { isLoading: isUpdatingApplication }] =
    useJobApplicationOperMutation();

  const application = applicationData?.data ? { ...applicationData?.data } : {};
  if (application) {
    application["job"] = { ...application.jobId };
  }

  console.log("applicationData?.data", applicationData?.data);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground font-medium">
            Loading application details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <XCircle className="h-16 w-16 text-destructive mx-auto" />
          <p className="text-destructive font-medium">
            Error loading application details.
          </p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-primary/10 text-primary border-primary/20";
      case "interview_scheduled":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
      case "interview_done":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
      case "offered":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const handleOffer = async (accept) => {
    const body = {
      accepted: accept,
    };
    try {
      await updateApplicationApi({
        url: `/accept-reject/${id}`,
        method: "PUT",
        body: body,
      }).unwrap();
      navigate(-1);
    } catch (error) {
      toast.error(error?.data?.msg || "Failed to save feedback");
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
            Back to Applications
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
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Card */}
            <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">Job Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex-1 space-y-2">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {application.jobId.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <p>{application.jobId.recruiterId.company.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <p>{application.jobId.location}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <p className="capitalize">{application.jobId.jobType}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    <p>
                      ₹{application.jobId.salaryRange.min.toLocaleString()} - ₹
                      {application.jobId.salaryRange.max.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <p>
                      {application.jobId.experienceRequired.min} -{" "}
                      {application.jobId.experienceRequired.max} years
                    </p>
                  </div>
                </div>

                {/* Company Details Section */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="company-details">
                    <AccordionTrigger className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">Company Details</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <p className="font-medium">Company Name</p>
                          </div>
                          <p className="text-foreground">
                            {application.jobId.recruiterId.company.name}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <p className="font-medium">Location</p>
                          </div>
                          <p className="text-foreground">
                            {application.jobId.recruiterId.company.location}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <p className="font-medium">Website</p>
                          </div>
                          <a
                            href={application.jobId.recruiterId.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {application.jobId.recruiterId.company.website}
                          </a>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <p className="font-medium">Description</p>
                          </div>
                          <p className="text-foreground">
                            {application.jobId.recruiterId.company.description}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Job Description */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="job-description">
                    <AccordionTrigger className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">Job Description</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert pt-4">
                        {application.jobId.description.map((block, index) => {
                          if (block.type === "heading-two") {
                            return (
                              <h2
                                key={index}
                                className="text-xl font-bold mt-4 mb-2"
                              >
                                {block.children[0].text}
                              </h2>
                            );
                          }
                          if (block.type === "paragraph") {
                            return (
                              <p key={index} className="mb-4">
                                {block.children[0].text}
                              </p>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Interview Details Card */}
            {application.interview && (
              <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <CalendarDays className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">Interview Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {application.interview.scheduledAt && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-2 mb-2 text-orange-800 dark:text-orange-400">
                        <CalendarDays className="h-5 w-5" />
                        <p className="font-semibold">Scheduled Meeting</p>
                      </div>
                      <p className="text-orange-700 dark:text-orange-300 text-sm">
                        {format(
                          new Date(application.interview.scheduledAt),
                          "EEEE, MMMM do, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  )}

                  {application.interview.zoomLink && (
                    <Button
                      onClick={() =>
                        window.open(application.interview.zoomLink, "_blank")
                      }
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Join Meeting
                    </Button>
                  )}

                  {application.interview.feedback && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">
                        Interview Feedback
                      </h4>
                      <div className="bg-muted/50 rounded-lg p-4 border border-border">
                        <p className="text-muted-foreground whitespace-pre-line">
                          {application.interview.feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Offer Letter Card */}
            {application.offerLetter && (
              <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                        <FileDown className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">Offer Letter</CardTitle>
                    </div>
                    {application.offerLetter.accepted !== true &&
                      application.offerLetter.accepted !== false && (
                        <div className="flex gap-2">
                          {isUpdatingApplication ? (
                            "Submitting..."
                          ) : (
                            <>
                              <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleOffer(true)}
                                disabled={isUpdatingApplication}
                              >
                                Accept Offer
                              </Button>
                              <Button
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleOffer(false)}
                                disabled={isUpdatingApplication}
                              >
                                Reject Offer
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        Offer Letter Document
                      </p>
                      <p className="text-xs text-gray-500">
                        Sent on{" "}
                        {format(
                          new Date(application.updatedAt),
                          "MMM do, yyyy"
                        )}
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        window.open(application.offerLetter.url, "_blank")
                      }
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  {application.offerLetter.accepted !== undefined && (
                    <div
                      className={`p-4 rounded-lg border ${
                        application.offerLetter.accepted
                          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                          : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {application.offerLetter.accepted ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        <p
                          className={`font-medium ${
                            application.offerLetter.accepted
                              ? "text-green-800 dark:text-green-400"
                              : "text-red-800 dark:text-red-400"
                          }`}
                        >
                          {application.offerLetter.accepted
                            ? "Offer Accepted"
                            : "Offer Declined"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Application Timeline */}
          <div className="space-y-6">
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

                {application?.interview?.scheduledAt && (
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

                {application?.interview?.feedback && (
                  <div className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg border border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Interview Completed</p>
                      <p className="text-sm">
                        {format(
                          new Date(application.updatedAt),
                          "MMM do, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {application?.offerLetter && (
                  <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Offer Letter Sent</p>
                      <p className="text-sm">
                        {format(
                          new Date(application.updatedAt),
                          "MMM do, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {application?.offerLetter?.accepted !== undefined && (
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      application.offerLetter.accepted
                        ? "bg-green-100 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                        : "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        application.offerLetter.accepted
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium">
                        {application.offerLetter.accepted
                          ? "Offer Accepted"
                          : "Offer Declined"}
                      </p>
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

export default ApplicationDetails;
