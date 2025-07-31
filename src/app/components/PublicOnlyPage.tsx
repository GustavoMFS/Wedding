"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function PublicOnlyPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("guestToken");
    if (token) {
      router.push("/home");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return <p>Verificando...</p>;
  }

  return <>{children}</>;
}
