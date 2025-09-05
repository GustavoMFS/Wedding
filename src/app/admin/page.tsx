"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { AdminProtectedPage } from "../components/AdminProtectedPage";

export default function AdminDashboardPage() {
  return (
    <AdminProtectedPage>
      <main className="max-w-4xl mx-auto p-4 space-y-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard do Admin</h1>
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

        <section className="space-y-4">
          <p className="text-gray-700">
            Bem-vindo ao painel de administração. Escolha uma seção para
            continuar:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/guestlist"
              className="block border rounded-xl p-6 shadow hover:shadow-lg transition text-center"
            >
              <h2 className="text-xl font-semibold mb-2">
                Lista de Convidados
              </h2>
              <p className="text-gray-600">
                Adicionar e visualize seus convidados.
              </p>
            </Link>

            <Link
              href="/admin/panel"
              className="block border rounded-xl p-6 shadow hover:shadow-lg transition text-center"
            >
              <h2 className="text-xl font-semibold mb-2">Painel</h2>
              <p className="text-gray-600">
                Adicionar novos presentes e links externos.
              </p>
            </Link>

            <Link
              href="/admin/management"
              className="block border rounded-xl p-6 shadow hover:shadow-lg transition text-center"
            >
              <h2 className="text-xl font-semibold mb-2">Gerenciar</h2>
              <p className="text-gray-600">
                Editar ou excluir presentes e links existentes.
              </p>
            </Link>

            <Link
              href="/admin/received"
              className="block border rounded-xl p-6 shadow hover:shadow-lg transition text-center"
            >
              <h2 className="text-xl font-semibold mb-2">
                Presentes Recebidos
              </h2>
              <p className="text-gray-600">
                Veja os presentes pagos pelos convidados e suas mensagens.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </AdminProtectedPage>
  );
}
