import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Default to English, can be extended for RTL support later
  const locale = "en";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
