import { useTranslation } from "react-i18next";
import { enGB, de, fr, nl, et, sv } from "date-fns/locale";
import type { Locale } from "date-fns";

const languageLocaleMap: Record<string, Locale> = {
  en: enGB,
  de,
  fr,
  nl,
  et,
  se: sv,
};

type UseLocaleDateReturn = {
  locale: Locale;
};

const useLocaleDate = (): UseLocaleDateReturn => {
  const { i18n } = useTranslation();

  const locale: Locale = languageLocaleMap[i18n.language] || de;

  return { locale };
};

export default useLocaleDate;
