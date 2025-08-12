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

  if (loading) return <p className="text-center p-4">Carregando...</p>;

  if (links.length === 0 && gifts.length === 0) {
    return (
      <p className="text-center p-4 text-gray-500">
        Ainda não há presentes ou links disponíveis.
      </p>
    );
  }

  return (
    <GuestLayout>
      <main className="max-w-5xl mx-auto p-4 space-y-12">
        {/* Seção de Presentes */}
        {gifts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Presentes para os noivos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {gifts.map((gift) => (
                <div
                  key={gift._id}
                  onClick={() => router.push(`/presentes/${gift._id}`)}
                  className="cursor-pointer"
                >
                  <Card className="rounded-xl shadow hover:shadow-lg transition h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-base">{gift.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {gift.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <img
                        src={gift.image}
                        alt={gift.title}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <p className="mt-2 font-semibold text-sm">
                        Valor: R$ {gift.value.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Seção de Links Externos */}
        {links.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Outras opções de presente
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {links.map((link) => (
                <a
                  key={link._id}
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
                      <CardTitle className="text-base">{link.title}</CardTitle>
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
              ))}
            </div>
          </section>
        )}
      </main>
    </GuestLayout>
  );
}
