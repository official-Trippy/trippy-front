import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID ?? "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID ?? "",
      clientSecret: process.env.NAVER_CLIENT_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_ID ?? "",
      clientSecret: process.env.GOOGLE_OAUTH_SECRET ?? "",
    }), // ...add more providers here
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // async jwt({ token, user }) {
    //   return { ...token, ...user };
    // },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});
// Configure one or more authentication providers

export { handler as GET, handler as POST };
