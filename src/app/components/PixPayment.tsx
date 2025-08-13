"use client";
import { useState } from "react";

export default function PixPayment({ value }: { value: number }) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  //   const [payload, setPayload] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePix = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pix/generate-pix`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        }
      );

      if (!res.ok) throw new Error("Erro ao gerar Pix");

      const data = await res.json();
      setQrCode(data.qrCodeImage);
      //   setPayload(data.payload);
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar QR Code Pix");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={generatePix}
        disabled={loading}
        className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 transition"
      >
        {loading ? "Gerando..." : "Pagar com Pix"}
      </button>
      {qrCode && (
        <div className="mt-4 text-center">
          <img src={qrCode} alt="QR Code Pix" className="mx-auto" />
          {/* <p className="text-sm break-all mt-2">{payload}</p> */}
        </div>
      )}
    </div>
  );
}
