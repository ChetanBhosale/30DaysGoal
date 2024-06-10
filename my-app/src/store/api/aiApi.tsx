import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { goals } from "../slice/aiSlice";

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1/" }),
  tagTypes: ["MyGoals"],
  endpoints: (builder) => ({
    setGoal: builder.mutation<any, any>({
      query: (data) => ({
        url: "goal",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["MyGoals"],
    }),
    getGoals: builder.query<any, any>({
      query: () => ({
        url: "goal",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["MyGoals"],
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const data = await queryFulfilled;
          dispatch(goals(data.data));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    getQuestionChat: builder.query<any, any>({
      query: (url) => ({
        url: `goal/chat-questions/${url}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    submitAnswers: builder.mutation<any, any>({
      query: (data) => ({
        url: `goal/chat-questions/${data.url}`,
        method: "POST",
        body: data.body,
        credentials: "include" as const,
      }),
    }),
    getDays: builder.query<any, any>({
      query: (data) => ({
        url: `goal-plan/${data.url}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useSetGoalMutation,
  useGetGoalsQuery,
  useGetQuestionChatQuery,
  useSubmitAnswersMutation,
  useGetDaysQuery,
} = aiApi;
