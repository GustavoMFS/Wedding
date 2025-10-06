"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import GuestLayout from "@/app/components/GuestLayout";
import { useLanguage } from "../../../contexts/LanguageContext";

type Guest = {
  _id: string;
  name: string;
  isAdult: boolean;
  status: "pending" | "confirmed" | "declined";
  confirmedAt?: string | null;
};

export default function GuestConfirmPage() {
  const { inviteId } = useParams();
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  const { getMessages } = useLanguage();
  const messages = getMessages("guestQuestions");

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const token = localStorage.getItem("guestToken");
        if (!token) {
          router.push("/");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${inviteId}/guests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(messages.guestsLoadError);
        }

        const data = await res.json();
        setGuests(Array.isArray(data.guests) ? data.guests : []);
      } catch (err) {
        console.error(err);
        setGuests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, [inviteId, router, messages.guestsLoadError]);

  const updateStatus = (guestId: string, status: Guest["status"]) => {
    setGuests((prev) =>
      prev.map((g) => (g._id === guestId ? { ...g, status } : g))
    );
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("guestToken");
    if (!token) return;

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${inviteId}/guests/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          guests: guests.map((g) => ({
            guestId: g._id,
            status: g.status,
          })),
        }),
      }
    );

    router.push(`/guest/${inviteId}/questions`);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <GuestLayout>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {messages.guestsConfirmationTitle}
        </h2>
        <h3 className="text-1xl font-bold mb-6 text-center text-gray-600">
          {messages.guestsConfirmationSubTitle}
        </h3>
        {guests.length > 0 ? (
          guests.map((guest) => (
            <div
              key={guest._id}
              className="flex justify-between items-center border p-3 mb-3 rounded-lg bg-gray-100"
            >
              <span className="font-bold">{guest.name}</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => updateStatus(guest._id, "confirmed")}
                  className={`flex items-center gap-1 ${
                    guest.status === "confirmed"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4 flex-none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {messages.confirm}
                </Button>
                <Button
                  onClick={() => updateStatus(guest._id, "declined")}
                  className={`flex items-center gap-1 ${
                    guest.status === "declined"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4 flex-none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {messages.notConfirm}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">{messages.guestsNotFound}</p>
        )}
        <div className="mt-6 text-center">
          <Button
            onClick={handleSubmit}
            className="bg-pink-600 hover:bg-pink-700"
          >
            {messages.continue}
          </Button>
        </div>
      </main>
    </GuestLayout>
  );
}
