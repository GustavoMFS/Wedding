"use client";

import { useEffect, useState, useRef } from "react";

interface CardPaymentFormProps {
  value: number;
  giftId: string;
  name: string;
  message?: string;
  onClose?: () => void;
}

type PaymentResult = {
  id: string;
  status: string;
  status_detail?: string;
};

type InstallmentOption = {
  installments: number;
  recommended_message: string;
  installment_amount: number;
  total_amount: number;
};

declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: { locale?: string }) => {
      cardForm: (options: any) => any;
    };
  }
}

export default function CardPaymentForm({
  value,
  giftId,
  name,
  message = "",
  onClose,
}: CardPaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null
  );
  const [installmentsOptions, setInstallmentsOptions] = useState<
    InstallmentOption[]
  >([]);
  const [selectedInstallments, setSelectedInstallments] = useState<number>(1);

  const cardFormRef = useRef<any>(null);
  const mpInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (cardFormRef.current) return;

    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => {
      mpInstanceRef.current = new window.MercadoPago(
        process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!,
        { locale: "pt-BR" }
      );

      cardFormRef.current = mpInstanceRef.current.cardForm({
        amount: value.toString(),
        autoMount: true,
        form: {
          id: "form-checkout",
          cardholderName: { id: "form-checkout__cardholderName" },
          cardholderEmail: { id: "form-checkout__cardholderEmail" },
          cardNumber: { id: "form-checkout__cardNumber" },
          expirationDate: { id: "form-checkout__expirationDate" },
          securityCode: { id: "form-checkout__securityCode" },
          identificationType: { id: "form-checkout__identificationType" },
          identificationNumber: { id: "form-checkout__identificationNumber" },
          issuer: { id: "form-checkout__issuer" },
        },
        callbacks: {
          onSubmit: async (event: Event) => {
            event.preventDefault();
            setLoading(true);

            const token = localStorage.getItem("guestToken");
            if (!token) {
              alert("Token de convidado não encontrado");
              setLoading(false);
              return;
            }

            const formData = cardFormRef.current.getCardFormData();

            // Usa name e message vindos do React, não do form
            if (!name.trim() || !message.trim()) {
              alert("Nome e mensagem são obrigatórios.");
              setLoading(false);
              return;
            }

            const [first_name, ...rest] = formData.cardholderName.split(" ");
            const last_name = rest.join(" ");

            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/mpcard/card-payment`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    giftId,
                    name, // ✅ aqui garantimos que vai enviar
                    message, // ✅ aqui também
                    transaction_amount: value,
                    description: "Presente de casamento",
                    payment_method_id: formData.paymentMethodId,
                    issuer_id: formData.issuerId,
                    token: formData.token,
                    installments: selectedInstallments,
                    payer: {
                      email: formData.cardholderEmail,
                      first_name: first_name || "",
                      last_name: last_name || "",
                      identification: {
                        type: formData.identificationType,
                        number: formData.identificationNumber,
                      },
                    },
                  }),
                }
              );

              const data: PaymentResult = await res.json();
              setPaymentResult(data);

              if (onClose) onClose();
            } catch (err) {
              console.error(err);
              alert("Erro ao processar pagamento");
            } finally {
              setLoading(false);
            }
          },
        },
      });
    };
    document.body.appendChild(script);
  }, [value, name, message, selectedInstallments, giftId, onClose]);

  // Atualiza dinamicamente parcelas
  const handleCardNumberChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const number = e.target.value.replace(/\s+/g, "");
    if (number.length >= 6) {
      const bin = number.substring(0, 6);
      const token = localStorage.getItem("guestToken");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mpcard/installments?amount=${value}&bin=${bin}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setInstallmentsOptions(data[0].payer_costs || []);
        }
      } catch (err) {
        console.error("Erro ao buscar parcelas:", err);
      }
    }
  };

  return (
    <div className="border p-4 rounded space-y-4">
      <form id="form-checkout">
        <div className="space-y-2">
          <input
            type="text"
            id="form-checkout__cardholderName"
            placeholder="Nome impresso no cartão"
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            id="form-checkout__cardholderEmail"
            placeholder="E-mail"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            id="form-checkout__cardNumber"
            placeholder="Número do cartão"
            className="w-full border p-2 rounded"
            onChange={handleCardNumberChange}
          />
          <input
            type="text"
            id="form-checkout__expirationDate"
            placeholder="MM/AA"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            id="form-checkout__securityCode"
            placeholder="CVV"
            className="w-full border p-2 rounded"
          />

          <select
            className="w-full border p-2 rounded"
            value={selectedInstallments}
            onChange={(e) => setSelectedInstallments(Number(e.target.value))}
          >
            {installmentsOptions.length === 0 ? (
              <option value={1}>1x sem juros</option>
            ) : (
              installmentsOptions.map((opt) => (
                <option key={opt.installments} value={opt.installments}>
                  {opt.recommended_message}
                </option>
              ))
            )}
          </select>

          <select id="form-checkout__issuer" hidden></select>
          <select id="form-checkout__identificationType" hidden></select>

          <input
            type="text"
            id="form-checkout__identificationNumber"
            placeholder="Documento (CPF/CNPJ)"
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 mt-4"
        >
          {loading ? "Processando..." : "Pagar com Cartão (Parcelado)"}
        </button>
      </form>

      {paymentResult && (
        <div className="bg-gray-100 p-3 rounded text-sm">
          <p>
            Status:{" "}
            <span className="font-semibold">{paymentResult.status}</span>
          </p>
          <p>ID do Pagamento: {paymentResult.id}</p>
        </div>
      )}
    </div>
  );
}
