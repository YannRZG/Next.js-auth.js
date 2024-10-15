// SignupForm.tsx
"use client";
import { useState } from "react";
import { createUser } from '@/src/lib/auth';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Vérification que les mots de passe correspondent
        if (password !== passwordConfirmation) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await createUser(email, password);
            alert("Utilisateur créé avec succès !");
        } catch (err) {
            if (err instanceof Error) {
                setError(`Erreur lors de la création de l'utilisateur: ${err.message}`);
            } else {
                setError(`Erreur lors de la création de l'utilisateur: ${String(err)}`);
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleSignup} className="flex flex-col gap-2">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border rounded px-2 py-1"
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border rounded px-2 py-1"
                />
                <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    className="border rounded px-2 py-1"
                />
                {error && <span className="text-red-500">{error}</span>}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    S'inscrire
                </button>
            </form>
        </div>
    );
};

export default SignupForm;
