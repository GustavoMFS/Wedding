"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Guest {
  name: string;
  tags?: string;
  isAdult: boolean;
}

interface FormData {
  identifier: string;
  email?: string;
  phone?: string;
  guests: Guest[];
}

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export const AddInviteModal = ({ onClose, onCreated }: Props) => {
  const { register, control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      identifier: "",
      email: "",
      phone: "",
      guests: [{ name: "", tags: "", isAdult: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests",
  });

  const { getToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken({ template: "backend-access" });

      const resInvite = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            identifier: data.identifier,
            email: data.email,
            phone: data.phone,
          }),
        }
      );

      if (!resInvite.ok) throw new Error("Falha ao criar convite");

      const invite = await resInvite.json();

      for (const guest of data.guests) {
        const resGuest = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invites/${invite._id}/guests`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: guest.name,
              tags: guest.tags
                ? guest.tags.split(",").map((t) => t.trim())
                : [],
              isAdult: guest.isAdult,
            }),
          }
        );

        if (!resGuest.ok)
          throw new Error("Falha ao criar um ou mais convidados");
      }

      reset();
      onCreated();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado ao criar convite");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]"
      >
        {/* Botão de fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
          disabled={loading}
          aria-label="Fechar modal"
        >
          ✕
        </button>

        {/* Título */}
        <header>
          <h2 className="text-2xl font-bold mb-4">Adicionar Novo Convite</h2>
        </header>

        {/* Erros */}
        {error && (
          <div role="alert" className="mb-4 text-red-600 font-semibold">
            {error}
          </div>
        )}

        {/* Dados do Convite */}
        <section
          aria-labelledby="dados-convite"
          className="mb-6 space-y-4 bg-gray-100 p-4 rounded-lg"
        >
          <h3 id="dados-convite" className="sr-only">
            Dados do Convite
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="identifier" className="block mb-1 font-medium">
                Identificação *
              </label>
              <Input
                id="identifier"
                {...register("identifier", { required: true })}
                disabled={loading}
                className="pt-2"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={loading}
                className="pt-2"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1 font-medium">
                Telefone
              </label>
              <Input
                id="phone"
                {...register("phone")}
                disabled={loading}
                className="pt-2"
              />
            </div>
          </div>
        </section>

        {/* Convidados */}
        <section aria-labelledby="convidados-section" className="mb-6">
          <header className="flex justify-between items-center mb-2">
            <h3 id="convidados-section" className="text-xl font-semibold">
              Convidados
            </h3>
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1 text-sm"
              onClick={() => append({ name: "", tags: "", isAdult: true })}
              disabled={loading}
            >
              + Adicionar convidado
            </Button>
          </header>

          <ul className="space-y-4">
            {fields.map((field, idx) => (
              <li
                key={field.id}
                className="bg-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Convidado {idx + 1}</span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(idx)}
                      className="text-red-600 border-red-400 hover:bg-red-50"
                      disabled={loading}
                    >
                      Remover
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`guest-name-${idx}`}
                      className="block font-medium mb-1"
                    >
                      Nome completo *
                    </label>
                    <Input
                      id={`guest-name-${idx}`}
                      {...register(`guests.${idx}.name`, { required: true })}
                      disabled={loading}
                      className="pt-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`guest-tags-${idx}`}
                      className="block font-medium mb-1"
                    >
                      Tags (separadas por vírgula)
                    </label>
                    <Input
                      id={`guest-tags-${idx}`}
                      {...register(`guests.${idx}.tags`)}
                      disabled={loading}
                      className="pt-2"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id={`isAdult-${idx}`}
                      {...register(`guests.${idx}.isAdult`)}
                      defaultChecked={field.isAdult}
                      disabled={loading}
                    />
                    <label
                      htmlFor={`isAdult-${idx}`}
                      className="font-medium text-sm"
                    >
                      Adulto
                    </label>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Ações */}
        <footer className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto py-2 px-4"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto py-2 px-4 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Criar Convite"}
          </Button>
        </footer>
      </form>
    </div>
  );
};
