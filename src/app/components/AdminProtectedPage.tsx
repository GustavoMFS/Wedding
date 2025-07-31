"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (
      !isSignedIn ||
      !user.publicMetadata?.role ||
      user.publicMetadata.role !== "admin"
    ) {
      router.replace("/login");
    } else {
      setChecking(false);
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (checking)
    return <p className="text-center mt-8">Verificando acesso...</p>;

  return <>{children}</>;
}
