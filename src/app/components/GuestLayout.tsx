"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function GuestLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <>
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1
          onClick={() => router.push("/")}
          className="text-xl font-bold text-pink-600 cursor-pointer"
        >
          Gustavo ❤️ Maria
        </h1>

        <div className="flex items-center gap-4">
          {pathname !== "/home" && (
            <button
              onClick={() => router.push("/home")}
              className="text-pink-500 font-semibold hover:underline"
            >
              Home
            </button>
          )}
          {pathname !== "/presentes" && (
            <button
              onClick={() => router.push("/presentes")}
              className="text-pink-500 font-semibold hover:underline"
            >
              Presentes
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => router.push("/admin")}
              className="text-pink-500 font-semibold hover:underline"
            >
              Admin
            </button>
          )}

          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/login/sign-in">
              <button className="text-pink-500 font-semibold hover:underline">
                Login dos Noivos
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/home" />
          </SignedIn>
        </div>
      </header>

      <main className="bg-pink-50">{children}</main>
    </>
  );
}
