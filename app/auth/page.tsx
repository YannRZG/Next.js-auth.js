// AuthPage.tsx
"use client";
import { useState } from "react";
import LoginButton from '../components/LoginButton';
import SignupForm from '../components/SignupForm';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl mb-4">{activeTab === "signin" ? "Connexion" : "Inscription"}</h1>
            <div className="flex mb-4">
                <button
                    onClick={() => setActiveTab("signin")}
                    className={`px-4 py-2 ${activeTab === "signin" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Connexion
                </button>
                <button
                    onClick={() => setActiveTab("signup")}
                    className={`px-4 py-2 ${activeTab === "signup" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Inscription
                </button>
            </div>
            {activeTab === "signin" ? <LoginButton /> : <SignupForm />}
        </div>
    );
};

export default AuthPage;
