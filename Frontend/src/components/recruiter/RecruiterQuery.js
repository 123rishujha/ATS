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
    // Get all job posts
    // getAllJobPosts: builder.query({
    //   query: () => ({
    //     url: "api/jobposts/",
    //     method: "GET",
    //   }),
    //   providesTags: ["recruiter-job-post"],
    // }),
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
  }),
});

export const {
  // useGetAllJobPostsQuery,
  useGetRecruiterJobPostsQuery,
  useGetJobPostByIdQuery,
  useJobPostOperMutation,
  useUpdateProfileMutation,
} = recruiterJobPostSlice;
