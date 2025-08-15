"use client";

import { useState } from "react";
import Image from "next/image";

interface PixPaymentProps {
  value: number;
}

export default function PixPayment({ value }: PixPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [qrCodeText, setQrCodeText] = useState<string | null>(null);

  const handlePixPayment = async () => {
    try {
      setLoading(true);
      setQrCodeBase64(null);
      setQrCodeText(null);

      const token = localStorage.getItem("guestToken");
      if (!token) throw new Error("Token de convidado não encontrado");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pix/create-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            transaction_amount: value,
            description: "Presente de casamento",
          }),
        }
      );

      if (!res.ok) throw new Error("Erro ao criar pagamento Pix");

      const data = await res.json();
      setQrCodeBase64(data.qr_code_base64);
      setQrCodeText(data.qr_code);
    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar pagamento Pix");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded space-y-4">
      <button
        onClick={handlePixPayment}
        disabled={loading}
        className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Gerando QR Code..." : "Pagar com Pix"}
      </button>

      {qrCodeBase64 && (
        <div className="text-center space-y-2">
          <Image
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="QR Code Pix"
            width={300}
            height={300}
            className="mx-auto"
          />
          <p className="text-sm text-gray-500">
            Escaneie ou use o código abaixo:
          </p>
          <textarea
            readOnly
            value={qrCodeText || ""}
            className="w-full border p-2 rounded text-sm"
            rows={4}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(qrCodeText || "");
              alert("Código Pix copiado!");
            }}
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
          >
            Copiar Código
          </button>
        </div>
      )}
    </div>
  );
}
