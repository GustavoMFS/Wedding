"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicOnlyPage } from "../components/PublicOnlyPage";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        alert("Senha incorreta");
        setLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem("guestToken", data.token);
      router.push("/home");
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      alert("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicOnlyPage>
      <main className="flex min-h-screen items-center justify-center bg-pink-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md"
        >
          <h1 className="text-xl font-bold mb-4">
            Bem-vindo ao nosso casamento!
          </h1>
          <input
            placeholder="Digite a senha do convite"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-500 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </main>
    </PublicOnlyPage>
  );
}
