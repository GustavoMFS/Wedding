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
import { useLanguage } from "../contexts/LanguageContext";

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

  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(gifts.length / ITEMS_PER_PAGE);

  const paginatedGifts = gifts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
        <main className="min-h-screen bg-[#ffffff] flex items-center justify-center">
          <p className="text-center p-4">{messages.loading}</p>
        </main>
      </GuestLayout>
    );
  }

  return (
    <GuestProtectedPage>
      <GuestLayout>
        <div
          className="min-h-screen  bg-[#ffffff] bg-absolute bg-cover text-[#385e85] z-0"
          style={{
            backgroundImage: "url('/paper1.jpg')",
            backgroundBlendMode: "multiply",
          }}
        >
          <main className="max-w-5xl mx-auto p-4 space-y-12">
            {loading && <p className="text-center p-4">{messages.loading}</p>}

            {!loading && links.length === 0 && gifts.length === 0 && (
              <p className="text-center p-4 text-[#385e85]">
                {messages.noGifts}
              </p>
            )}

            {!loading && gifts.length > 0 && (
              <section>
                <header>
                  <h2 className="text-2xl font-[cinzel] font-bold mb-4">
                    {messages.giftsSection}
                  </h2>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {paginatedGifts.map((gift) => (
                    <article
                      key={gift._id}
                      onClick={() => router.push(`/presentes/${gift._id}`)}
                      className="cursor-pointer"
                    >
                      <Card className="rounded-xl shadow hover:shadow-lg transition h-full flex flex-col">
                        <CardContent className="px-4 pt-4 pb-0">
                          <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden bg-white">
                            <Image
                              src={gift.image}
                              alt={gift.title}
                              fill
                              className="object-contain sm:object-cover w-full h-full rounded-lg"
                            />
                          </div>
                        </CardContent>

                        <CardHeader className="text-center px-4 py-3">
                          <CardTitle className="text-xl font-[cinzel] text-[#385e85] font-semibold">
                            {gift.title}
                          </CardTitle>
                          <CardDescription className="text-sm font-[cinzel] text-[#0d2946]">
                            {gift.description}
                          </CardDescription>
                          <p className="mt-2 text-lg font-[cinzel] text-[#385e85] font-semibold">
                            {messages.value}: R$ {gift.value.toFixed(2)}
                          </p>
                        </CardHeader>
                      </Card>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 rounded border disabled:opacity-40"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded border ${
                        page === currentPage
                          ? "bg-[#385e85] text-white"
                          : "bg-white"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 rounded border disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            )}

            {!loading && links.length > 0 && (
              <section>
                <header>
                  <h2 className="text-2xl font-[cinzel] font-bold mb-4">
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
                          <CardContent className="px-4 pt-4 pb-0">
                            <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden bg-white">
                              <Image
                                src={link.image}
                                alt={link.title}
                                fill
                                className="object-contain sm:object-cover w-full h-full rounded-lg"
                              />
                            </div>
                          </CardContent>

                          <CardHeader className="text-center px-4 py-3">
                            <CardTitle className="text-base font-[cinzel] text-[#385e85] font-semibold">
                              {link.title}
                            </CardTitle>
                          </CardHeader>
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
