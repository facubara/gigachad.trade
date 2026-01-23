import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "GIGACHAD | The Path to $1B",
  description: "Track the GIGACHAD token journey to $1 billion market cap.",
  keywords: ["GIGACHAD", "Solana", "meme coin", "crypto"],
  openGraph: {
    title: "GIGACHAD | The Path to $1B",
    description: "Track the GIGACHAD token journey to $1 billion market cap.",
    url: "https://gigachad.trade",
    siteName: "GIGACHAD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GIGACHAD | The Path to $1B",
    description: "Track the GIGACHAD token journey to $1 billion market cap.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
