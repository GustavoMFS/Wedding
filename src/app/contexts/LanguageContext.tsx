"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ptHome from "../messages/home/pt.json";
import esHome from "../messages/home/es.json";
import ptMenu from "../messages/menu/pt.json";
import esMenu from "../messages/menu/es.json";
import ptGifts from "../messages/gifts/pt.json";
import esGifts from "../messages/gifts/es.json";
import ptGiftDetail from "../messages/giftDetail/pt.json";
import esGiftDetail from "../messages/giftDetail/es.json";
import ptPixPayment from "../messages/pixPayment/pt.json";
import esPixPayment from "../messages/pixPayment/es.json";
import ptGuestConfirmation from "../messages/guestConfirmation/pt.json";
import esGuestConfirmation from "../messages/guestConfirmation/es.json";
import ptFailureScreen from "../messages/afterPaymentPages/failure/pt.json";
import esFailureScreen from "../messages/afterPaymentPages/failure/es.json";
import ptPendingScreen from "../messages/afterPaymentPages/pending/pt.json";
import esPendingScreen from "../messages/afterPaymentPages/pending/es.json";
import ptSuccessScreen from "../messages/afterPaymentPages/success/pt.json";
import esSuccessScreen from "../messages/afterPaymentPages/success/es.json";
import ptGuestQuestions from "../messages/guestConfirmation/guestQuestions/pt.json";
import esGuestQuestions from "../messages/guestConfirmation/guestQuestions/es.json";

type Language = "pt" | "es";
type Module =
  | "home"
  | "menu"
  | "gifts"
  | "giftDetail"
  | "pixPayment"
  | "guestConfirmation"
  | "failureScreen"
  | "pendingScreen"
  | "successScreen"
  | "guestQuestions";

type MessagesMap = {
  [key in Module]: Record<string, string>;
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  getMessages: (module: Module) => Record<string, string>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language | null;
      if (saved === "pt" || saved === "es") return saved;
    }
    return "pt";
  });

  const messagesMap: Record<Language, MessagesMap> = {
    pt: {
      home: ptHome,
      menu: ptMenu,
      gifts: ptGifts,
      giftDetail: ptGiftDetail,
      pixPayment: ptPixPayment,
      guestConfirmation: ptGuestConfirmation,
      failureScreen: ptFailureScreen,
      pendingScreen: ptPendingScreen,
      successScreen: ptSuccessScreen,
      guestQuestions: ptGuestQuestions,
    },
    es: {
      home: esHome,
      menu: esMenu,
      gifts: esGifts,
      giftDetail: esGiftDetail,
      pixPayment: esPixPayment,
      guestConfirmation: esGuestConfirmation,
      failureScreen: esFailureScreen,
      pendingScreen: esPendingScreen,
      successScreen: esSuccessScreen,
      guestQuestions: esGuestQuestions,
    },
  };

  const getMessages = (module: Module) => messagesMap[language][module];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getMessages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
