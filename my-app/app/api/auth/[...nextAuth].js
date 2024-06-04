import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOption = {
  provider: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID | "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET | "",
    }),
  ],
  secret: process.env.SECRET,
};

export default NextAuth(authOption);
