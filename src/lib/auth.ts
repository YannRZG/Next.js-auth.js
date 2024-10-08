import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";


export const { auth, handlers } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
      GithubProvider,
      GoogleProvider,
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "email@example.com" },
          password: { label: "Mot de passe", type: "password" },
        },
        async authorize(credentials) {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
  
          if (user && await bcrypt.compare(credentials.password as string, user.password)) {
            console.log("Utilisateur authentifié:", user);
            return user;
          } else {
            console.log("Échec de l'authentification");
            return null;
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        session.user.id = token.id;
        return session;
      },
    },
    session: {
      strategy: "jwt", // Utilisation de JWT pour les sessions
    },
  });
// console.log('NextAuth initialisé avec l\'adaptateur Prisma.');


// Fonction pour créer un nouvel utilisateur
export const createUser = async (email: string, password: string) => {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json(); // Obtenez les données d'erreur pour plus de détails
        throw new Error(errorData.error || 'Erreur lors de la création de l’utilisateur');
    }

    const user = await response.json();
    return user;
};