import { auth } from "@/src/lib/auth";
import { LogoutButton } from "../AuthButton";
import Link from "next/link";
import Image from "next/image";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-gray-800 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/favicon.ico"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <Link href="/" className="text-xl font-semibold">
          MyApp
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        {session?.user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">{session.user.email}</span>
            <LogoutButton />
          </div>
        ) : (
            <Link
            href="/auth/signin"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </Link>
          
        )}
      </div>
    </nav>
  );
}
