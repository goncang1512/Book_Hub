import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import connectMongoDB from "@/lib/config/connectMongoDb";
import UserModels from "@/lib/models/users";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectMongoDB();

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await UserModels.findOne({ email: email });

        if (!user) {
          throw new Error("User tidak ditemukan");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          throw new Error("Password kamu salah");
        }

        const data: any = {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          number: user.number,
          imgProfil: user.imgProfil,
          alamat: user.alamat,
          rank: user.rank,
          badge: user.badge,
        };

        return data;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, trigger, user, session }: any) {
      if (trigger === "update" && session.status === "updateFotoProfil") {
        token.imgProfil = session.imgProfil;
      }

      if (trigger === "update" && session.status === "updateRank") {
        token.rank = session.rank;
      }

      if (trigger === "update" && session.status === "UpdateProfil") {
        token.badge = session.badge;
        token.rank = session.rank;
        token.role = session.role;
      }

      if (trigger === "update" && session.status === "updateData") {
        token.username = session.username;
        token.alamat = session.alamat;
        token.email = session.email;
        token.number = session.number;
      }

      if (trigger === "update" && session.status === "newEmail") {
        token.email = session.email;
      }

      if (account?.provider === "credentials") {
        token._id = user._id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.number = user.number;
        token.imgProfil = user.imgProfil;
        token.alamat = user.alamat;
        token.rank = user.rank;
        token.badge = user.badge;
      }
      return token;
    },

    async session({ session, token }: any) {
      session.user = token;

      const accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || "", {
        algorithm: "HS256",
      });

      session.accessToken = accessToken;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
