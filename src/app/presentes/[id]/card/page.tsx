"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Gift } from "@/app/types";
import Image from "next/image";
import CardPaymentForm from "@/app/components/CardPaymentForm";
import { GuestProtectedPage } from "@/app/components/GuestProtectedPage";
import GuestLayout from "@/app/components/GuestLayout";

export default function CardPaymentCheckoutPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(true);

  const name = searchParams.get("name") || "";
  const message = searchParams.get("message") || "";
  const urlValue = searchParams.get("value");

  const userValue = useMemo(
    () => (urlValue ? parseFloat(urlValue) : NaN),
    [urlValue]
  );

  useEffect(() => {
    const fetchGift = async () => {
      const token = localStorage.getItem("guestToken");
      if (!token || !id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Erro ao buscar presente");

        const data: Gift = await res.json();
        setGift(data);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar presente.");
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [id]);

  if (loading) return <p className="text-center p-4">Carregando...</p>;
  if (!gift)
    return (
      <p className="text-center p-4 text-red-500">Presente não encontrado</p>
    );

  // Valor a ser pago (total ou parcial)
  const paymentValue =
    gift.paymentType === "partial" && !isNaN(userValue)
      ? userValue
      : gift.value;

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
          <p>{gift.description}</p>
          <p>
            Valor: <strong>R$ {paymentValue.toFixed(2)}</strong>
          </p>

          <div className="pt-4">
            <CardPaymentForm
              value={paymentValue}
              giftId={gift._id}
              name={name}
              message={message}
            />
          </div>
        </div>
      </GuestLayout>
    </GuestProtectedPage>
  );
}
