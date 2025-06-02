import { slice } from "../../redux/slice/slice";

const jobseekerSlice = slice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all job posts
    getAllJobPosts: builder.query({
      query: () => {
        console.log("ajldf callled");
        return {
          url: "api/jobposts/",
          method: "GET",
        };
      },
      providesTags: ["recruiter-job-post"],
      transformResponse: (res) => {
        return res.data || [];
      },
    }),
    // Get a single job post by ID
    getJobPostById: builder.query({
      query: (id) => ({
        url: `api/jobposts/${id}`,
        method: "GET",
      }),
      transformResponse: (res) => {
        return res.data;
      },
      providesTags: ["recruiter-job-post"],
    }),
    updateProfile: builder.mutation({
      query: ({ body }) => ({
        url: "api/user/profile",
        body: body,
        method: "PUT",
        msz: true,
      }),
    }),

    getApplicationMatchScore: builder.mutation({
      query: ({ body }) => ({
        url: "api/applications/fit-score",
        method: "POST",
        body: body,
        msz: false,
      }),
    }),

    jobApplicationOper: builder.mutation({
      query: ({ body, url, method, msz }) => ({
        url: `api/applications${url ? url : ""}`,
        body: body,
        method: method,
        msz: msz ?? true,
      }),
      invalidatesTags: ["seeker-job-application"],
    }),
    //Get all job applications
    getAllJobApp: builder.query({
      query: (args) => {
        return {
          url: `api/applications${args ? args : ""}`,
          method: "GET",
        };
      },
      providesTags: ["seeker-job-application"],
      transformResponse: (res) => {
        return res.data || [];
      },
    }),
    //Get all job applications
    getApplicationById: builder.query({
      query: (id) => {
        return {
          url: `api/applications/${id}`,
          method: "GET",
        };
      },
      providesTags: ["seeker-job-application"],
    }),
    getJobSeekerDashboard: builder.query({
      query: () => ({
        url: `api/dashboard/recruiter`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllJobPostsQuery,
  useGetJobPostByIdQuery,
  useUpdateProfileMutation,
  useGetApplicationMatchScoreMutation,
  useJobApplicationOperMutation,
  useGetAllJobAppQuery,
  useGetApplicationByIdQuery,
  useGetJobSeekerDashboardQuery,
} = jobseekerSlice;
