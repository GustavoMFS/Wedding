"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { EditInviteModal } from "./EditInviteModal";
import { InviteWithGuests, Guest } from "../../../types";

interface Props {
  refresh: number;
}

export const InviteList = ({ refresh }: Props) => {
  const [invites, setInvites] = useState<InviteWithGuests[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const [selectedInvite, setSelectedInvite] = useState<InviteWithGuests | null>(
    null
  );
  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    (async () => {
      setError(null);
      try {
        const token = await getToken({ template: "backend-access" });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          setError("Erro ao buscar convites");
          setInvites([]);
          return;
        }

        const data = await res.json();

        const invitesWithGuests: InviteWithGuests[] = await Promise.all(
          data.map(async (inv: Omit<InviteWithGuests, "guests">) => {
            const resG = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${inv._id}/guestsAdmin`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!resG.ok) return { ...inv, guests: [] };

            const data = await resG.json();
            const guests: Guest[] = data.guests;

            return { ...inv, guests };
          })
        );

        setInvites(invitesWithGuests);
      } catch (err) {
        console.error("Erro ao buscar convites:", err);
        setError("Erro inesperado ao buscar convites");
        setInvites([]);
      }
    })();
  }, [refresh, getToken]);

  const statusColor = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "declined":
        return "bg-red-500";
      default:
        return "bg-yellow-400";
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}

      {invites.map((invite) => (
        <div
          key={invite._id}
          className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-100"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">
              {invite.identifier} — PIN: {invite.pin}
            </h3>
            <button
              className="text-gray-700 hover:text-gray-900 text-sm"
              onClick={() => {
                setSelectedInvite(invite);
                setModalKey((k) => k + 1);
              }}
            >
              Ver convite
            </button>
          </div>

          <ul className="space-y-2">
            {invite.guests.map((g) => (
              <li
                key={g._id}
                className="flex justify-between items-center p-2 rounded bg-white shadow-sm"
              >
                <div className="flex items-center gap-2 text-base">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${statusColor(
                      g.status
                    )}`}
                  />
                  {g.name}
                </div>
                <span className="text-gray-500 text-sm">
                  {g.isAdult ? "Adulto" : "Criança"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {selectedInvite && (
        <EditInviteModal
          key={modalKey}
          invite={selectedInvite}
          guests={selectedInvite.guests}
          onClose={() => setSelectedInvite(null)}
          onSave={(updatedInvite, updatedGuests) => {
            setInvites((prev) =>
              prev.map((inv) =>
                inv._id === updatedInvite._id
                  ? { ...updatedInvite, guests: updatedGuests }
                  : inv
              )
            );
            setSelectedInvite(null);
          }}
          onDeleteInvite={(deletedInviteId) => {
            setInvites((prev) =>
              prev.filter((inv) => inv._id !== deletedInviteId)
            );
            setSelectedInvite(null);
          }}
          onDeleteGuest={(guestId) => {
            setSelectedInvite((prev) =>
              prev
                ? {
                    ...prev,
                    guests: prev.guests.filter((g) => g._id !== guestId),
                  }
                : prev
            );
          }}
        />
      )}
    </div>
  );
};
