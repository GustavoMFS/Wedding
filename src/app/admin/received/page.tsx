"use client";
import { AdminProtectedPage } from "../../components/AdminProtectedPage";

export default function AdminDashboardPage() {
  return (
    <AdminProtectedPage>
      <main className="max-w-4xl mx-auto p-4 space-y-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Presentes Recebidos</h1>
        </header>

        <section className="space-y-4">
          <p className="text-gray-700">Presentes</p>
        </section>
      </main>
    </AdminProtectedPage>
  );
}
