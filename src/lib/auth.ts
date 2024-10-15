import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma"; // Assurez-vous que le chemin est correct
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
        if (!credentials.email || !credentials.password) {
          console.log("Email ou mot de passe manquant");
          return null;
        }
      
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
      
        if (user && await bcrypt.compare(credentials.password, user.password!)) {
          // console.log("Utilisateur authentifié:", user);
      
          // Vérifier si l'utilisateur a déjà un panier
          let cart = await prisma.cart.findUnique({
            where: { userId: user.id },
          });
      
          // Si le panier n'existe pas, en créer un nouveau
          if (!cart) {
            cart = await prisma.cart.create({
              data: {
                userId: user.id,
                products: { create: [] }, // Crée un panier avec une liste de produits vide
              },
            });
            // console.log("Nouveau panier créé pour l'utilisateur:", cart);
      
            // Mettre à jour l'utilisateur avec l'ID du panier et retourner l'utilisateur mis à jour
            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: { cartId: cart.id }, // Correctement associer cartId à l'utilisateur
              include: { cart: true } // Inclure la relation cart
            });
            // console.log("Utilisateur mis à jour:", updatedUser);
            return updatedUser; // Retourner l'utilisateur mis à jour avec cartId
          }
      
          return user; // Retourner l'utilisateur s'il a déjà un panier
        } else {
          console.log("Échec de l'authentification");
          return null;
        }
      }
      
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.cartId = user.cartId; // On attribue cartId au token si l'utilisateur est présent
        // console.log("JWT token after login:", token); // Ce log devrait s'afficher après authentification
      } else {
        // console.log("User not found, token:", token); // Ajoute un log pour vérifier le cas où il n'y a pas d'utilisateur
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.cartId = token.cartId;
      // console.log("Session data:", session); // Vérifier également le log de session
      return session;
    },
  },
  session: {
    strategy: "jwt", // Utilisation de JWT pour les sessions
  },
});


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
