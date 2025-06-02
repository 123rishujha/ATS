import { slice } from "../../redux/slice/slice";

const AiSlice = slice.injectEndpoints({
  endpoints: (builder) => ({
    getAiTranscriptToFeedback: builder.mutation({
      query: ({ body, method }) => ({
        url: "api/ai/feedback",
        body: body,
        method: method,
        msz: true,
      }),
    }),
  }),
});

export const { useGetAiTranscriptToFeedbackMutation } = AiSlice;
