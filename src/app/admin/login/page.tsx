// import { SignIn } from "@clerk/clerk-react";
import { SignIn } from "@clerk/nextjs";

export default function AdminLogin() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
}
