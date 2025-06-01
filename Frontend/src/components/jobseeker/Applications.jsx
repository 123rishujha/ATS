import React from "react";
import { useGetAllJobAppQuery } from "./JobSeekerQuery";
import DataTable from "@/utils/DataTable";
import { Badge } from "@/components/ui/badge";
import { format, isValid, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const Applications = () => {
  const navigate = useNavigate();
  const { data: applications, isLoading } = useGetAllJobAppQuery();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "interview":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid Date";
    } catch (error) {
      return "Invalid Date";
    }
  };

  const columns = [
    {
      accessorKey: "job.title",
      header: "Job Title",
    },
    {
      accessorKey: "job.company",
      header: "Company",
    },
    {
      accessorKey: "aiFitScore",
      header: "Match Score",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.aiFitScore || 0}%</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Applied Date",
      cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/jobseeker/jobs/${row.original.job._id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      <DataTable
        columns={columns}
        data={applications?.data || []}
        searchKey="job.title"
        searchPlaceholder="Search by job title..."
      />
    </div>
  );
};

export default Applications;
