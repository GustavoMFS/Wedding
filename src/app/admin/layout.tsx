"use client";

import { ReactNode, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { AdminProtectedPage } from "../components/AdminProtectedPage";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Convidados", path: "/admin/guestlist" },
    { label: "Presentes/Links", path: "/admin/panel" },
    { label: "Gerenciar", path: "/admin/management" },
  ];

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    router.push(path);
  };

  return (
    <AdminProtectedPage>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md p-4 flex justify-between items-center relative">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 cursor-pointer"
          >
            Gustavo ❤️ Maria
          </Link>

          <button
            className="sm:hidden text-gray-800 text-3xl"
            onClick={() => setSidebarOpen(true)}
          >
            <HiMenu />
          </button>

          <nav className="hidden sm:flex gap-4 items-center">
            {menuItems.map(
              (item) =>
                pathname !== item.path && (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className="text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    {item.label}
                  </button>
                )
            )}
            <SignedOut>
              <SignInButton>
                <button className="text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/presentes" />
            </SignedIn>
          </nav>

          <div
            className={`fixed top-0 right-0 h-full w-64 bg-gray-50 shadow-lg transform transition-transform duration-300 z-50 ${
              sidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Admin</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-2xl text-gray-800"
              >
                <HiX />
              </button>
            </div>
            <div className="flex flex-col mt-4 space-y-3 px-4">
              {menuItems.map(
                (item) =>
                  pathname !== item.path && (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className="text-left text-gray-800 font-medium px-2 py-2 rounded hover:bg-gray-200 transition"
                    >
                      {item.label}
                    </button>
                  )
              )}
              <SignedOut>
                <SignInButton>
                  <button className="text-left text-gray-800 font-medium px-2 py-2 rounded hover:bg-gray-200 transition">
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>

          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
        </header>

        <main className="p-6">{children}</main>
      </div>
    </AdminProtectedPage>
  );
}
