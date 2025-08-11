import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp
        appearance={{
          elements: { card: "shadow-xl border rounded-xl" },
        }}
        redirectUrl="/"
      />
    </div>
  );
}
