"use client";

import { InviteWithGuests, Guest, GuestStatus } from "../../../types";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";

interface Props {
  invite: InviteWithGuests;
  guests: Guest[];
  onClose: () => void;
  onSave: (updatedInvite: InviteWithGuests, updatedGuests: Guest[]) => void;
  onDeleteInvite: (inviteId: string) => void;
  onDeleteGuest: (guestId: string) => void;
}

export const EditInviteModal = ({
  invite,
  guests,
  onClose,
  onSave,
  onDeleteInvite,
  onDeleteGuest,
}: Props) => {
  const { getToken } = useAuth();
  const [formInvite, setFormInvite] = useState<InviteWithGuests>(invite);
  const [formGuests, setFormGuests] = useState<Guest[]>(
    guests.map((g) => ({ ...g, tags: g.tags || [] }))
  );
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setFormInvite(invite);
    setFormGuests(guests.map((g) => ({ ...g, tags: g.tags || [] })));
    setClosing(false);
  }, [invite, guests]);

  const handleClose = () => setClosing(true);
  const handleAnimationComplete = () => closing && onClose();

  const handleGuestChange = <K extends keyof Guest>(
    index: number,
    field: K,
    value: Guest[K]
  ) => {
    const updated = [...formGuests];
    updated[index] = { ...updated[index], [field]: value };
    setFormGuests(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await getToken({ template: "backend-access" });

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${invite._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            identifier: formInvite.identifier,
            email: formInvite.email,
            phone: formInvite.phone,
          }),
        }
      );

      for (const guest of formGuests) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${invite._id}/guests/${guest._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: guest.name,
              isAdult: guest.isAdult,
              tags: guest.tags,
              status: guest.status,
            }),
          }
        );
      }

      onSave(formInvite, formGuests);
      handleClose();
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvite = async () => {
    if (!confirm("Tem certeza que deseja excluir este convite?")) return;

    try {
      const token = await getToken({ template: "backend-access" });

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${invite._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onDeleteInvite(invite._id);
      handleClose();
    } catch (err) {
      console.error("Erro ao excluir convite:", err);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    try {
      const token = await getToken({ template: "backend-access" });

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${invite._id}/guests/${guestId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onDeleteGuest(guestId);
      setFormGuests((prev) => prev.filter((g) => g._id !== guestId));
    } catch (err) {
      console.error("Erro ao excluir convidado:", err);
    }
  };

  const handleAddGuest = async () => {
    setLoading(true);
    try {
      const token = await getToken({ template: "backend-access" });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${invite._id}/guests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: "Novo convidado",
            isAdult: true,
            tags: [],
            status: "pending",
          }),
        }
      );

      if (!res.ok) throw new Error("Erro ao adicionar convidado");

      const newGuest: Guest = await res.json();
      setFormGuests((prev) => [...prev, newGuest]);
    } catch (err) {
      console.error("Erro ao adicionar convidado:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {!closing && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={handleAnimationComplete}
        >
          <motion.div
            className="absolute inset-0 bg-black/30"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.dialog
            className="relative ml-auto w-full max-w-lg bg-gray-50 shadow-xl h-full p-8 overflow-y-auto text-gray-800 text-base"
            open
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{invite.identifier}</h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-500 hover:text-red-600 text-2xl"
              >
                ✕
              </button>
            </header>

            <section
              aria-labelledby="invite-details"
              className="mb-6 space-y-4 bg-gray-100 p-4 rounded-lg"
            >
              <h3 id="invite-details" className="sr-only">
                Detalhes do convite
              </h3>
              <fieldset className="space-y-2">
                <label className="block font-medium">Identificador</label>
                <input
                  type="text"
                  value={formInvite.identifier}
                  onChange={(e) =>
                    setFormInvite({ ...formInvite, identifier: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:ring-gray-300 text-base"
                />
              </fieldset>
              <fieldset className="space-y-2">
                <label className="block font-medium">Email</label>
                <input
                  type="email"
                  value={formInvite.email || ""}
                  onChange={(e) =>
                    setFormInvite({ ...formInvite, email: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:ring-gray-300 text-base"
                />
              </fieldset>
              <fieldset className="space-y-2">
                <label className="block font-medium">Telefone</label>
                <input
                  type="text"
                  value={formInvite.phone || ""}
                  onChange={(e) =>
                    setFormInvite({ ...formInvite, phone: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:ring-gray-300 text-base"
                />
              </fieldset>
            </section>

            <section aria-labelledby="guest-section">
              <header className="flex justify-between items-center mb-2">
                <h3 id="guest-section" className="text-xl font-semibold">
                  Convidados
                </h3>
                <button
                  type="button"
                  onClick={handleAddGuest}
                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
                >
                  + Adicionar convidado
                </button>
              </header>

              <ul className="space-y-4">
                {formGuests.map((guest, index) => (
                  <li
                    key={guest._id}
                    className="bg-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm space-y-4"
                  >
                    <fieldset className="space-y-2">
                      <label className="block font-medium">Nome</label>
                      <input
                        type="text"
                        value={guest.name}
                        onChange={(e) =>
                          handleGuestChange(index, "name", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 p-2 text-base focus:border-gray-500 focus:ring-gray-300"
                      />
                    </fieldset>

                    <fieldset className="space-y-2">
                      <label className="block font-medium">
                        Lado (opcional)
                      </label>
                      <select
                        value={guest.tags?.[0] || ""}
                        onChange={(e) =>
                          handleGuestChange(
                            index,
                            "tags",
                            e.target.value ? [e.target.value] : []
                          )
                        }
                        className="w-full rounded-md border border-gray-300 p-2 text-base focus:border-gray-500 focus:ring-gray-300"
                      >
                        <option value="">Nenhum</option>
                        <option value="noiva">Noiva</option>
                        <option value="noivo">Noivo</option>
                      </select>
                    </fieldset>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={guest.isAdult}
                          onChange={(e) =>
                            handleGuestChange(
                              index,
                              "isAdult",
                              e.target.checked
                            )
                          }
                        />
                        Adulto
                      </label>
                    </div>

                    <fieldset className="space-y-2">
                      <label className="block font-medium">Status</label>
                      <select
                        value={guest.status || "pending"}
                        onChange={(e) =>
                          handleGuestChange(
                            index,
                            "status",
                            e.target.value as GuestStatus
                          )
                        }
                        className="w-full rounded-md border border-gray-300 p-2 text-base focus:border-gray-500 focus:ring-gray-300"
                      >
                        <option value="pending">Sem resposta</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="declined">Não confirmado</option>
                      </select>
                    </fieldset>

                    <button
                      type="button"
                      onClick={() => handleDeleteGuest(guest._id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                    >
                      <Trash2 size={16} />
                      Remover convidado
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <footer className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
              {/* Botão Excluir */}
              <button
                onClick={handleDeleteInvite}
                className="w-full sm:w-auto py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Excluir convite
              </button>

              {/* Grupo Cancelar + Salvar */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto py-2 px-4 border rounded text-gray-700 hover:bg-gray-200"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full sm:w-auto py-2 px-4 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </footer>
          </motion.dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
