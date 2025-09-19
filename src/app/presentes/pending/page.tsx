"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { GuestProtectedPage } from "@/app/components/GuestProtectedPage";
import GuestLayout from "@/app/components/GuestLayout";

export default function PaymentPendingPage() {
  return (
    <GuestProtectedPage>
      <GuestLayout>
        <div className="max-w-xl mx-auto p-8 text-center space-y-6">
          <motion.h1
            className="text-3xl font-bold text-yellow-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Pagamento pendente
          </motion.h1>

          <motion.p
            className="mt-4 text-lg text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            Seu pagamento ainda não foi confirmado. Assim que for aprovado, a
            contribuição será registrada.
          </motion.p>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
          >
            <Link
              href="/presentes"
              className="inline-block bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded shadow-lg hover:from-purple-600 hover:to-indigo-700 transition"
            >
              Voltar à lista de presentes
            </Link>
          </motion.div>
        </div>
      </GuestLayout>
    </GuestProtectedPage>
  );
}
