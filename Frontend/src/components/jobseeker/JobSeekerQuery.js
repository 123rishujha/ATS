import { slice } from "../../redux/slice/slice";

const jobseekerSlice = slice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all job posts
    getAllJobPosts: builder.query({
      query: () => {
        console.log("ajldf callled")
        return {
          url: "api/jobposts/",
          method: "GET",
        }
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
  }),
});

export const { useGetAllJobPostsQuery, useGetJobPostByIdQuery, useUpdateProfileMutation } =
  jobseekerSlice;
