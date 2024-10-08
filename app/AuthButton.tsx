"use client"
import { signIn, signOut } from "next-auth/react"
import { useState } from "react"

export const LoginButton = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleCredentialsLogin = async (e) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: true,
            email,
            password,
        });

        if (result?.error) {
            setError(result.error);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleCredentialsLogin} className="flex flex-col gap-2">
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
                {error && <span className="text-red-500">{error}</span>}
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Se connecter avec des identifiants
                </button>
            </form>
            <button
                onClick={() => signIn('github')}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Se connecter avec GitHub
            </button>
            <button
                onClick={() => signIn('google')}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Se connecter avec Google
            </button>
        </div>
    );
};


export const LogoutButton = () => {
    return (
        <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Sign Out
        </button>
    )
};