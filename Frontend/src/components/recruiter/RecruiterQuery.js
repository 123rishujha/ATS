import { slice } from "../../redux/slice/slice";

const recruiterJobPostSlice = slice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new job post
    JobPostOper: builder.mutation({
      query: ({ body, args, method }) => ({
        url: `api/jobposts${args ? args : ""}`,
        method: method,
        body,
      }),
      invalidatesTags: ["recruiter-job-post"],
    }),

    // Get job posts for the logged-in recruiter
    getRecruiterJobPosts: builder.query({
      query: () => ({
        url: "api/jobposts/recruiter-job-posts",
        method: "GET",
      }),
      providesTags: ["recruiter-job-post"],
    }),
    // Get a single job post by ID
    getJobPostById: builder.query({
      query: (id) => ({
        url: `api/jobposts/${id}`,
        method: "GET",
      }),
      providesTags: ["recruiter-job-post"],
    }),
    // Update recruiter profile
    updateProfile: builder.mutation({
      query: ({ body }) => ({
        url: "api/user/profile",
        body: body,
        method: "PUT",
        msz: true,
      }),
    }),
    // Get applications by jobId
    getApplicationsByJobId: builder.mutation({
      query: (body) => ({
        url: "api/applications/by-job",
        method: "POST",
        body,
      }),
    }),

    getUserById: builder.query({
      query: (candidateId) => ({
        url: `api/user/profile/${candidateId}`,
        method: "GET",
      }),
    }),

    // Get single application by jobId and candidateId
    getRecruiterApplicationByJobAndCandidate: builder.query({
      query: ({ jobId, candidateId }) => ({
        url: `api/applications/job/${jobId}/candidate/${candidateId}`,
        method: "GET",
      }),
    }),

    getRecruiterDashboard: builder.query({
      query: () => ({
        url: `api/dashboard/recruiter`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  // useGetAllJobPostsQuery,
  useGetRecruiterJobPostsQuery,
  useGetJobPostByIdQuery,
  useJobPostOperMutation,
  useUpdateProfileMutation,
  useGetApplicationsByJobIdMutation,
  useGetUserByIdQuery,
  useGetRecruiterApplicationByJobAndCandidateQuery,
  useGetRecruiterDashboardQuery,
} = recruiterJobPostSlice;
