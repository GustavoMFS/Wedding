"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GuestLayout from "@/app/components/GuestLayout";

type Question = {
  _id: string;
  question: string;
  required: boolean;
};

export default function GuestQuestionsPage() {
  const { inviteId } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("guestToken");
        if (!token) return router.push("/");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/questions/${inviteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Erro ao buscar perguntas");

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          // não há perguntas → pula para página de contato
          router.push(`/guest/${inviteId}/contact`);
          return;
        }

        setQuestions(data);
      } catch (err) {
        console.error(err);
        router.push(`/guest/${inviteId}/contact`);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [inviteId, router]);

  if (loading) return <p>Carregando...</p>;

  return (
    <GuestLayout>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Perguntas adicionais
        </h2>
        {questions.map((q) => (
          <div key={q._id} className="mb-4">
            <label className="block mb-1">{q.question}</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Sua resposta"
            />
          </div>
        ))}
        <div className="mt-6 text-center">
          <button
            className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded"
            onClick={() => router.push(`/guest/${inviteId}/contact`)}
          >
            Continuar
          </button>
        </div>
      </main>
    </GuestLayout>
  );
}
