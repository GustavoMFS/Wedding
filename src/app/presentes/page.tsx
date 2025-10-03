"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GuestProtectedPage } from "../components/GuestProtectedPage";
import GuestLayout from "../components/GuestLayout";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "../contexts/LanguageContext"; // 👈 importamos

type ExternalLink = {
  _id: string;
  title: string;
  image: string;
  url: string;
};

type Gift = {
  _id: string;
  title: string;
  description: string;
  image: string;
  value: number;
  paymentType: string;
  amountCollected: number;
};

export default function PresentesPageWrapper() {
  return (
    <GuestProtectedPage>
      <PresentesPage />
    </GuestProtectedPage>
  );
}

function PresentesPage() {
  const router = useRouter();
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  const { getMessages } = useLanguage();
  const messages = getMessages("gifts");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("guestToken");
      if (!token) {
        console.error("Token não encontrado no localStorage");
        setLoading(false);
        return;
      }

      try {
        const [linksRes, giftsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gifts`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!linksRes.ok || !giftsRes.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        const linksData = await linksRes.json();
        const giftsData = await giftsRes.json();

        setLinks(linksData);
        setGifts(giftsData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <GuestLayout>
        <main className="min-h-screen bg-pink-100 flex items-center justify-center">
          <p className="text-center p-4">{messages.loading}</p>
        </main>
      </GuestLayout>
    );
  }

  return (
    <GuestProtectedPage>
      <GuestLayout>
        <div className="min-h-screen bg-pink-100">
          <main className="max-w-5xl mx-auto p-4 space-y-12">
            {loading && <p className="text-center p-4">{messages.loading}</p>}

            {!loading && links.length === 0 && gifts.length === 0 && (
              <p className="text-center p-4 text-gray-500">
                {messages.noGifts}
              </p>
            )}

            {!loading && gifts.length > 0 && (
              <section>
                <header>
                  <h2 className="text-2xl font-bold mb-4">
                    {messages.giftsSection}
                  </h2>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {gifts.map((gift) => (
                    <article
                      key={gift._id}
                      onClick={() => router.push(`/presentes/${gift._id}`)}
                      className="cursor-pointer"
                    >
                      <Card className="rounded-xl shadow hover:shadow-lg transition h-full flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {gift.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {gift.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <Image
                            src={gift.image}
                            alt={gift.title}
                            width={300}
                            height={160}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <p className="mt-2 font-semibold text-sm">
                            {messages.value}: R$ {gift.value.toFixed(2)}
                          </p>
                        </CardContent>
                      </Card>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {!loading && links.length > 0 && (
              <section>
                <header>
                  <h2 className="text-2xl font-bold mb-4">
                    {messages.otherOptions}
                  </h2>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {links.map((link) => (
                    <article key={link._id}>
                      <a
                        href={
                          link.url.startsWith("http")
                            ? link.url
                            : `https://${link.url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Card className="rounded-xl shadow hover:shadow-lg transition h-full flex flex-col">
                          <CardHeader>
                            <CardTitle className="text-base">
                              {link.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <Image
                              src={link.image}
                              alt={link.title}
                              width={300}
                              height={160}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                          </CardContent>
                        </Card>
                      </a>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </GuestLayout>
    </GuestProtectedPage>
  );
}
