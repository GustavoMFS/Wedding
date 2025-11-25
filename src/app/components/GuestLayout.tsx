"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useLanguage } from "../contexts/LanguageContext";
import "../fonts.css";
import AdminAccess from "../components/AdminAcess";

export default function GuestLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { language, setLanguage, getMessages } = useLanguage();
  const messages = getMessages("menu");

  const menuItems = [
    { label: messages.home, path: "/home" },
    { label: messages.gifts, path: "/presentes" },
    { label: messages.confirmPresence, path: "/guest" },
  ];

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    router.push(path);
  };

  useEffect(() => {
    if (language) {
      const current = localStorage.getItem("language");
      if (current !== language) {
        localStorage.setItem("language", language);
      }
    }
  }, [language]);

  return (
    <>
      <header className="bg-[#ffffff] shadow-md px-6 py-4 flex justify-between items-center border-b border-[#dbe6f0]">
        <h1
          onClick={() => router.push("/")}
          style={{ fontFamily: "handwriting", letterSpacing: "0.5em" }}
          className="text-3xl font-bold text-[#385e85] cursor-pointer"
        >
          G M
        </h1>

        <nav className="hidden sm:flex items-center gap-6">
          {menuItems.map(
            (item) =>
              pathname !== item.path && (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className="text-[#385e85] font-medium font-[cinzel] px-3 py-2 rounded-md hover:bg-[#e8f0f8] transition"
                >
                  {item.label}
                </button>
              )
          )}

          <AdminAccess
            messages={{ admin: messages.admin, login: messages.login }}
          />

          <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            <button
              onClick={() => setLanguage("pt")}
              className={`px-3 py-1 text-sm rounded-md transition ${
                language === "pt"
                  ? "bg-[#385e85] text-white"
                  : "bg-[#f2f6fa] text-[#385e85] hover:bg-[#e8f0f8]"
              }`}
            >
              PT
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`px-3 py-1 text-sm rounded-md transition ${
                language === "es"
                  ? "bg-[#385e85] text-white"
                  : "bg-[#f2f6fa] text-[#385e85] hover:bg-[#e8f0f8]"
              }`}
            >
              ES
            </button>
          </div>
        </nav>

        <button
          className="sm:hidden text-[#385e85] text-3xl"
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
          <h2 className="text-xl font-bold text-[#385e85]">
            {messages.menuTitle}
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl text-[#385e85]"
          >
            <HiX />
          </button>
        </div>

        <div className="flex justify-center gap-3 py-4 border-b border-gray-200">
          <button
            onClick={() => setLanguage("pt")}
            className={`px-4 py-1 rounded-md text-sm ${
              language === "pt"
                ? "bg-[#385e85] text-white"
                : "bg-[#f2f6fa] text-[#385e85] hover:bg-[#e8f0f8]"
            }`}
          >
            PT
          </button>
          <button
            onClick={() => setLanguage("es")}
            className={`px-4 py-1 rounded-md text-sm ${
              language === "es"
                ? "bg-[#385e85] text-white"
                : "bg-[#f2f6fa] text-[#385e85] hover:bg-[#e8f0f8]"
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
                  className="text-left text-[#385e85] font-medium font-[cinzel] px-2 py-2 rounded hover:bg-gray-100 transition"
                >
                  {item.label}
                </button>
              )
          )}

          <AdminAccess
            messages={{ admin: messages.admin, login: messages.login }}
          />
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="bg-gray-50 min-h-[calc(100vh-4rem)]">{children}</main>
    </>
  );
}
