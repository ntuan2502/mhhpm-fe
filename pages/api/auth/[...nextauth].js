import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/${account.provider}/callback?id_token=${account?.id_token}&access_token=${account?.access_token}`
        );
        const data = await res.json();
        token.jwt = data.jwt;
        token.access_token = account.access_token;
        token.user = data.user;
      }
      // console.log("token: ", token);
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.jwt = token.jwt;
      session.access_token = token.access_token;
      session._user = token.user;
      // console.log("session: ", session);
      return session;
    },
  },
});
