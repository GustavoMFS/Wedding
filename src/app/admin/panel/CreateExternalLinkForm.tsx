"use client";

import { useState, useId } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreateExternalLinkForm() {
  const { getToken } = useAuth();

  const fileInputId = useId();

  const [form, setForm] = useState({ title: "", url: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/links/admin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, image: imageUrl }),
      }
    );

    if (res.ok) {
      alert("Link criado com sucesso!");
      setForm({ title: "", url: "" });
      setFile(null);
    } else {
      alert("Erro ao criar link");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="title" className="py-2">
          Título
        </Label>
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Nome do site ou link"
          required
        />
      </div>

      <div>
        <Label htmlFor="url" className="py-2">
          URL do Site
        </Label>
        <Input
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="https://exemplo.com"
          required
        />
      </div>

      <div>
        <Label htmlFor={fileInputId} className="py-2 block">
          Imagem (até 2MB)
        </Label>
        <input
          id={fileInputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="hidden"
        />
        <label
          htmlFor={fileInputId}
          className="cursor-pointer inline-block bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 active:scale-95 transition"
        >
          Selecionar Imagem
        </label>
        {file && (
          <p className="text-sm text-gray-600 mt-1">
            Arquivo selecionado: {file.name}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full py-2" disabled={uploading}>
        {uploading ? "Enviando imagem..." : "Criar Link"}
      </Button>
    </form>
  );
}
