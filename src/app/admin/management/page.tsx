"use client";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

type Gift = { _id: string; title: string; image: string; value: number };
type Link = { _id: string; title: string; image: string; url: string };

export default function AdminPainel() {
  const { getToken } = useAuth();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  const fetchData = useCallback(async () => {
    const token = await getToken({ template: "backend-access" });

    const [giftsRes, linksRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gifts`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    setGifts(await giftsRes.json());
    setLinks(await linksRes.json());
  }, [getToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteGift = async (id: string) => {
    const token = await getToken({ template: "backend-access" });
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gifts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setGifts((prev) => prev.filter((g) => g._id !== id));
  };

  const deleteLink = async (id: string) => {
    const token = await getToken({ template: "backend-access" });
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setLinks((prev) => prev.filter((l) => l._id !== id));
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Presentes</h2>
        <ul className="space-y-2">
          {gifts.map((gift) => (
            <li key={gift._id} className="flex justify-between items-center">
              <span>
                {gift.title} - R$ {gift.value.toFixed(2)}
              </span>
              <div>
                <button
                  onClick={() => deleteGift(gift._id)}
                  className="text-red-500 hover:underline"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Links Externos</h2>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link._id} className="flex justify-between items-center">
              <span>
                {link.title} - {link.url}
              </span>
              <div>
                <button
                  onClick={() => deleteLink(link._id)}
                  className="text-red-500 hover:underline"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
