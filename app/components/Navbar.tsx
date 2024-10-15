import { auth } from "@/src/lib/auth";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";
import Image from "next/image";
import { IoCart } from "react-icons/io5";

interface NavbarProps {
  onCartOpen: () => void;
}

export default async function Navbar({ onCartOpen }: NavbarProps) {
  const session = await auth();

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-gray-800 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/YR.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <Link href="/" className="text-xl font-semibold">
          MyNextApp
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="hover:bg-slate-200 hover:text-gray-800 hover:scale-125 rounded-md px-2"
        >
          Home
        </Link>
        <Link
          href="/product"
          className="hover:bg-slate-200 hover:text-gray-800 hover:scale-125 rounded-md px-2"
        >
          Product
        </Link>
        <Link
          href="/about"
          className="hover:bg-slate-200 hover:text-gray-800 hover:scale-125 rounded-md px-2"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="hover:bg-slate-200 hover:text-gray-800 hover:scale-125 rounded-md px-2"
        >
          Contact
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCartOpen}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <IoCart />
        </button>
        {session?.user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="text-xs rounded-md px-2 hover:bg-slate-200 hover:text-gray-800"
            >
              {session.user.email}
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <Link
            href="/auth"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
