"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Gift } from "@/app/types";
import { GuestProtectedPage } from "@/app/components/GuestProtectedPage";
import GuestLayout from "@/app/components/GuestLayout";
import { useRouter } from "next/navigation";

export default function GiftDetailPage() {
  const { id } = useParams();
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [value, setValue] = useState("");

  const router = useRouter();

  const handlePixClick = () => {
    router.push(
      `/presentes/${id}/pix?name=${encodeURIComponent(
        name
      )}&message=${encodeURIComponent(message)}`
    );
  };
  useEffect(() => {
    const fetchGift = async () => {
      const token = localStorage.getItem("guestToken");
      if (!token || !id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Erro ao buscar presente");

        const data = await res.json();
        setGift(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [id]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("guestToken");
    if (!token || !gift) return;

    const contributionValue =
      gift.paymentType === "full" ? gift.value : parseFloat(value);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/${gift._id}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            message,
            value: contributionValue,
          }),
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Erro ao iniciar pagamento.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao processar pagamento.");
    }
  };

  if (loading) return <p className="text-center p-4">Carregando...</p>;
  if (!gift)
    return (
      <p className="text-center p-4 text-red-500">Presente não encontrado</p>
    );

  const remaining = gift.value - (gift.amountCollected || 0);

  return (
    <GuestProtectedPage>
      <GuestLayout>
        <div className="max-w-xl mx-auto p-4 space-y-4">
          <h1 className="text-2xl font-bold">{gift.title}</h1>
          {gift.image && (
            <Image
              src={gift.image}
              alt={gift.title}
              width={600}
              height={300}
              className="w-full rounded"
            />
          )}
          <p className="text-gray-700">{gift.description}</p>
          <p>
            Valor: <strong>R$ {gift.value.toFixed(2)}</strong>
          </p>
          {/* <p>
            Já arrecadado:{" "}
            <strong>R$ {(gift.amountCollected || 0).toFixed(2)}</strong>
          </p>
          <p>
            Restante: <strong>R$ {remaining.toFixed(2)}</strong>
          </p> */}

          <div className="space-y-2 pt-4">
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <textarea
              placeholder="Mensagem para os noivos"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border p-2 rounded"
            />
            {gift.paymentType === "partial" && (
              <input
                type="number"
                step="0.01"
                min="1"
                max={remaining}
                placeholder="Valor a contribuir (R$)"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border p-2 rounded"
              />
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 transition"
            >
              Pagar com Cartão
            </button>

            <button
              onClick={handlePixClick}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
            >
              Pagar com Pix
            </button>
          </div>
        </div>
      </GuestLayout>
    </GuestProtectedPage>
  );
}
