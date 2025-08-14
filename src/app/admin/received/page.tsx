"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { AdminProtectedPage } from "../../components/AdminProtectedPage";

interface GiftPurchase {
  _id: string;
  giftTitle: string;
  name: string;
  email?: string;
  message: string;
  value: number;
  createdAt: string;
}

export default function AdminReceivedPage() {
  const [purchases, setPurchases] = useState<GiftPurchase[]>([]);
  const { getToken } = useAuth();

  const fetchPurchases = useCallback(async () => {
    try {
      // Pega o token do Clerk para backend
      const token = await getToken({ template: "backend-access" });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/gift-purchases`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await (res.ok ? res.json() : []);

      if (Array.isArray(data)) {
        setPurchases(data);
      } else {
        console.error("API retornou algo que não é array:", data);
        setPurchases([]);
      }
    } catch (err) {
      console.error("Erro ao buscar presentes recebidos:", err);
      setPurchases([]);
    }
  }, [getToken]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  return (
    <AdminProtectedPage>
      <main className="max-w-4xl mx-auto p-4 space-y-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Presentes Recebidos</h1>
        </header>

        <section className="space-y-4">
          {purchases.length === 0 && <p>Nenhum presente comprado ainda.</p>}
          {purchases.map((p) => (
            <div
              key={p._id}
              className="p-4 border rounded-md shadow-sm bg-white flex flex-col gap-1"
            >
              <p>
                <strong>Presente:</strong> {p.giftTitle}
              </p>
              <p>
                <strong>Nome:</strong> {p.name}
              </p>
              {p.email && (
                <p>
                  <strong>E-mail:</strong> {p.email}
                </p>
              )}
              <p>
                <strong>Mensagem:</strong> {p.message}
              </p>
              <p>
                <strong>Valor:</strong> R$ {p.value.toFixed(2)}
              </p>
            </div>
          ))}
        </section>
      </main>
    </AdminProtectedPage>
  );
}
