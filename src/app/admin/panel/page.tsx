"use client";

import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import CreateGiftForm from "./CreateGiftForm";
import CreateExternalLinkForm from "./CreateExternalLinkForm";

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
        </SignedIn>
      </header>

      <SignedIn>
        <section>
          <h1 className="text-2xl font-bold mb-4">Painel de Administração</h1>
          <p>
            Aqui você poderá gerenciar os presentes e os links exibidos no site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Criar Presente</h2>
          <CreateGiftForm />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Adicionar Link Externo</h2>
          <CreateExternalLinkForm />
        </section>
      </SignedIn>
    </main>
  );
}
