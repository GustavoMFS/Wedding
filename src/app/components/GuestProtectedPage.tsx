"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
  role: string;
};

export function GuestProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("guestToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("guestToken");
        router.replace("/login");
        return;
      }

      if (decoded.role !== "guest") {
        localStorage.removeItem("guestToken");
        router.replace("/login");
        return;
      }

      setChecking(false);
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      localStorage.removeItem("guestToken");
      router.replace("/login");
    }
  }, [router]);

  if (checking) {
    return <p className="text-center mt-8">Verificando acesso...</p>;
  }

  return <>{children}</>;
}
