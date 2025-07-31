"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return <p className="text-center mt-8">Verificando acesso...</p>;
  }

  return <>{children}</>;
}
