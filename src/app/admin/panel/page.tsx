"use client";

import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  //   SignOutButton,
} from "@clerk/nextjs";

export default function AdminPanel() {
  return (
    <main className="max-w-4xl mx-auto p-4 space-y-8">
      <header className="flex justify-end mb-4">
        <SignedOut>
          <SignInButton>
            <button className="text-sm text-purple-700 underline hover:text-purple-900">
              Login
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/presentes" />
          {/* <SignOutButton redirectUrl="/presentes"></SignOutButton> */}
        </SignedIn>
      </header>

      <section>
        <h1 className="text-2xl font-bold mb-4">Painel de Administração</h1>
        <p>
          Aqui você poderá gerenciar os presentes e os links exibidos no site.
        </p>
      </section>
    </main>
  );
}
