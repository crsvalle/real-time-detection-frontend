"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-black text-white">
      <div className="text-xl font-bold">CarVision</div>

      <div className="flex gap-6">
        <Link href="/" className="hover:text-gray-300 transition">
          Home
        </Link>
        <Link href="/about" className="hover:text-gray-300 transition">
          About
        </Link>
      </div>
    </nav>
  );
}
