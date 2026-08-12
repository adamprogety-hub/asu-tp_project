import type { Metadata } from "next";
import { Manrope, Onest } from "next/font/google";
import "./globals.css";
import { CookieConsent, PrivacyModal } from "./CookieConsent";
import Script from "next/script";

const onest = Onest({ variable: "--font-onest", subsets: ["cyrillic", "latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["cyrillic", "latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://acengine.ru"),
  title: "acengine.ru — диспетчеризация вентиляции",
  description: "Проектирование и внедрение систем диспетчеризации вентиляции коммерческих объектов: SCADA, архивы, аварии и удалённый контроль.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "acengine.ru — вентиляция под контролем",
    description: "Вся вентиляция объекта в одном понятном интерфейсе.",
    images: [{ url: "/og.jpg", width: 1664, height: 933 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  other: {
    // Resource hints — pre-establish connection to Metrika CDN
    "link-preconnect-metrika": "<link rel='preconnect' href='https://mc.yandex.ru'>",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        {/* Pre-establish connection to Yandex Metrika CDN */}
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
      </head>
      <body className={`${onest.variable} ${manrope.variable}`}>
        {children}
        <CookieConsent />
        <PrivacyModal />

        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111530589', 'ym');

            ym(111530589, 'init', {
              webvisor: true,
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              ecommerce: "dataLayer"
            });
          `}
        </Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/111530589"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
