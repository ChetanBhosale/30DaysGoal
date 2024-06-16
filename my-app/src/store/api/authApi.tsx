import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut, userRegister } from "../slice/authSlice";

interface ICredentials {
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://three0daysgoal.onrender.com/api/v1/",
  }),
  endpoints: (builder) => ({
    register: builder.mutation<any, any>({
      query: (data) => ({
        url: "register",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userRegister(result.data.token));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    activeUser: builder.mutation<any, { code: string }>({
      query: (data) => ({
        url: "active-user",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userRegister(null));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    loginUser: builder.mutation<any, ICredentials>({
      query: (data) => ({
        url: "login",
        method: "POST",
        credentials: "include" as const,
        body: data,
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const result: any = await queryFulfilled;
          dispatch(userLoggedIn(result.data.user));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const result: any = await queryFulfilled;
          dispatch(userLoggedIn(result.data.user));
        } catch (error: any) {}
      },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
        credentials: "include",
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
  useLoginUserMutation,
  useActiveUserMutation,
  useLoadUserQuery,
  useLogoutUserMutation,
} = authApi;
