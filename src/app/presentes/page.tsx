"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

export default function PresentesPage() {
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linksRes, giftsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gifts`),
        ]);
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
    <main className="max-w-4xl mx-auto p-4 space-y-8">
      {links.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Outras opções de presente</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {links.map((link) => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-xl shadow hover:shadow-lg transition"
              >
                <Image
                  src={link.image}
                  alt={link.title}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <div className="p-2 text-center font-semibold">
                  {link.title}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {gifts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Lista de Presentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gifts.map((gift) => (
              <div
                key={gift._id}
                className="border rounded-xl shadow hover:shadow-lg transition p-4"
              >
                <Image
                  src={gift.image}
                  alt={gift.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="text-lg font-bold">{gift.title}</h3>
                <p className="text-sm text-gray-600">{gift.description}</p>
                <p className="mt-2 font-semibold">
                  Valor: R$ {gift.value.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
