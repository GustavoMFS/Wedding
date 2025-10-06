"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import GuestLayout from "@/app/components/GuestLayout";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function GuestContactPage() {
  const { inviteId } = useParams();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { getMessages } = useLanguage();
  const messages = getMessages("guestQuestions");

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const token = localStorage.getItem("guestToken");
        if (!token) {
          router.push("/");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${inviteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error(messages.inviteLoadError);

        const data = await res.json();

        // Dados do invite
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [inviteId, router, messages.inviteLoadError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("guestToken");
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${inviteId}/contact`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, phone }),
        }
      );

      if (!res.ok) throw new Error(messages.updateFail);

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <GuestLayout>
        <p className="text-center mt-10">Carregando...</p>
      </GuestLayout>
    );

  if (submitted)
    return (
      <GuestLayout>
        <main className="max-w-2xl mx-auto px-6 py-10 text-center">
          <h2 className="text-3xl font-bold mb-6">{messages.thanksTitle}</h2>
          <p className="mb-6">{messages.thanksTitle}</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => router.push(`/presentes`)}
              className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded"
            >
              {messages.giftsButton}
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            >
              {messages.homeButton}
            </button>
          </div>
        </main>
      </GuestLayout>
    );

  return (
    <GuestLayout>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {messages.contactTitle}
        </h2>
        <h3 className="text-1xl font-bold mb-6 text-center text-gray-600">
          {messages.contactSubTitle}
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={messages.phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded w-full p-2 mb-4"
          />
          <input
            type="email"
            placeholder={messages.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full p-2 mb-4"
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded w-full"
          >
            {messages.send}
          </button>
        </form>
      </main>
    </GuestLayout>
  );
}
