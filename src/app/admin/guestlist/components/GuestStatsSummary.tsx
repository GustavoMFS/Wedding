"use client";

import { useEffect, useMemo, useState } from "react";
import { Guest } from "../../../types";

interface Props {
  guests: Guest[];
}

export const GuestStatsSummary = ({ guests }: Props) => {
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("guestlist_show_stats");
    if (saved !== null) {
      setShowStats(saved === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("guestlist_show_stats", String(showStats));
  }, [showStats]);

  const stats = useMemo(() => {
    return {
      total: guests.length,
      confirmed: guests.filter((g) => g.status === "confirmed").length,
      declined: guests.filter((g) => g.status === "declined").length,
      pending: guests.filter((g) => g.status === "pending").length,
      noiva: guests.filter((g) => g.tags?.[0] === "noiva").length,
      noivo: guests.filter((g) => g.tags?.[0] === "noivo").length,
    };
  }, [guests]);

  const StatCard = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: number;
    color: string;
  }) => (
    <div className="rounded-lg p-4 bg-white shadow flex flex-col items-center">
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-sm text-gray-600 mt-1 text-center">{label}</span>
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowStats((s) => !s)}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          {showStats ? "Ocultar resumo" : "Mostrar resumo"}
          <span className="text-xs">{showStats ? "▴" : "▾"}</span>
        </button>
      </div>

      {showStats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total" value={stats.total} color="text-gray-800" />
          <StatCard
            label="Confirmados"
            value={stats.confirmed}
            color="text-green-600"
          />
          <StatCard
            label="Não confirmados"
            value={stats.declined}
            color="text-red-600"
          />
          <StatCard
            label="Sem resposta"
            value={stats.pending}
            color="text-yellow-600"
          />
          <StatCard label="Noiva" value={stats.noiva} color="text-pink-600" />
          <StatCard label="Noivo" value={stats.noivo} color="text-blue-600" />
        </div>
      )}
    </div>
  );
};
