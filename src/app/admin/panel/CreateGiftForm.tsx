"use client";

import { useState, useId } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CreateGiftForm() {
  const { getToken } = useAuth();

  const fileInputId = useId();

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    const isCheckbox = type === "checkbox";

    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      paymentType: value,
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
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
      alert("Erro ao enviar imagem.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.value < 0.5) {
      alert("O valor do presente deve ser no mínimo R$ 0,50.");
      return;
    }

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
      alert("Erro ao criar presente.");
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
          required
        />
      </div>

      <div>
        <Label htmlFor="description" className="py-2">
          Descrição
        </Label>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Digite uma descrição opcional"
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

      <Input
        type="number"
        name="value"
        value={form.value}
        onChange={handleChange}
        min={0.5}
        step="0.01"
        required
      />

      <div>
        <Label className="py-2">
          Opção de valor fixo ou livre (permite que o usuário altere o valor)
        </Label>
        <Select onValueChange={handleSelectChange} value={form.paymentType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Valor fechado</SelectItem>
            <SelectItem value="partial">Valor livre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={uploading}>
        {uploading ? "Enviando imagem..." : "Criar Presente"}
      </Button>
    </form>
  );
}
