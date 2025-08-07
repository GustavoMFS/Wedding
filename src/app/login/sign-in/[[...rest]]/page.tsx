"use client";

import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const role = user.publicMetadata?.role;

    if (role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/presentes");
    }
  }, [isLoaded, user, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
}
