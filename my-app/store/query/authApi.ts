import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  userLoggedIn,
  userLoggedOut,
  userRegistration,
} from "../storage/authSlice";
import { z } from "zod";
import { SignupForm } from "@/@types/auth";
type ISignup = z.infer<typeof SignupForm>;

type IRegisterAndLogin = Pick<ISignup, "email" | "password">;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1/" }),
  endpoints: (builder) => ({
    register: builder.mutation<any, IRegisterAndLogin>({
      query: (signupData) => ({
        url: "register",
        method: "POST",
        body: signupData,
        credentials: "include" as const,
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userRegistration(result.data.token));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    activeUser: builder.mutation<any, { code: string }>({
      query: (code) => ({
        url: "active-user",
        method: "POST",
        body: code,
        credentials: "include" as const,
      }),
    }),
    loginUser: builder.mutation<any, IRegisterAndLogin>({
      query: (loginData) => ({
        url: "login",
        method: "POST",
        body: loginData,
        credentials: "include" as const,
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn(result.data));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log(result.data.user);
          dispatch(userLoggedIn(result.data.user));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    logoutUser: builder.mutation({
      query: (data) => ({
        url: "logout",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActiveUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useLogoutUserMutation,
} = authApi;
