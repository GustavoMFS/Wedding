import React from "react";

interface Props {
  onClose: () => void;
}

export const ShareInviteModal = ({ onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Adicionar Novo Convite</h2>

        <p className="text-gray-600 text-sm">
          Formulário será adicionado aqui.
        </p>
      </div>
    </div>
  );
};
