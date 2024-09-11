import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

// @ts-ignore: Unsafe assignment of an `any` value
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
