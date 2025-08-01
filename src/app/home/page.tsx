"use client";

import { GuestProtectedPage } from "../components/GuestProtectedPage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GuestLayout from "../components/GuestLayout";

export default function HomePage() {
  const router = useRouter();

  return (
    <GuestProtectedPage>
      <GuestLayout>
        <>
          <main className="bg-pink-50">
            {/* Hero section */}
            <section className="text-center py-10" id="inicio">
              <figure>
                <Image
                  src="/couple.jpg"
                  alt="Foto dos noivos"
                  width={300}
                  height={300}
                  className="mx-auto rounded-2xl shadow-md object-cover"
                />
                <figcaption className="sr-only">Foto dos noivos</figcaption>
              </figure>
              <h2 className="text-3xl font-bold mt-4">Gustavo & Maria</h2>
            </section>

            {/* Introduction */}
            <section className="text-center px-6 max-w-2xl mx-auto">
              <p className="text-lg">
                Estamos muito felizes em compartilhar este momento com você!
                Esperamos que possa estar presente para comemorar esse dia tão
                especial.
              </p>
            </section>

            {/* Divider */}
            <div className="my-10 flex justify-center">
              <Image src="/divisor.png" alt="Divisor" width={400} height={40} />
            </div>

            {/* Details */}
            <section
              className="text-center px-6"
              id="programacao"
              aria-labelledby="details-heading"
            >
              <h3 id="details-heading" className="text-2xl font-semibold mb-2">
                Detalhes da festa
              </h3>
              <p>
                <strong>Data:</strong> 20 de Junho de 2026
              </p>
              <p>
                <strong>Horário:</strong> 16:30
              </p>
            </section>

            {/* Divider */}
            <div className="my-10 flex justify-center">
              <Image src="/divisor.png" alt="Divisor" width={400} height={40} />
            </div>

            {/* Location */}
            <section
              className="text-center px-6"
              id="local"
              aria-labelledby="location-heading"
            >
              <h3 id="location-heading" className="text-2xl font-semibold mb-2">
                Local do Evento
              </h3>
              <p>
                Quintana Gastronomia - Av. do Batel, 1440 - Batel, Curitiba - PR
              </p>
              <div className="mt-4 flex justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.8932263635243!2d-49.287054!3d-25.441833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce3890b564277%3A0x75157260ead42611!2sQuintana%20Gastronomia!5e0!3m2!1spt-BR!2sbr!4v1753971338189!5m2!1spt-BR!2sbr"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full max-w-2xl h-[300px] rounded-lg shadow"
                ></iframe>
              </div>
            </section>

            {/* Divider */}
            <div className="my-10 flex justify-center">
              <Image src="/divisor.png" alt="Divisor" width={400} height={40} />
            </div>

            {/* Gift Section */}
            <section
              className="text-center px-6 pb-10"
              id="presentes"
              aria-labelledby="gifts-heading"
            >
              <h3 id="gifts-heading" className="text-2xl font-semibold mb-2">
                Lista de Presentes
              </h3>
              <p>
                Você pode escolher um presente ou contribuir com qualquer valor.
              </p>
              <button
                onClick={() => router.push("/presentes")}
                className="mt-6 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded"
              >
                Ver Lista de Presentes 🎁
              </button>
            </section>
          </main>
        </>
      </GuestLayout>
    </GuestProtectedPage>
  );
}
