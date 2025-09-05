"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GuestLayout from "../components/GuestLayout";

export default function GuestConfirmationPage() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (confirm: boolean) => {
    if (!pin.trim()) {
      setError("Por favor, insira seu PIN.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invites/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pin, confirm }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Erro ao confirmar presença");
      }

      setMessage(
        confirm
          ? "Sua presença foi confirmada! 🎉"
          : "Você não confirmou presença."
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestLayout>
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-6">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Confirmação de Presença
        </h2>
        <p className="text-center mb-6 max-w-md">
          Insira o PIN que você recebeu para confirmar sua presença na festa.
        </p>

        {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
        {message && (
          <div className="mb-4 text-green-600 font-medium">{message}</div>
        )}

        <Input
          type="text"
          placeholder="Seu PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          disabled={loading}
          className="mb-4 max-w-sm"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => handleSubmit(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded w-full sm:w-auto"
            disabled={loading}
          >
            Confirmar Presença
          </Button>

          <Button
            onClick={() => handleSubmit(false)}
            variant="outline"
            className="px-6 py-2 rounded w-full sm:w-auto"
            disabled={loading}
          >
            Recusar
          </Button>
        </div>
      </main>
    </GuestLayout>
  );
}
