"use client";

import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import CreateGiftForm from "./CreateGiftForm";
import CreateExternalLinkForm from "./CreateExternalLinkForm";
import { AdminProtectedPage } from "../../components/AdminProtectedPage";

export default function AdminPanel() {
  return (
    <AdminProtectedPage>
      <main className="max-w-5xl mx-auto p-6 space-y-10">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Painel de Administração
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie os presentes e os links exibidos no site.
            </p>
          </div>

          <div>
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
          </div>
        </header>

        {/* Conteúdo Principal */}
        <SignedIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Criar Presente */}
            <section className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <h2 className="text-xl font-bold text-purple-700 mb-4">
                Criar Presente
              </h2>
              <CreateGiftForm />
            </section>

            {/* Adicionar Link Externo */}
            <section className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <h2 className="text-xl font-bold text-purple-700 mb-4">
                Adicionar Link Externo
              </h2>
              <CreateExternalLinkForm />
            </section>
          </div>
        </SignedIn>
      </main>
    </AdminProtectedPage>
  );
}
