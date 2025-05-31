import React from "react";
import { Plus, Pencil, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  useGetRecruiterJobPostsQuery,
  useJobPostOperMutation,
} from "../RecruiterQuery";
import { toast } from "sonner";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading job posts.</div>;
  }

  if (jobPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">No job posts available</h2>
          <p className="text-muted-foreground">
            Create your first job post to get started
          </p>
          <Button size="lg" className="mt-4" onClick={() => navigate("form")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job Post
          </Button>
        </div>
      </div>
    );
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Job Type</TableHead>
              <TableHead>Salary Range</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobPosts.map((job) => (
              <TableRow key={job._id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <Badge className={getJobTypeColor(job.jobType)}>
                    {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {job.salaryRange
                    ? `$${job.salaryRange.min} - $${job.salaryRange.max}`
                    : "Not specified"}
                </TableCell>
                <TableCell>
                  {job.experienceRequired
                    ? `${job.experienceRequired.min} - ${job.experienceRequired.max} years`
                    : "Not specified"}
                </TableCell>
                <TableCell
                  onClick={() => handleTogglePublished(job)}
                  className="cursor-pointer"
                >
                  <Badge variant={job.isPublished ? "default" : "secondary"}>
                    {job.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>{job.applicantsCount}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(job._id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(job._id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default JobPostTable;
