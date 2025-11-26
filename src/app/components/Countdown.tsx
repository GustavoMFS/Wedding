"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownSplitFade() {
  const { getMessages } = useLanguage();
  const messages = getMessages("countdown");

  const eventDate = new Date("2026-06-20T16:30:00").getTime();

  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = eventDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <section className="text-center my-10 px-4">
      <h2 className="text-xl md:text-xl font-[cinzel] font-semibold mb-6">
        {messages.daysToGo}
      </h2>

      <article className="flex font-[cinzelb] flex-wrap justify-center gap-6 md:gap-10">
        <SplitFadeUnit value={timeLeft.days} label={messages.days} />
        <SplitFadeUnit value={timeLeft.hours} label={messages.hours} />
        <SplitFadeUnit value={timeLeft.minutes} label={messages.minutes} />
        <SplitFadeUnit value={timeLeft.seconds} label={messages.seconds} />
      </article>
    </section>
  );
}

function SplitFadeUnit({ value, label }: { value: number; label: string }) {
  const previous = useRef(value);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    if (previous.current !== value) {
      setAnim(true);
      const timer = setTimeout(() => setAnim(false), 500);
      previous.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <span
          key={value}
          className="
            font-[cinzelb] text-4xl md:text-4xl 
            transition-opacity duration-300
          "
        >
          {value}
        </span>
        {anim && (
          <>
            <span
              className="
                absolute top-0 left-0 right-0 overflow-hidden
                h-1/2 opacity-0 animate-splitTop
                font-[cinzelb] text-4xl md:text-6xl
              "
            >
              {previous.current}
            </span>

            <span
              className="
                absolute bottom-0 left-0 right-0 overflow-hidden
                h-1/2 opacity-0 animate-splitBottom
                font-[cinzelb] text-4xl md:text-6xl
              "
            >
              {previous.current}
            </span>
          </>
        )}
      </div>

      <span className="text-xs md:text-sm font-light uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  );
}
