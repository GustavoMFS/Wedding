"use client";

import { GuestProtectedPage } from "../components/GuestProtectedPage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GuestLayout from "../components/GuestLayout";
import { useLanguage } from "../contexts/LanguageContext";

export default function HomePage() {
  const router = useRouter();
  const { getMessages } = useLanguage();
  const messages = getMessages("home");

  return (
    <GuestProtectedPage>
      <GuestLayout>
        <main className="bg-pink-50">
          <section className="text-center py-10" id="inicio">
            <figure>
              <Image
                src="/couple2.jpg"
                alt={messages.title}
                width={300}
                height={300}
                className="mx-auto rounded-2xl shadow-md object-cover"
              />
              <figcaption className="sr-only">{messages.title}</figcaption>
            </figure>
            <h2 className="text-3xl font-bold mt-4">{messages.title}</h2>
          </section>

          <section className="text-center px-6 max-w-2xl mx-auto">
            <p className="text-lg">{messages.welcomeMessage}</p>
          </section>

          <div className="my-10 flex justify-center">
            <Image src="/divisor.png" alt="Divisor" width={400} height={40} />
          </div>

          <section className="text-center px-6" id="programacao">
            <h3 className="text-2xl font-semibold mb-2">
              {messages.detailsHeading}
            </h3>
            <p className="py-1">
              <strong>{messages.dressCode}</strong>
            </p>
            <p className="py-1">
              <strong>{messages.recomendations}</strong>
            </p>
            <p className="py-1">
              <strong>{messages.date}</strong>
            </p>
            <p className="py-1">
              <strong>{messages.time}</strong>
            </p>
            <p className="py-1">
              <strong>{messages.partyTime}</strong>
            </p>
          </section>

          <div className="my-10 flex justify-center">
            <Image src="/divisor.png" alt="Divisor" width={400} height={40} />
          </div>

          <section className="text-center px-6" id="local">
            <h3 className="text-2xl font-semibold mb-2">
              {messages.eventHeading}
            </h3>
            <p>
              Nossa Senhora da Salette - Rua Lange de Morretes, 533 - Jardim
              Social, Curitiba - PR
            </p>
            <div className="mt-4 flex justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1071.4061103248766!2d-49.233046367195776!3d-25.41263956011415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce5c5ddef6aff%3A0xeef36102f4ee864!2sInstituto%20Salette!5e0!3m2!1spt-BR!2sbr!4v1759517078514!5m2!1spt-BR!2sbr"
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

          <div className="my-10 flex justify-center">
            <Image src="/divisor.png" alt="Divisor" width={400} height={40} />
          </div>

          <section className="text-center px-6" id="local">
            <h3 className="text-2xl font-semibold mb-2">
              {messages.partyHeading}
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

          <div className="my-10 flex justify-center">
            <Image src="/divisor.png" alt="Divisor" width={400} height={40} />
          </div>

          <section className="text-center px-6 pb-10" id="presentes">
            <h3 className="text-2xl font-semibold mb-2">
              {messages.giftsHeading}
            </h3>
            <p>{messages.giftsMessage}</p>
            <button
              onClick={() => router.push("/presentes")}
              className="mt-6 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded"
            >
              {messages.seeGifts}
            </button>
          </section>

          <div className="my-10 flex justify-center">
            <Image src="/divisor.png" alt="Divisor" width={400} height={40} />
          </div>

          <section className="text-center px-6 pb-10">
            <h3 className="text-2xl font-semibold mb-2">
              {messages.rsvpHeading}
            </h3>
            <p>{messages.rsvpMessage}</p>
            <button
              onClick={() => router.push("/guest")}
              className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded transition"
            >
              {messages.confirmPresence}
            </button>
          </section>
        </main>
      </GuestLayout>
    </GuestProtectedPage>
  );
}
