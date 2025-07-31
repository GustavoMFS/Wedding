"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Gift, LinkItem } from "../../types";
import { AdminProtectedPage } from "../../components/AdminProtectedPage";

export default function AdminPanel() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<Gift | LinkItem | null>(
    null
  );
  const [itemType, setItemType] = useState<"gift" | "link" | null>(null);
  const { getToken } = useAuth();

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

    const giftsData = await (giftsRes.ok ? giftsRes.json() : []);
    const linksData = await (linksRes.ok ? linksRes.json() : []);

    setGifts(Array.isArray(giftsData) ? giftsData : []);
    setLinks(Array.isArray(linksData) ? linksData : []);
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

    setGifts((prev) => prev.filter((gift) => gift._id !== id));
  };

  const deleteLink = async (id: string) => {
    const token = await getToken({ template: "backend-access" });

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setLinks((prev) => prev.filter((link) => link._id !== id));
  };

  const closeModal = () => {
    setSelectedItem(null);
    setItemType(null);
  };

  return (
    <AdminProtectedPage>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Gerenciar Presentes e Links</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Presentes</h2>
          {gifts.length === 0 ? (
            <p className="text-gray-500">Nenhum presente cadastrado.</p>
          ) : (
            <ul className="space-y-2">
              {gifts.map((gift) => (
                <li
                  key={gift._id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>
                    {gift.title} - R$ {gift.value.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(gift);
                        setItemType("gift");
                      }}
                      className="text-green-600 hover:underline"
                    >
                      Visualizar
                    </button>
                    <button className="text-blue-600 hover:underline">
                      Editar
                    </button>
                    <button
                      onClick={() => deleteGift(gift._id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Links Externos</h2>
          {links.length === 0 ? (
            <p className="text-gray-500">Nenhum link externo cadastrado.</p>
          ) : (
            <ul className="space-y-2">
              {links.map((link) => (
                <li
                  key={link._id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{link.title}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(link);
                        setItemType("link");
                      }}
                      className="text-green-600 hover:underline"
                    >
                      Visualizar
                    </button>
                    <button className="text-blue-600 hover:underline">
                      Editar
                    </button>
                    <button
                      onClick={() => deleteLink(link._id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Detalhes</h3>
              {itemType === "gift" ? (
                <>
                  <p>
                    <strong>Título:</strong> {selectedItem.title}
                  </p>
                  <p>
                    <strong>Descrição:</strong>{" "}
                    {(selectedItem as Gift).description}
                  </p>
                  <p>
                    <strong>Valor:</strong> R${" "}
                    {(selectedItem as Gift).value.toFixed(2)}
                  </p>
                  <p>
                    <strong>Arrecadado:</strong> R${" "}
                    {(selectedItem as Gift).amountCollected?.toFixed(2) ?? 0}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {(selectedItem as Gift).amountCollected === 0
                      ? "Nenhum valor recebido"
                      : (selectedItem as Gift).amountCollected! >=
                        (selectedItem as Gift).value
                      ? "Valor total arrecadado"
                      : "Parcialmente pago"}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Título:</strong> {selectedItem.title}
                  </p>
                  <p>
                    <strong>URL:</strong> {(selectedItem as LinkItem).url}
                  </p>
                </>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border rounded"
                >
                  Fechar
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Editar
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={async () => {
                    if (itemType === "gift") {
                      await deleteGift(selectedItem._id);
                    } else if (itemType === "link") {
                      await deleteLink(selectedItem._id);
                    }
                    closeModal();
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtectedPage>
  );
}
