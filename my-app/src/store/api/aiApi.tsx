import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://13.54.129.243:8000/api/v1/" }),
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
    }),
    getQuestionChat: builder.query<any, any>({
      query: (url) => ({
        url: `goal/chat-questions/${url}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["MyGoals"],
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
    sendMessage: builder.mutation<any, any>({
      query: (data) => ({
        url: `goal-plan/chat/${data.url}`,
        method: "POST",
        body: data,
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
  useSendMessageMutation,
} = aiApi;
