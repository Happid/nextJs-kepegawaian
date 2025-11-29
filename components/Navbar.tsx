"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl text-primary font-semibold">
          Mini Project Kepegawaian
        </a>
      </div>

      {/* Hamburger for mobile */}
      <div className="flex-none lg:hidden">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="btn btn-square btn-ghost"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Menu desktop */}
      <div className="hidden lg:flex flex-none">
        <ul className="menu menu-horizontal px-1">
          <li className={pathname.includes("admin") ? "bg-gray-200" : ""}>
            <Link href="/admin">Admin</Link>
          </li>
          <li className={pathname.includes("pegawai") ? "bg-gray-200" : ""}>
            <Link href="/pegawai">Kepegawaian</Link>
          </li>
          <li className={pathname.includes("profile") ? "bg-gray-200" : ""}>
            <Link href="/profile">Profile</Link>
          </li>
          <li onClick={handleLogout}>
            <Link href="/login">Logout</Link>
          </li>
        </ul>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 w-48 bg-base-100 shadow-lg rounded-b-lg z-50 lg:hidden">
          <ul className="menu p-2">
            <li
              onClick={() => setIsMenuOpen(false)}
              className={pathname.includes("admin") ? "bg-gray-200" : ""}
            >
              <Link href="/admin">Admin</Link>
            </li>
            <li
              onClick={() => setIsMenuOpen(false)}
              className={pathname.includes("pegawai") ? "bg-gray-200" : ""}
            >
              <Link href="/pegawai">Kepegawaian</Link>
            </li>
            <li
              onClick={() => setIsMenuOpen(false)}
              className={pathname.includes("profile") ? "bg-gray-200" : ""}
            >
              <Link href="/profile">Profile</Link>
            </li>
            <li
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
            >
              <Link href="/login">Logout</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
