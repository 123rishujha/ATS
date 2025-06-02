import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Video,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { format } from "date-fns";
import { useGetJobSeekerDashboardQuery } from "../JobSeekerQuery";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data: dashboardData, isLoading } = useGetJobSeekerDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground font-medium">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  const {
    totalApplications,
    applicationsByStatus,
    recentApplications,
    upcomingInterviews,
    applicationTrends,
  } = dashboardData?.data || {};

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "interview_scheduled":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
      case "interview_done":
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
      case "offered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
      case "rejected":
        return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link to="/jobseeker/jobs">
            <Button className="bg-primary hover:bg-primary/90">
              <Briefcase className="h-4 w-4 mr-2" />
              Find Jobs
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                Applications submitted
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Interviews Scheduled
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applicationsByStatus?.interview_scheduled || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Upcoming interviews
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Offers Received
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applicationsByStatus?.offered || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Job offers received
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Applications Rejected
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applicationsByStatus?.rejected || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Applications not selected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Application Trends */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Application Trends</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={applicationTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(value) =>
                          format(new Date(value), "MMM yyyy")
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) =>
                          format(new Date(value), "MMMM yyyy")
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ fill: "#2563eb" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Recent Applications</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications?.map((application) => (
                    <div
                      key={application._id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">
                            {application.job.company}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {application.job.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <p>{application.job.location}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(application.createdAt),
                            "MMM do, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                      <Badge
                        className={`px-3 py-1 ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Upcoming Interviews */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingInterviews?.length > 0 ? (
                    upcomingInterviews.map((interview) => (
                      <div
                        key={interview._id}
                        className="p-4 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">
                              {interview.job.company}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {interview.job.title}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <p>
                              {format(
                                new Date(interview.interview.scheduledAt),
                                "MMM do, yyyy 'at' h:mm a"
                              )}
                            </p>
                          </div>
                          <Button
                            onClick={() =>
                              window.open(
                                interview.interview.zoomLink,
                                "_blank"
                              )
                            }
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No upcoming interviews scheduled
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
