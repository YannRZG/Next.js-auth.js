import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

// Fonction pour gérer les requêtes POST
export async function POST(req: Request) {
    const { email, password } = await req.json();

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return NextResponse.json({ error: "Un utilisateur avec cet email existe déjà." }, { status: 409 });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur." }, { status: 500 });
    }
}
