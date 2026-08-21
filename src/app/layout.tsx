import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RadioOS - Le système d'exploitation numérique des radios",
    template: "%s | RadioOS",
  },
  description: "Streaming, audience, podcasts, interaction et monétisation réunis dans une seule plateforme pour les radios africaines.",
  keywords: ["radio", "streaming", "podcast", "audio", "afrique", "radio en ligne", "radio en direct"],
  authors: [{ name: "RadioOS" }],
  creator: "RadioOS",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "RadioOS",
    title: "RadioOS - Le système d'exploitation numérique des radios",
    description: "Streaming, audience, podcasts, interaction et monétisation réunis dans une seule plateforme.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RadioOS",
    description: "Le système d'exploitation numérique des radios",
  },
  manifest: "/manifest.json",
  themeColor: "#2563EB",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
