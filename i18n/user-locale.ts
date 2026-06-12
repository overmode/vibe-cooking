import "server-only";

import { cookies, headers } from "next/headers";
import { type Locale, LOCALE_COOKIE, isLocale, resolveLocale } from "./locale";

// Locale precedence: explicit cookie override → Accept-Language → default.
export async function getUserLocale(): Promise<Locale> {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;
  return resolveLocale((await headers()).get("accept-language"));
}
