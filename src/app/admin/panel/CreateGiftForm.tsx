"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export default function CreateGiftForm() {
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    value: 0,
    paymentType: "full",
    disableOnGoalReached: false,
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && e.target instanceof HTMLInputElement
          ? e.target.checked
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.size <= 2 * 1024 * 1024) {
      setFile(selected);
    } else {
      alert("Imagem muito grande. Limite: 2MB.");
      e.target.value = "";
    }
  };

  const uploadImageToCloudinary = async (): Promise<string | null> => {
    if (!file) return null;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !preset) {
      alert("Configuração do Cloudinary ausente.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Erro ao enviar imagem:",
          err.response?.data || err.message
        );
      } else {
        console.error("Erro inesperado:", err);
      }
      alert("Erro ao enviar imagem.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    const imageUrl = await uploadImageToCloudinary();
    if (!imageUrl) return;

    const token = await getToken({ template: "backend-access" });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gifts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, image: imageUrl }),
    });

    if (res.ok) {
      alert("Presente criado com sucesso!");
      setForm({
        title: "",
        description: "",
        value: 0,
        paymentType: "full",
        disableOnGoalReached: false,
      });
      setFile(null);
    } else {
      const errorData = await res.json();
      alert("Erro ao criar presente: " + (errorData?.message || ""));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        placeholder="Título"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Descrição"
        value={form.description}
        onChange={handleChange}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        required
      />
      <input
        type="number"
        name="value"
        placeholder="Valor"
        value={form.value}
        onChange={handleChange}
        required
      />
      <select
        name="paymentType"
        value={form.paymentType}
        onChange={handleChange}
      >
        <option value="full">Valor completo</option>
        <option value="partial">Pagamento parcial</option>
      </select>
      <label>
        <input
          type="checkbox"
          name="disableOnGoalReached"
          checked={form.disableOnGoalReached}
          onChange={handleChange}
        />
        Desativar quando atingir o valor
      </label>
      <button type="submit" disabled={uploading}>
        {uploading ? "Enviando imagem..." : "Criar Presente"}
      </button>
    </form>
  );
}
