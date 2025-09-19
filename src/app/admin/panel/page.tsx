"use client";

import CreateGiftForm from "./CreateGiftForm";
import CreateExternalLinkForm from "./CreateExternalLinkForm";
import { AdminProtectedPage } from "../../components/AdminProtectedPage";

export default function AdminPanel() {
  return (
    <AdminProtectedPage>
      <main className="max-w-5xl mx-auto p-6 space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Criação de Presentes e Links
            </h1>
            <p className="text-gray-600 mt-1">
              Cadastre novos presentes e links para exibir no site.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">
              Criar Presente
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Adicione um novo presente à lista, com título, descrição, valor e
              imagem.
            </p>
            <CreateGiftForm />
          </section>

          <section className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">
              Adicionar Link Externo
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Inclua links para listas externas, como Amazon ou outros sites.
            </p>
            <CreateExternalLinkForm />
          </section>
        </div>
      </main>
    </AdminProtectedPage>
  );
}
