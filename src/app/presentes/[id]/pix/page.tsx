"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Gift } from "@/app/types";

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

  // Valor vindo da URL (quando partial); pode ser NaN se não vier
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

  // Gera o Pix automaticamente com o valor correto
  useEffect(() => {
    if (!gift) return;

    // Decide o valor a pagar
    const contributionValue =
      gift.paymentType === "partial" && !isNaN(userValue)
        ? userValue
        : gift.value;

    // Segurança extra: garante mínimo de 0,50
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

  if (!gift) return <p>Carregando...</p>;

  // Valor exibido na tela = o que será cobrado
  const displayValue =
    gift.paymentType === "partial" && !isNaN(userValue)
      ? userValue
      : gift.value;

  return (
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
      <p>{gift.description}</p>
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
            className="mx-auto"
          />

          {pixCode && (
            <div className="w-full max-w-xs flex flex-col items-center">
              <p className="break-all bg-gray-100 p-2 rounded text-center w-full">
                {pixCode}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(pixCode)}
                className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 mt-2"
              >
                Copiar código Pix
              </button>
            </div>
          )}

          <button
            onClick={verifyPayment}
            className="w-full max-w-xs bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Já paguei
          </button>
        </div>
      )}
    </div>
  );
}
