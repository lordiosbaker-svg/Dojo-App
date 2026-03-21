import { useDojoStore } from "@/lib/state/dojo-store";
import { translations } from "./translations";
import type { T } from "./translations";

export function useTranslation(): T {
  const language = useDojoStore((s) => s.language);
  return translations[language] ?? translations.en;
}
