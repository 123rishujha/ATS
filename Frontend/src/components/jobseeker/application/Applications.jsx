import React from "react";
import { useGetAllJobAppQuery } from "../JobSeekerQuery";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import DataTable from "@/utils/DataTable";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import Loading from "@/components/common/Loading";

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

  const columns = [
    {
      accessorKey: "job.title",
      header: "Job Title",
    },
    {
      accessorKey: "company.name",
      header: "Company",
    },
    {
      accessorKey: "aiFitScore",
      header: "Match Score",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.aiFitScore}%</span>
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
      cell: ({ row }) => (
        <div>{format(new Date(row.original.createdAt), "MMM dd, yyyy")}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  // navigate(`/jobseeker/jobs/${row.original.job._id}`)
                  navigate(`/jobseeker/applications/${row.original._id}`)
                }
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {/* <p>View Job Post</p> */}
              <p>View Application</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      <DataTable
        columns={columns}
        data={applications || []}
        searchKey="job.title"
        searchPlaceholder="Search by job title..."
      />
    </div>
  );
};

export default Applications;
