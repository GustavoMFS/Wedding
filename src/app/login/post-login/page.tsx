import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function PostLogin() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  interface UserWithMetadata {
    publicMetadata?: {
      role?: string;
    };
  }

  useEffect(() => {
    if (!isLoaded || !user) return;

    const role = (user as UserWithMetadata).publicMetadata?.role;

    if (role === "admin") {
      router.replace("/admin/panel");
    } else {
      router.replace("/presentes");
    }
  }, [isLoaded, user, router]);

  return <p>Redirecionando...</p>;
}
