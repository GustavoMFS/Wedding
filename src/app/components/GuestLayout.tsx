"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { HiMenu, HiX } from "react-icons/hi";
import { useLanguage } from "../contexts/LanguageContext";

export default function GuestLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { language, setLanguage, getMessages } = useLanguage();
  const messages = getMessages("menu"); // 👈 pegamos as traduções do menu

  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    if (language) {
      const current = localStorage.getItem("language");
      if (current !== language) {
        localStorage.setItem("language", language);
      }
    }
  }, [language]);

  const menuItems = [
    { label: messages.home, path: "/home" },
    { label: messages.gifts, path: "/presentes" },
    { label: messages.confirmPresence, path: "/guest" },
    ...(isAdmin ? [{ label: messages.admin, path: "/admin" }] : []),
  ];

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    router.push(path);
  };

  return (
    <>
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-gray-800 cursor-pointer hover:opacity-80 transition"
        >
          Gustavo ❤️ Maria
        </h1>

        <nav className="hidden sm:flex items-center gap-6">
          {menuItems.map(
            (item) =>
              pathname !== item.path && (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className="text-gray-700 font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition"
                >
                  {item.label}
                </button>
              )
          )}

          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/login/sign-in">
              <button className="text-gray-700 font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition">
                {messages.login}
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/home" />
          </SignedIn>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            <button
              onClick={() => setLanguage("pt")}
              className={`px-3 py-1 text-sm rounded-md transition ${
                language === "pt"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              PT
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`px-3 py-1 text-sm rounded-md transition ${
                language === "es"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ES
            </button>
          </div>
        </nav>

        <button
          className="sm:hidden text-gray-800 text-3xl"
          onClick={() => setSidebarOpen(true)}
        >
          <HiMenu />
        </button>
      </header>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {messages.menuTitle}
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl text-gray-800"
          >
            <HiX />
          </button>
        </div>

        <div className="flex justify-center gap-3 py-4 border-b border-gray-200">
          <button
            onClick={() => setLanguage("pt")}
            className={`px-4 py-1 rounded-md text-sm ${
              language === "pt"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            PT
          </button>
          <button
            onClick={() => setLanguage("es")}
            className={`px-4 py-1 rounded-md text-sm ${
              language === "es"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ES
          </button>
        </div>

        <div className="flex flex-col mt-4 space-y-3 px-4">
          {menuItems.map(
            (item) =>
              pathname !== item.path && (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className="text-left text-gray-800 font-medium px-2 py-2 rounded hover:bg-gray-100 transition"
                >
                  {item.label}
                </button>
              )
          )}

          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/login/sign-in">
              <button className="text-left text-gray-800 font-medium px-2 py-2 rounded hover:bg-gray-100 transition">
                {messages.login}
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

      <main className="bg-gray-50 min-h-[calc(100vh-4rem)]">{children}</main>
    </>
  );
}
