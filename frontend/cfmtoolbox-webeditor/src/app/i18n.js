// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationDE from "./locales/de/translation.json";
import translationEN from "./locales/en/translation.json";

const resources = {
  en: { translation: translationEN },
  de: { translation: translationDE },
};

const browserLang = navigator.language.split("-")[0]; // "de" aus "de-DE"
console.log("Detected browser language:", navigator.language);

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: resources[browserLang] ? browserLang : "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
