"use client";

import { useState } from "react";
import { AddInviteModal } from "./components/AddInviteModal";
import { InviteList } from "./components/InviteList";

export default function GuestListPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4 md:col-span-1">
          <h1 className="text-3xl font-bold text-gray-800">
            Lista de Convites
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-2 px-4 bg-gray-300 text-gray-800 rounded hover:bg-gray-500"
          >
            Adicionar Convite
          </button>
        </div>
        <div className="md:col-span-2">
          <InviteList refresh={refresh} />
        </div>
      </div>

      {showAddModal && (
        <AddInviteModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            setShowAddModal(false);
            setRefresh((r) => r + 1);
          }}
        />
      )}
    </>
  );
}
