"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import GuestLayout from "@/app/components/GuestLayout";

export default function GuestContactPage() {
  const { inviteId } = useParams();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false); // controla exibição da tela de agradecimento

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const token = localStorage.getItem("guestToken");
        if (!token) {
          router.push("/");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${inviteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Erro ao buscar convite");

        const data = await res.json();

        // Dados do invite
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [inviteId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("guestToken");
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${inviteId}/contact`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, phone }),
        }
      );

      if (!res.ok) throw new Error("Falha ao atualizar contato");

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <GuestLayout>
        <p className="text-center mt-10">Carregando...</p>
      </GuestLayout>
    );

  if (submitted)
    return (
      <GuestLayout>
        <main className="max-w-2xl mx-auto px-6 py-10 text-center">
          <h2 className="text-3xl font-bold mb-6">Obrigado pelas respostas!</h2>
          <p className="mb-6">
            Aproveite que está por aqui e veja os presentes disponíveis para os
            noivos!
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => router.push(`/presentes`)}
              className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded"
            >
              Ver presentes
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            >
              Voltar para a home
            </button>
          </div>
        </main>
      </GuestLayout>
    );

  return (
    <GuestLayout>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Deixe um telefone e/ou email para contato
        </h2>
        <h3 className="text-1xl font-bold mb-6 text-center text-gray-600">
          Os noivos poderão enviar informações sobre o evento para o seu número
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Telefone (Opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded w-full p-2 mb-4"
          />
          <input
            type="email"
            placeholder="Email (Opcional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full p-2 mb-4"
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded w-full"
          >
            Enviar
          </button>
        </form>
      </main>
    </GuestLayout>
  );
}
