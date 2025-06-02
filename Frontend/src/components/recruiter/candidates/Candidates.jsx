import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Eye, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetRecruiterJobPostsQuery } from "../RecruiterQuery";
import { useGetApplicationsByJobIdMutation } from "../RecruiterQuery";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/utils/DataTable";
import { useNavigate } from "react-router-dom";

const Candidates = () => {
  const { data: jobPosts, isLoading: isLoadingJobPosts } =
    useGetRecruiterJobPostsQuery();
  const [
    getApplicationsByJobId,
    { data: applications, isLoading: isLoadingApplications },
  ] = useGetApplicationsByJobIdMutation();

  const [selectedJob, setSelectedJob] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredApplications, setFilteredApplications] = useState([]);

  // New state for filters to be applied on button click
  const [appliedFilters, setAppliedFilters] = useState({
    job: "",
    status: "all",
    startDate: null,
    endDate: null,
  });

  const navigate = useNavigate();

  const handleJobChange = (jobId) => {
    setSelectedJob(jobId);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // New function to apply filters
  const applyFilters = () => {
    setAppliedFilters({
      job: selectedJob,
      status: selectedStatus,
      startDate,
      endDate,
    });
  };

  // Effect to fetch data when appliedFilters change
  useEffect(() => {
    if (appliedFilters.job && appliedFilters.job !== "none") {
      getApplicationsByJobId({
        jobId: appliedFilters.job,
        status:
          appliedFilters.status === "all" ? undefined : appliedFilters.status,
        startDate: appliedFilters.startDate
          ? format(appliedFilters.startDate, "yyyy-MM-dd")
          : undefined,
        endDate: appliedFilters.endDate
          ? format(appliedFilters.endDate, "yyyy-MM-dd")
          : undefined,
      });
    }
  }, [appliedFilters, getApplicationsByJobId]);

  // Effect to update filteredApplications when applications data changes
  useEffect(() => {
    if (applications?.data) {
      setFilteredApplications(applications?.data);
    }
  }, [applications]);

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

  const columns = useMemo(
    () => [
      {
        accessorKey: "candidate.name",
        header: "Candidate Name",
      },
      {
        accessorKey: "candidate.email",
        header: "Email",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          return <Badge className={getStatusColor(status)}>{status}</Badge>;
        },
      },
      {
        accessorKey: "aiFitScore",
        header: "AI Fit Score",
        cell: ({ row }) => {
          const val = row.getValue("aiFitScore");
          return val + "%";
        },
      },
      {
        accessorKey: "createdAt",
        header: "Application Date",
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return format(date, "PPP");
        },
      },
      {
        id: "actions",
        header: "Resume",
        cell: ({ row }) => (
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                window.open(row.original?.candidate?.resume?.url, "_blank")
              }
            >
              <FileDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigate(`${row.original?.candidate?._id}`, {
                  state: { jobId: row.original.job?._id },
                });
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => filteredApplications, [filteredApplications]);

  const isLoading = isLoadingJobPosts || isLoadingApplications;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidates</CardTitle>
        <CardDescription>View and manage job applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Select onValueChange={handleJobChange} value={selectedJob}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a job</SelectItem>
                {jobPosts?.data?.map((job) => (
                  <SelectItem key={job._id} value={job._id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select onValueChange={handleStatusChange} value={selectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Start Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>End Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={applyFilters} disabled={!selectedJob}>
            Apply Filters
          </Button>
        </div>

        {selectedJob && selectedJob !== "none" ? (
          <DataTable columns={columns} data={data} isLoading={isLoading} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Select a Job</h2>
              <p className="text-muted-foreground">
                Choose a job to view its candidates
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Candidates;
