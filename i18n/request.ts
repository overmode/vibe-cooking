import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./user-locale";
import type en from "../messages/en.json";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();
  const messages = (await import(`../messages/${locale}.json`)) as {
    default: typeof en;
  };

  return { locale, messages: messages.default };
});
