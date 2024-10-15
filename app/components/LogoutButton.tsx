"use client"
import { signOut } from "next-auth/react"
import { CiLogout } from "react-icons/ci";
export const LogoutButton = () => {
    return (
        <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-700 text-white font-extrabold py-2 px-4 rounded">
           <CiLogout />
        </button>
    )
};