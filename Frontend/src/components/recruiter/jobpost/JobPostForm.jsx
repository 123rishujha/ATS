import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import RichTextEditor from "@/components/common/RichTextEditor";
import { toast } from "sonner";
import {
  useGetJobPostByIdQuery,
  useJobPostOperMutation,
} from "../RecruiterQuery";
import { Checkbox } from "@/components/ui/checkbox";
// import SlateEditor from "@/components/common/SlateEditor/Editor";

const jobPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.any().refine((val) => val && val.length > 0, {
    message: "Description is required",
  }),
  location: z.string().min(1, "Location is required"),
  jobType: z.enum(["full-time", "part-time", "contract", "remote", "hybrid"]),
  salaryRange: z
    .object({
      min: z.number().min(0, "Minimum salary must be positive"),
      max: z.number().min(0, "Maximum salary must be positive"),
    })
    .refine((data) => data.max >= data.min, {
      message: "Maximum salary must be greater than or equal to minimum salary",
    }),
  requiredSkills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "At least one skill is required"),
  experienceRequired: z
    .object({
      min: z.number().min(0, "Minimum experience must be positive"),
      max: z.number().min(0, "Maximum experience must be positive"),
    })
    .refine((data) => data.max >= data.min, {
      message:
        "Maximum experience must be greater than or equal to minimum experience",
    }),
  isPublished: z.boolean().default(true),
});

// Initial value for the rich text editor
const initialEditorValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const JobPostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL for editing
  const isEdit = !!id; // Check if it's an edit operation

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  // Fetch data for editing
  const { data: jobPostData, isLoading: isFetchingJobPost } =
    useGetJobPostByIdQuery(id, {
      skip: !isEdit,
    });

  console.log("aklf jobPostData", jobPostData);

  const [jobPostOperation] = useJobPostOperMutation();

  const form = useForm({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: jobPostData?.title || "",
      description: jobPostData?.description || initialEditorValue,
      location: jobPostData?.location || "",
      jobType: jobPostData?.jobType || "full-time",
      salaryRange: {
        min: jobPostData?.salaryRange?.min || 0,
        max: jobPostData?.salaryRange?.max || 0,
      },
      requiredSkills: jobPostData?.requiredSkills || [],
      experienceRequired: {
        min: jobPostData?.experienceRequired?.min || 0,
        max: jobPostData?.experienceRequired?.max || 0,
      },
      isPublished: jobPostData?.isPublished ?? true,
    },
  });

  // Reset form with fetched data when in edit mode and data is available
  useEffect(() => {
    if (isEdit && jobPostData) {
      form.reset({
        title: jobPostData.title,
        description: jobPostData.description,
        location: jobPostData.location,
        jobType: jobPostData.jobType,
        salaryRange: {
          min: jobPostData.salaryRange?.min || 0,
          max: jobPostData.salaryRange?.max || 0,
        },
        requiredSkills: jobPostData.requiredSkills,
        experienceRequired: {
          min: jobPostData.experienceRequired?.min || 0,
          max: jobPostData.experienceRequired?.max || 0,
        },
        isPublished: jobPostData.isPublished,
      });
    }
  }, [isEdit, jobPostData, form]);

  const onSubmit = async (data) => {
    // Added console log for form errors
    try {
      setIsSubmitting(true);
      if (isEdit) {
        await jobPostOperation({
          args: `/${id}`,
          method: "PUT",
          body: data,
        }).unwrap();
        toast.success("Job post updated successfully");
      } else {
        await jobPostOperation({ method: "POST", body: data }).unwrap();
        toast.success("Job post created successfully");
      }
      navigate("/recruiter/jobpost");
    } catch (error) {
      toast.error(error?.data?.msg || "Failed to save job post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillInput = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const currentSkills = form.getValues("requiredSkills");
      if (!currentSkills.includes(skillInput.trim())) {
        form.setValue("requiredSkills", [...currentSkills, skillInput.trim()]);
        form.clearErrors("requiredSkills");
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    const currentSkills = form.getValues("requiredSkills");
    const newSkills = currentSkills.filter((skill) => skill !== skillToRemove);
    form.setValue("requiredSkills", newSkills);
    // Manually trigger validation for skills array after removal
    form.trigger("requiredSkills");
  };

  if (isEdit && isFetchingJobPost) {
    return <div>Loading job post...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Job Post" : "Create Job Post"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Edit the job post details"
            : "Fill in the details to create a new job posting"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter job title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      key={jobPostData}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write detailed job description..."
                    />
                  </FormControl>
                  <FormDescription>
                    Use the toolbar above to format your job description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
              <div className="space-y-4 w-full">
                <FormLabel>Salary Range(Anually)</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salaryRange.min"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min Salary"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className={
                              form.formState.errors.salaryRange?.min
                                ? "border-destructive"
                                : ""
                            }
                          />
                        </FormControl>
                        {form.formState.errors.salaryRange?.min?.message && (
                          <FormMessage>
                            {form.formState.errors.salaryRange?.min?.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salaryRange.max"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max Salary"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className={
                              form.formState.errors.salaryRange?.max
                                ? "border-destructive"
                                : ""
                            }
                          />
                        </FormControl>
                        {form.formState.errors.salaryRange?.max?.message && (
                          <FormMessage>
                            {form.formState.errors.salaryRange?.max?.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
                {/* FormMessage for salaryRange object-level validation */}
                {form.formState.errors.salaryRange?.message && (
                  <FormMessage className="mt-2">
                    {form.formState.errors.salaryRange.message}
                  </FormMessage>
                )}
              </div>

              <div className={`space-y-4 w-full`}>
                <FormLabel>Experience Required (Years)</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="experienceRequired.min"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min Experience"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className={
                              form.formState.errors.experienceRequired?.min
                                ? "border-destructive"
                                : ""
                            }
                          />
                        </FormControl>
                        {form.formState.errors.experienceRequired?.min
                          ?.message && (
                          <FormMessage>
                            {
                              form.formState.errors.experienceRequired?.min
                                ?.message
                            }
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experienceRequired.max"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max Experience"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className={
                              form.formState.errors.experienceRequired?.max
                                ? "border-destructive"
                                : ""
                            }
                          />
                        </FormControl>
                        {form.formState.errors.experienceRequired?.max
                          ?.message && (
                          <FormMessage>
                            {
                              form.formState.errors.experienceRequired?.max
                                ?.message
                            }
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
                {/* FormMessage for experienceRequired object-level validation */}
                {form.formState.errors.experienceRequired?.message && (
                  <FormMessage className="mt-2">
                    {form.formState.errors.experienceRequired.message}
                  </FormMessage>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="requiredSkills"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Required Skills</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        placeholder="Type a skill and press Enter"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillInput}
                        className={
                          form.formState.errors.requiredSkills
                            ? "border-destructive"
                            : ""
                        }
                      />
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:bg-accent rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Press Enter to add a skill. Click the X to remove a skill.
                  </FormDescription>
                  {/* FormMessage for requiredSkills array validation */}
                  {form.formState.errors.requiredSkills?._errors?.length >
                    0 && (
                    <FormMessage>
                      {form.formState.errors.requiredSkills?._errors[0]}
                    </FormMessage>
                  )}
                  {/* Fallback for other potential array errors */}
                  {form.formState.errors.requiredSkills?.message && (
                    <FormMessage>
                      {form.formState.errors.requiredSkills.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mb-0">Published</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/recruiter/jobpost")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isFetchingJobPost}
              >
                {isSubmitting
                  ? isEdit
                    ? "Saving..."
                    : "Creating..."
                  : isEdit
                  ? "Save Job Post"
                  : "Create Job Post"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JobPostForm;
