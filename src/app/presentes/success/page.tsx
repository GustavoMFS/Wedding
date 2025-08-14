import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        Pagamento concluído!
      </h1>
      <p className="mt-4 text-lg">Obrigado pela sua contribuição 💖</p>
      <Link
        href="/presentes"
        className="inline-block mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Voltar para lista de presentes
      </Link>
    </div>
  );
}
