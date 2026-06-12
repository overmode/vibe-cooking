"use server";

import { cookies } from "next/headers";
import { type Locale, LOCALE_COOKIE, isLocale } from "./locale";

export async function setUserLocale(locale: Locale): Promise<void> {
  // Server actions are publicly callable, so validate the untrusted argument.
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: true,
  });
}
