"use client";

import { GuestProtectedPage } from "../components/GuestProtectedPage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GuestLayout from "../components/GuestLayout";
import { useLanguage } from "../contexts/LanguageContext";
import "../fonts.css";
import Countdown from "../components/Countdown";

export default function HomePage() {
  const router = useRouter();
  const { getMessages } = useLanguage();
  const messages = getMessages("home");

  const locations = [
    {
      title: messages.eventHeading,
      address:
        "Nossa Senhora da Salette - Rua Lange de Morretes, 533 - Jardim Social, Curitiba - PR",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1071.4061103248766!2d-49.233046367195776!3d-25.41263956011415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce5c5ddef6aff%3A0xeef36102f4ee864!2sInstituto%20Salette!5e0!3m2!1spt-BR!2sbr!4v1759517078514!5m2!1spt-BR!2sbr",
    },
    {
      title: messages.partyHeading,
      address:
        "Quintana Gastronomia - Av. do Batel, 1440 - Batel, Curitiba - PR",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.8932263635243!2d-49.287054!3d-25.441833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce3890b564277%3A0x75157260ead42611!2sQuintana%20Gastronomia!5e0!3m2!1spt-BR!2sbr!4v1753971338189!5m2!1spt-BR!2sbr",
    },
  ];

  return (
    <GuestProtectedPage>
      <GuestLayout>
        <main
          className="relative min-h-screen bg-[#ffffff] bg-absolute bg-cover text-[#385e85] z-0"
          style={{
            backgroundImage: "url('/paper1.jpg')",
            backgroundBlendMode: "multiply",
          }}
        >
          <Image
            src="/flower.png"
            alt=""
            width={600}
            height={600}
            className="hidden md:block pointer-events-none select-none absolute top-0 right-0 mix-blend-normal -z-10 w-[120px] sm:w-[180px] md:w-[260px] lg:w-[320px]"
          />

          <Image
            src="/flower2.png"
            alt=""
            width={600}
            height={600}
            className="hidden md:block pointer-events-none select-none absolute top-1/3 left-0 mix-blend-normal -z-10 w-[100px] sm:w-[160px] md:w-[220px] lg:w-[280px]"
          />

          <Image
            src="/flower.png"
            alt=""
            width={600}
            height={600}
            className="hidden md:block pointer-events-none select-none absolute bottom-0 right-0 mix-blend-normal -z-10 w-[140px] sm:w-[200px] md:w-[280px] lg:w-[350px]"
          />

          <section className="text-center py-10" id="inicio">
            <figure className="flex justify-center px-4 sm:px-0">
              <Image
                src="/couple2.jpg"
                alt={messages.title}
                width={600}
                height={600}
                className="w-full max-w-[500px] sm:max-w-[600px] h-auto rounded-2xl shadow-md object-cover"
              />
            </figure>

            <h2 style={{ fontFamily: "handwriting" }} className="text-9xl mt-6">
              {messages.title}
            </h2>
          </section>

          <section className="text-center px-6 max-w-2xl mx-auto">
            <p className="text-base font-[cinzelb] text-[#000000]">
              {messages.welcomeMessage}
            </p>
          </section>

          <section className="mt-6">
            <Countdown />
          </section>

          <div className="my-10 flex justify-center">
            <Image
              src="/divisorblue.png"
              alt="Divisor"
              width={400}
              height={40}
            />
          </div>

          <section
            className="text-center px-6 max-w-2xl mx-auto"
            id="programacao"
          >
            <h3 className="text-2xl font-[cinzelb] mb-5">
              {messages.detailsHeading}
            </h3>
            <p className="py-1 text-base font-[cinzelb] text-[#000000]">
              {messages.date}
            </p>
            <p className="py-1 text-base font-[cinzelb] text-[#000000]">
              {messages.time}
            </p>
            <p className="py-1 text-base font-[cinzelb] text-[#000000]">
              {messages.partyTime}
            </p>
          </section>

          <div className="my-10 flex justify-center">
            <Image
              src="/divisorblue.png"
              alt="Divisor"
              width={400}
              height={40}
            />
          </div>

          <section className="text-center px-6 max-w-2xl mx-auto" id="regras">
            <h3 className="text-2xl font-[cinzelb] mb-5">
              {messages.dressCodeTitle}
            </h3>
            <p className="py-1 text-base font-[cinzelb] text-[#000000]">
              {messages.dressCode}
            </p>
            <p className="py-1 text-base font-[cinzelb] text-[#000000]">
              {messages.rulesDressing}
            </p>
          </section>

          <div className="my-10 flex justify-center">
            <Image
              src="/divisorblue.png"
              alt="Divisor"
              width={400}
              height={40}
            />
          </div>

          <section className="text-center px-6 max-w-2xl mx-auto" id="regras">
            <h3 className="text-2xl font-[cinzelb] mb-5">
              {messages.rulesHeading}
            </h3>
            <p className="py-1 text-base font-[cinzelb] text-[#000000]">
              {messages.rulesDressing}
            </p>
            <p className="py-2 text-base font-[cinzelb] text-[#000000]">
              {messages.rulesPhotos}
            </p>
            <p className="py-1 text-base font-[cinzelb] text-[#000000]">
              {messages.rulesCerimony}
            </p>
          </section>

          <div className="my-10 flex justify-center">
            <Image
              src="/divisorblue.png"
              alt="Divisor"
              width={400}
              height={40}
            />
          </div>

          {locations.map((loc, index) => (
            <section
              key={index}
              className="text-center px-6 max-w-2xl mx-auto"
              id={index === 0 ? "local" : "festa"}
            >
              <h3 className="text-2xl font-[cinzelb] mb-5">{loc.title}</h3>

              <p className="text-base font-[cinzelb] text-[#000000]">
                {loc.address}
              </p>

              <div className="mt-4 flex justify-center">
                <iframe
                  src={loc.mapUrl}
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full max-w-2xl h-[300px] rounded-lg shadow"
                ></iframe>
              </div>

              <div className="my-10 flex justify-center">
                <Image
                  src="/divisorblue.png"
                  alt="Divisor"
                  width={400}
                  height={40}
                />
              </div>
            </section>
          ))}

          <section
            className="text-center px-6 pb-10 max-w-2xl mx-auto"
            id="presentes"
          >
            <h3 className="text-2xl font-[cinzelb] mb-5">
              {messages.giftsHeading}
            </h3>
            <p className="text-base font-[cinzelb] max-w-xl mx-auto text-[#000000]">
              {messages.giftsMessage}
            </p>
            <button
              onClick={() => router.push("/presentes")}
              className="mt-6 bg-[#385e85] hover:bg-[#0d2946] text-white font-semibold px-6 py-2 rounded"
            >
              {messages.seeGifts}
            </button>
          </section>

          <div className="my-10 flex justify-center">
            <Image
              src="/divisorblue.png"
              alt="Divisor"
              width={400}
              height={40}
            />
          </div>

          <section className="text-center px-6 pb-10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-[cinzelb] mb-5">
              {messages.rsvpHeading}
            </h3>
            <p className="text-base font-[cinzelb] max-w-lg mx-auto text-[#000000]">
              {messages.rsvpMessage}
            </p>
            <button
              onClick={() => router.push("/guest")}
              className="mt-4 bg-[#385e85] hover:bg-[#0d2946] text-white font-semibold px-6 py-2 rounded transition"
            >
              {messages.confirmPresence}
            </button>
          </section>
        </main>
      </GuestLayout>
    </GuestProtectedPage>
  );
}
