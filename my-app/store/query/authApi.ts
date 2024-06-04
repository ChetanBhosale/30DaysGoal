import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setToken } from "../storage/authSlice";

interface IRegister {
  email: string;
  password: string;
}

interface ICode {
  code: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1/" }),
  endpoints: (builder) => ({
    register: builder.mutation<any, IRegister>({
      query: (signupData) => ({
        url: "register",
        method: "POST",
        body: signupData,
        credentials: "include" as const,
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(setToken(result.data.token));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    activeUser: builder.mutation<any, string>({
      query: (code) => ({
        url: "active-user",
        method: "POST",
        body: code,
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useRegisterMutation } = authApi;
