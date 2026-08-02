import type { Metadata } from "next";
import { Manrope, Onest } from "next/font/google";
import "./globals.css";
import { CookieConsent, PrivacyModal } from "./CookieConsent";

const onest = Onest({ variable: "--font-onest", subsets: ["cyrillic", "latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["cyrillic", "latin"] });

export const metadata: Metadata = {
  title: "AERON — диспетчеризация вентиляции",
  description: "Проектирование и внедрение систем диспетчеризации вентиляции коммерческих объектов: SCADA, архивы, аварии и удалённый контроль.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "AERON — вентиляция под контролем",
    description: "Вся вентиляция объекта в одном понятном интерфейсе.",
    images: [{ url: "/og.png", width: 1664, height: 933 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body className={`${onest.variable} ${manrope.variable}`}>{children}<CookieConsent/><PrivacyModal/></body></html>;
}
