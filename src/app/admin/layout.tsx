// app/admin/layout.tsx
import { ReactNode } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { AdminProtectedPage } from "../components/AdminProtectedPage";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProtectedPage>
      <div className="min-h-screen bg-gray-50">
        <header className="flex flex-wrap justify-between items-center p-4 bg-white border-b">
          <Link
            href="/"
            className="text-base md:text-xl font-bold text-pink-600 hover:underline"
          >
            Gustavo ❤️ Maria
          </Link>

          <div className="flex flex-wrap gap-2 md:gap-4 items-center text-xs md:text-sm">
            <Link
              href="/admin"
              className="text-pink-500 font-semibold hover:underline"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/guestlist"
              className="text-pink-500 font-semibold hover:underline"
            >
              Convidados
            </Link>
            <Link
              href="/admin/panel"
              className="text-pink-500 font-semibold hover:underline"
            >
              Painel
            </Link>
            <Link
              href="/admin/management"
              className="text-pink-500 font-semibold hover:underline"
            >
              Gerenciar
            </Link>

            <SignedOut>
              <SignInButton>
                <button className="text-purple-700 underline">Login</button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/presentes" />
            </SignedIn>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </AdminProtectedPage>
  );
}
