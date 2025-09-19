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

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editValue, setEditValue] = useState<number>(0);
  const [editUrl, setEditUrl] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);

  const { getToken } = useAuth();

  const fetchData = useCallback(async () => {
    const token = await getToken({ template: "backend-access" });

    const [giftsRes, linksRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gifts/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links/admin`, {
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
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gifts/admin/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setGifts((prev) => prev.filter((gift) => gift._id !== id));
  };

  const deleteLink = async (id: string) => {
    const token = await getToken({ template: "backend-access" });
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links/admin/${id}`, {
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
    setConfirmDelete(false);
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
      body = { title: editTitle, url: editUrl };
    }

    const url =
      itemType === "gift"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/admin/${selectedItem._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/links/admin/${selectedItem._id}`;

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
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🎁 Gerenciar Presentes e Links
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Presentes</h2>
          {gifts.length === 0 ? (
            <p className="text-gray-500">Nenhum presente cadastrado.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {gifts.map((gift) => (
                <div
                  key={gift._id}
                  className="border rounded-lg shadow-md p-4 flex flex-col justify-between bg-white"
                >
                  <h3 className="font-semibold text-lg">{gift.title}</h3>
                  <p className="text-sm text-gray-500">
                    R$ {gift.value.toFixed(2)}
                  </p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => openViewModal(gift, "gift")}
                      className="px-3 py-1 text-green-700 border rounded hover:bg-green-50"
                    >
                      Visualizar
                    </button>
                    <button
                      onClick={() => openEditModal(gift, "gift")}
                      className="px-3 py-1 text-blue-700 border rounded hover:bg-blue-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(gift);
                        setItemType("gift");
                        setConfirmDelete(true);
                      }}
                      className="px-3 py-1 text-red-700 border rounded hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Links Externos</h2>
          {links.length === 0 ? (
            <p className="text-gray-500">Nenhum link externo cadastrado.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {links.map((link) => (
                <div
                  key={link._id}
                  className="border rounded-lg shadow-md p-4 flex flex-col justify-between bg-white"
                >
                  <h3 className="font-semibold text-lg">{link.title}</h3>
                  <p className="text-sm text-gray-500">{link.url}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => openViewModal(link, "link")}
                      className="px-3 py-1 text-green-700 border rounded hover:bg-green-50"
                    >
                      Visualizar
                    </button>
                    <button
                      onClick={() => openEditModal(link, "link")}
                      className="px-3 py-1 text-blue-700 border rounded hover:bg-blue-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(link);
                        setItemType("link");
                        setConfirmDelete(true);
                      }}
                      className="px-3 py-1 text-red-700 border rounded hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedItem && !confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
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
                    <label className="block font-semibold mb-1">Título</label>
                    <input
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
                        <label className="block font-semibold mb-1">
                          Descrição
                        </label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">
                          Valor
                        </label>
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          className="w-full border rounded px-3 py-2"
                          min={0.5}
                          step={0.01}
                          required
                        />
                      </div>
                    </>
                  )}

                  {itemType === "link" && (
                    <div>
                      <label className="block font-semibold mb-1">URL</label>
                      <input
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
                    onClick={() => setConfirmDelete(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {confirmDelete && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
              <h3 className="text-lg font-bold mb-4 text-red-600">
                Tem certeza que deseja excluir?
              </h3>
              <p className="mb-6 text-gray-600">
                Essa ação não pode ser desfeita.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (itemType === "gift") {
                      await deleteGift(selectedItem._id);
                    } else if (itemType === "link") {
                      await deleteLink(selectedItem._id);
                    }
                    closeModal();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtectedPage>
  );
}
