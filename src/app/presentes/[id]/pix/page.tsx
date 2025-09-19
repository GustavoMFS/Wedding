"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Gift } from "@/app/types";
import { motion } from "framer-motion";
import { GuestProtectedPage } from "@/app/components/GuestProtectedPage";
import GuestLayout from "@/app/components/GuestLayout";

export default function PixCheckoutPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [gift, setGift] = useState<Gift | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

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
      }
    };

    fetchGift();
  }, [id]);

  useEffect(() => {
    if (!gift) return;

    const contributionValue =
      gift.paymentType === "partial" && !isNaN(userValue)
        ? userValue
        : gift.value;

    if (contributionValue < 0.5) {
      alert("Valor inválido. O mínimo é R$ 0,50.");
      router.replace(`/presentes/${id}`);
      return;
    }

    const startPix = async () => {
      setLoadingPayment(true);
      const token = localStorage.getItem("guestToken");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pix/create-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              giftId: gift._id,
              name,
              message,
              value: contributionValue,
            }),
          }
        );

        const data = await res.json();
        setQrCode(data.qr_code_base64);
        setPixCode(data.qr_code);
        setPaymentId(data.paymentId || data.id);
      } catch (err) {
        console.error("Erro ao gerar Pix:", err);
      } finally {
        setLoadingPayment(false);
      }
    };

    startPix();
  }, [gift, name, message, userValue, id, router]);

  const verifyPayment = async () => {
    if (!gift || !paymentId) return;

    const contributionValue =
      gift.paymentType === "partial" && !isNaN(userValue)
        ? userValue
        : gift.value;

    const token = localStorage.getItem("guestToken");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pix/verify-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentId,
            giftId: gift._id,
            name,
            message,
            value: contributionValue,
          }),
        }
      );

      const data = await res.json();
      if (data.paid) {
        router.push("/presentes/success");
      } else {
        alert(`Pagamento ainda não aprovado. Status: ${data.status}`);
      }
    } catch (err) {
      console.error("Erro ao verificar Pix:", err);
      alert("Erro ao verificar pagamento.");
    }
  };

  if (!gift) return <p className="text-center p-4">Carregando...</p>;

  const displayValue =
    gift.paymentType === "partial" && !isNaN(userValue)
      ? userValue
      : gift.value;

  return (
    <GuestProtectedPage>
      <GuestLayout>
        <div className="max-w-xl mx-auto p-4 space-y-4 text-center">
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
            Valor: <strong>R$ {displayValue.toFixed(2)}</strong>
          </p>

          {loadingPayment && <p>Gerando QR Code Pix...</p>}

          {qrCode && (
            <div className="flex flex-col items-center space-y-4 mt-4">
              <Image
                src={`data:image/png;base64,${qrCode}`}
                alt="QR Code Pix"
                width={300}
                height={300}
                className="mx-auto rounded shadow-md"
              />

              {pixCode && (
                <div className="w-full max-w-xs flex flex-col items-center space-y-2">
                  <p className="break-all bg-gray-100 p-3 rounded text-center w-full shadow-inner">
                    {pixCode}
                  </p>
                  <motion.button
                    onClick={() => navigator.clipboard.writeText(pixCode)}
                    className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-2 rounded shadow hover:from-green-500 hover:to-green-700 transition"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Copiar código Pix
                  </motion.button>
                </div>
              )}

              <motion.button
                onClick={verifyPayment}
                className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded shadow hover:from-blue-600 hover:to-indigo-700 transition"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Já paguei
              </motion.button>
            </div>
          )}
        </div>
      </GuestLayout>
    </GuestProtectedPage>
  );
}
