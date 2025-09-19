"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { HiMenu, HiX } from "react-icons/hi";

export default function GuestLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.publicMetadata?.role === "admin";

  const menuItems = [
    { label: "Home", path: "/home" },
    { label: "Presentes", path: "/presentes" },
    { label: "Confirmar Presença", path: "/guest" },
    ...(isAdmin ? [{ label: "Admin", path: "/admin" }] : []),
  ];

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    router.push(path);
  };

  return (
    <>
      <header className="bg-white shadow-md p-4 flex justify-between items-center relative">
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-gray-800 cursor-pointer"
        >
          Gustavo ❤️ Maria
        </h1>
        <button
          className="sm:hidden text-gray-800 text-3xl"
          onClick={() => setSidebarOpen(true)}
        >
          <HiMenu />
        </button>

        <nav className="hidden sm:flex gap-4">
          {menuItems.map(
            (item) =>
              pathname !== item.path && (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className=" text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  {item.label}
                </button>
              )
          )}
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/login/sign-in">
              <button className=" text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                Login dos Noivos
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/home" />
          </SignedIn>
        </nav>

        <div
          className={`fixed top-0 right-0 h-full w-64 bg-gray-50 shadow-lg transform transition-transform duration-300 z-50 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
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
              <SignInButton mode="modal" forceRedirectUrl="/login/sign-in">
                <button className="text-left text-gray-800 font-medium px-2 py-2 rounded hover:bg-gray-200 transition">
                  Login dos Noivos
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

      <main className="bg-gray-50 min-h-[calc(100vh-4rem)]">{children}</main>
    </>
  );
}
