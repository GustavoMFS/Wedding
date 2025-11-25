"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

type AdminMessages = {
  admin: string;
  login: string;
};

export default function AdminAccess({ messages }: { messages: AdminMessages }) {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <>
      {isAdmin && (
        <button
          onClick={() => (window.location.href = "/admin")}
          className="
            text-[#385e85]
            font-medium 
            font-[cinzel]
            px-3 py-2 
            rounded-md 
            hover:bg-[#e8f0f8]
            transition
          "
        >
          {messages.admin}
        </button>
      )}

      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl="/login/sign-in">
          <button
            className="
              text-[#385e85]
              font-medium 
              font-[cinzel]
              px-3 py-2 
              rounded-md 
              hover:bg-[#e8f0f8]
              transition
            "
          >
            {messages.login}
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton afterSignOutUrl="/home" />
      </SignedIn>
    </>
  );
}
