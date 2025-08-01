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
  const [isEditing, setIsEditing] = useState(false);

  // Estados para edição (podem ser para Gift ou Link)
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState(""); // só para gift
  const [editValue, setEditValue] = useState<number>(0); // só para gift
  const [editUrl, setEditUrl] = useState(""); // só para link

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

  const openViewModal = (item: Gift | LinkItem, type: "gift" | "link") => {
    setSelectedItem(item);
    setItemType(type);
    setIsEditing(false);
  };

  const openEditModal = (item: Gift | LinkItem, type: "gift" | "link") => {
    setSelectedItem(item);
    setItemType(type);
    setIsEditing(true);

    // Preenche os campos do formulário
    setEditTitle(item.title);
    if (type === "gift") {
      const gift = item as Gift;
      setEditDescription(gift.description || "");
      setEditValue(gift.value);
    } else {
      const link = item as LinkItem;
      setEditUrl(link.url);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setItemType(null);
    setIsEditing(false);
  };

  const saveChanges = async () => {
    if (!selectedItem || !itemType) return;
    const token = await getToken({ template: "backend-access" });

    let body;
    if (itemType === "gift") {
      body = {
        title: editTitle,
        description: editDescription,
        value: editValue,
      };
    } else {
      body = {
        title: editTitle,
        url: editUrl,
      };
    }

    const url =
      itemType === "gift"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/${selectedItem._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/links/${selectedItem._id}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Erro ao salvar alterações");
      return;
    }

    const updatedItem = await res.json();

    if (itemType === "gift") {
      setGifts((prev) =>
        prev.map((g) => (g._id === updatedItem._id ? updatedItem : g))
      );
    } else {
      setLinks((prev) =>
        prev.map((l) => (l._id === updatedItem._id ? updatedItem : l))
      );
    }

    closeModal();
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
                      onClick={() => openViewModal(gift, "gift")}
                      className="text-green-600 hover:underline"
                    >
                      Visualizar
                    </button>
                    <button
                      onClick={() => openEditModal(gift, "gift")}
                      className="text-blue-600 hover:underline"
                    >
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
                      onClick={() => openViewModal(link, "link")}
                      className="text-green-600 hover:underline"
                    >
                      Visualizar
                    </button>
                    <button
                      onClick={() => openEditModal(link, "link")}
                      className="text-blue-600 hover:underline"
                    >
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
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
              <h3 className="text-xl font-bold mb-4">
                {isEditing ? "Editar" : "Detalhes"}
              </h3>

              {!isEditing ? (
                <>
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
                        {(selectedItem as Gift).amountCollected?.toFixed(2) ??
                          0}
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
                </>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveChanges();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="title">
                      Título
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  {itemType === "gift" && (
                    <>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="description"
                        >
                          Descrição
                        </label>
                        <textarea
                          id="description"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="value"
                        >
                          Valor
                        </label>
                        <input
                          id="value"
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          className="w-full border rounded px-3 py-2"
                          min={0}
                          step={0.01}
                          required
                        />
                      </div>
                    </>
                  )}

                  {itemType === "link" && (
                    <div>
                      <label className="block font-semibold mb-1" htmlFor="url">
                        URL
                      </label>
                      <input
                        id="url"
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              )}

              {!isEditing && (
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border rounded"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
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
              )}
            </div>
          </div>
        )}
      </div>
    </AdminProtectedPage>
  );
}
