// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";

// type JwtPayload = {
//   exp: number;
//   role: string;
// };

// export function GuestProtectedPage({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("guestToken");

//     if (!token) {
//       router.replace("/login");
//       return;
//     }

//     try {
//       const decoded = jwtDecode<JwtPayload>(token);

//       if (decoded.exp * 1000 < Date.now()) {
//         localStorage.removeItem("guestToken");
//         router.replace("/login");
//         return;
//       }

//       if (decoded.role !== "guest") {
//         localStorage.removeItem("guestToken");
//         router.replace("/login");
//         return;
//       }

//       setChecking(false);
//     } catch (err) {
//       console.error("Erro ao decodificar token:", err);
//       localStorage.removeItem("guestToken");
//       router.replace("/login");
//     }
//   }, [router]);

//   if (checking) {
//     return <p className="text-center mt-8">Verificando acesso...</p>;
//   }

//   return <>{children}</>;
// }

"use client";

import { ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
  role: string;
};

export function GuestProtectedPage({ children }: { children: ReactNode }) {
  useEffect(() => {
    const ensureGuestToken = async () => {
      const token = localStorage.getItem("guestToken");

      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          if (decoded.role === "guest" && decoded.exp * 1000 > Date.now()) {
            return;
          }
          localStorage.removeItem("guestToken");
        } catch {
          localStorage.removeItem("guestToken");
        }
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/guest`,
          { method: "POST" }
        );

        if (!res.ok) {
          console.error("Erro ao gerar token público");
          return;
        }

        const data = await res.json();
        localStorage.setItem("guestToken", data.token);
      } catch (err) {
        console.error("Erro ao gerar token público", err);
      }
    };

    ensureGuestToken();
  }, []);

  return <>{children}</>;
}
