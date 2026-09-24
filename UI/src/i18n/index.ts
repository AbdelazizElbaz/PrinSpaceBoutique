import { fr, type Dict } from "./dict/fr"
import { ar } from "./dict/ar"
import { en } from "./dict/en"
import type { Locale } from "./config"

const dicts: Record<Locale, Dict> = { fr, ar, en }

export const getDict = (locale: Locale): Dict => dicts[locale] ?? fr
export type { Dict }
export * from "./config"
