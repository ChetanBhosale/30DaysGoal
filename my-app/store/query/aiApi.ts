import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1/" }),
  endpoints: (builder) => ({
    getGoals: builder.query<any, void>({
      query: () => ({
        url: "goal",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetGoalsQuery } = aiApi;
