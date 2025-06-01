import React from "react";
import { Plus, Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  useGetRecruiterJobPostsQuery,
  useJobPostOperMutation,
} from "../RecruiterQuery";
import { toast } from "sonner";
import DataTable from "@/utils/DataTable";
import { formatSalary } from "@/utils/formatSalary";

const JobPostTable = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetRecruiterJobPostsQuery();
  const [jobPostOperation] = useJobPostOperMutation();

  const jobPosts = data?.data || [];

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

  const handleTogglePublished = async (jobPost) => {
    try {
      await jobPostOperation({
        args: `/${jobPost._id}`,
        method: "PUT",
        body: { isPublished: !jobPost.isPublished },
      }).unwrap();
      toast.success(
        `Job post status updated to ${
          jobPost.isPublished ? "Draft" : "Published"
        }`
      );
      refetch();
    } catch (error) {
      toast.error(error?.data?.msg || "Failed to update job post status");
    }
  };

  const handleEdit = (id) => {
    navigate(`form/${id}`);
  };

  const handleView = (id) => {
    navigate(`view/${id}`);
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "jobType",
      header: "Job Type",
      cell: ({ row }) => (
        <Badge className={getJobTypeColor(row.original.jobType)}>
          {row.original.jobType.charAt(0).toUpperCase() +
            row.original.jobType.slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: "salaryRange",
      header: "Salary Range",
      cell: ({ row }) =>
        row.original.salaryRange
          ? `${formatSalary(
              row.original.salaryRange.min,
              row.original.salaryRange.max
            )}`
          : "Not specified",
    },
    {
      accessorKey: "experienceRequired",
      header: "Experience",
      cell: ({ row }) =>
        row.original.experienceRequired
          ? `${row.original.experienceRequired.min} - ${row.original.experienceRequired.max} years`
          : "Not specified",
    },
    {
      accessorKey: "isPublished",
      header: "Status",
      cell: ({ row }) => (
        <div
          onClick={() => handleTogglePublished(row.original)}
          className="cursor-pointer"
        >
          <Badge variant={row.original.isPublished ? "default" : "secondary"}>
            {row.original.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "applicantsCount",
      header: "Applicants",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(row.original._id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original._id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isError) {
    return <div>Error loading job posts.</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Job Posts</CardTitle>
        <Button onClick={() => navigate("form")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Job Post
        </Button>
      </CardHeader>
      <CardContent>
        {jobPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">No job posts available</h2>
              <p className="text-muted-foreground">
                Create your first job post to get started
              </p>
              <Button
                size="lg"
                className="mt-4"
                onClick={() => navigate("form")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Job Post
              </Button>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={jobPosts}
            searchKey="title"
            searchPlaceholder="Search job posts..."
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default JobPostTable;
