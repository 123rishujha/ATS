import { slice } from "../../redux/slice/slice";

const authSlice = slice.injectEndpoints({
  endpoints: (builder) => ({
    authUserLogin: builder.mutation({
      query: ({ body, method, msz }) => ({
        url: "api/user/login",
        body: body,
        method: method,
        msz: true,
      }),
    }),
    authUserSignup: builder.mutation({
      query: ({ body, msz }) => ({
        url: "api/user/register",
        body: body,
        method: "POST",
        msz: true,
      }),
    }),
    authUserLogout: builder.mutation({
      query: ({ body, method, msz }) => ({
        url: "api/user/logout",
        body: body,
        method: method,
        msz: true,
      }),
    }),
    authEmailVerification: builder.mutation({
      query: ({ token }) => ({
        url: `api/user/verify-email?token=${token}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAuthUserLoginMutation,
  useAuthUserSignupMutation,
  useLazyGetRefreshTokenQuery,
  useAuthUserLogoutMutation,
  useAuthEmailVerificationMutation,
} = authSlice;
