"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import GuestLayout from "../components/GuestLayout";
import { GuestProtectedPage } from "../components/GuestProtectedPage";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function GuestPinPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { getMessages } = useLanguage();
  const messages = getMessages("guestConfirmation");

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invites/validate-pin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        }
      );

      if (!res.ok) {
        throw new Error(messages.invalidPin);
      }

      const data = await res.json();
      router.push(`/guest/${data.invite._id}/confirm`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    }
  };

  return (
    <GuestProtectedPage>
      <GuestLayout>
        <main
          className="flex flex-col items-center justify-center min-h-screen px-6"
          style={{
            backgroundImage: "url('/paper1.jpg')",
            backgroundBlendMode: "multiply",
          }}
        >
          <h2 className="text-3xl font-[cinzelb] text-[#175ca1] mb-4">
            {messages.typePin}
          </h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <Input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            className="mb-4 max-w-sm bg-[#ffffff]"
          />
          <Button
            onClick={handleSubmit}
            className="bg-[#385e85] hover:bg-[#0d2946] font-[cinzelb] text-white"
          >
            {messages.continue}
          </Button>
        </main>
      </GuestLayout>
    </GuestProtectedPage>
  );
}
