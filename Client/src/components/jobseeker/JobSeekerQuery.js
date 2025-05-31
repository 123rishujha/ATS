import { slice } from "../../redux/slice/slice";

const jobseekerSlice = slice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all job posts
    getAllJobPosts: builder.query({
      query: () => ({
        url: "api/jobposts/",
        method: "GET",
      }),
      providesTags: ["recruiter-job-post"],
      transformResponse: (res) => {
        console.log("ajld res", res);
        return res.data || [];
      },
    }),
    // Get a single job post by ID
    getJobPostById: builder.query({
      query: (id) => ({
        url: `api/jobposts/${id}`,
        method: "GET",
      }),
      providesTags: ["recruiter-job-post"],
    }),
  }),
});

export const { useGetAllJobPostsQuery, useGetJobPostByIdQuery } =
  jobseekerSlice;
