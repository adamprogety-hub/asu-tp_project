import type { Metadata } from "next";
import { Manrope, Onest } from "next/font/google";
import "./globals.css";
import { CookieConsent, PrivacyModal } from "./CookieConsent";
import { Preloader } from "./Preloader";
import { WebVitals } from "../components/WebVitals";
import Script from "next/script";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["cyrillic", "latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["cyrillic", "latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});


export const metadata: Metadata = {
  metadataBase: new URL("https://acengine.ru"),

  // ── Title & Description ──────────────────────────────────────────────────
  title: {
    default: "Диспетчеризация вентиляции коммерческих объектов | acengine.ru",
    template: "%s | acengine.ru",
  },
  description:
    "Проектирование и внедрение SCADA-систем для вентиляции: мониторинг, аварийные уведомления, архив параметров и удалённый контроль. Бизнес-центры, торговые объекты, склады и производства.",

  // ── Canonical ────────────────────────────────────────────────────────────
  alternates: {
    canonical: "https://acengine.ru",
  },

  // ── Keywords ─────────────────────────────────────────────────────────────
  keywords: [
    "диспетчеризация вентиляции",
    "SCADA вентиляция",
    "АСУ ТП вентиляция",
    "мониторинг вентиляции",
    "диспетчеризация систем вентиляции",
    "удалённый контроль вентиляции",
    "диспетчеризация вентиляции бизнес-центр",
    "Modbus BACnet OPC вентиляция",
  ],

  // ── Icons ────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },

  // ── OpenGraph ────────────────────────────────────────────────────────────
  openGraph: {
    title: "Диспетчеризация вентиляции коммерческих объектов — acengine.ru",
    description:
      "SCADA-система для вентиляции: вся инженерия объекта в одном интерфейсе. Аварии, архив, удалённый доступ.",
    url: "https://acengine.ru",
    siteName: "acengine.ru",
    images: [{ url: "/og.jpg", width: 1664, height: 933, alt: "Диспетчеризация вентиляции — acengine.ru" }],
    type: "website",
    locale: "ru_RU",
  },

  // ── Twitter ──────────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Диспетчеризация вентиляции | acengine.ru",
    description: "SCADA-система для вентиляции коммерческих объектов.",
    images: ["/og.jpg"],
  },

  // ── Robots ───────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },

  // ── Geo & other ──────────────────────────────────────────────────────────
  other: {
    "geo.region":    "RU",
    "geo.placename": "Россия",
    "geo.position":  "55.7558;37.6176",
    "ICBM":          "55.7558, 37.6176",
    // Resource hints
    "link-preconnect-metrika": "<link rel='preconnect' href='https://mc.yandex.ru'>",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${onest.variable} ${manrope.variable}`}>

      <head>
      {/* JSON-LD: LocalBusiness — для Knowledge Panel Яндекса и Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://acengine.ru/#business",
              name: "acengine.ru — диспетчеризация вентиляции",
              description:
                "Проектирование и внедрение SCADA-систем для вентиляции коммерческих объектов: мониторинг, аварийные уведомления, архив параметров.",
              url: "https://acengine.ru",
              telephone: "+79958878310",
               email: "info@acengine.ru",
              image: "https://acengine.ru/og.jpg",
              logo: "https://acengine.ru/favicon-512x512.png",
              address: {
                "@type": "PostalAddress",
                addressCountry: "RU",
                addressLocality: "Москва",
              },
              areaServed: {
                "@type": "Country",
                name: "Россия",
              },
              serviceType: "Диспетчеризация систем вентиляции",
              priceRange: "₽₽",
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                opens: "09:00",
                closes: "18:00",
              },
              sameAs: [
                "https://t.me/asphxdel",
              ],
            }),
          }}
        />

        {/* JSON-LD: FAQPage — для FAQ-блока прямо в поисковой выдаче */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Можно подключить существующие шкафы?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Во многих случаях — да. Это зависит от контроллеров, протоколов связи и доступа к программе. Сначала провожу экспресс-аудит и точно отмечаю, что можно сохранить.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Нужно менять всю автоматику?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Нет. Проектирую модернизацию точечно: сохраняю исправное оборудование, добавляю модули связи или заменяю только устаревшие компоненты.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Что будет при отключении интернета?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Локальные контроллеры продолжают автономно выполнять алгоритмы и защиты. Временно недоступным становится только удалённый контроль.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Можно объединить разных производителей?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Да, если оборудование поддерживает совместимые протоколы или может быть подключено через шлюзы: Modbus, BACnet, OPC UA и другие.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Можно начать с одной установки?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Да. Пилот на одной-двух установках позволяет проверить архитектуру, интерфейс и экономический эффект перед масштабированием.",
                  },
                },
              ],
            }),
          }}
        />

        {/* JSON-LD: Person — специалист АСУ ТП */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Павел Петров",
              jobTitle: "Специалист по диспетчеризации вентиляции и АСУ ТП",
              url: "https://acengine.ru",
               email: "info@acengine.ru",
              telephone: "+79958878310",
              sameAs: ["https://t.me/asphxdel"],
              worksFor: {
                "@type": "Organization",
                name: "acengine.ru",
                url: "https://acengine.ru",
              },
            }),
          }}
        />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Pre-establish connection to Yandex Metrika CDN */}
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />

        <style id="critical-css" dangerouslySetInnerHTML={{ __html: `
          :root {
            --ink: #1f2224;
            --muted: #5e6668;
            --line: #d8dcde;
            --paper: #eaecee;
            --blue: #e5d8dc;
            --blue-2: #f5edf0;
            --acid: #8a1c34;
            --acid-light: #b83a52;
            --dark: #191b1d;
            --white: #fff;
            --spacing-xs: 0.5rem;
            --spacing-sm: 1rem;
            --spacing-md: 1.5rem;
            --spacing-lg: 2rem;
            --radius-sm: 8px;
            --radius-md: 12px;
            --radius-lg: 18px;
            --radius-xl: 28px;
          }
          * { box-sizing: border-box; }
          html { scroll-behavior: auto; }
          body {
            margin: 0;
            background: var(--paper);
            color: var(--ink);
            font-family: var(--font-onest), sans-serif;
            overflow-x: hidden;
            line-height: 1.6;
          }
          .hero {
            position: relative;
            min-height: 100vh;
            padding: 120px var(--spacing-md) 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .hero h1 {
            font-size: clamp(48px, 5.8vw, 96px);
            line-height: 1.12;
            letter-spacing: -0.04em;
            font-family: var(--font-manrope);
            font-weight: 440;
            margin: var(--spacing-xs) auto var(--spacing-sm);
          }
          .title-accent {
            font-family: var(--font-manrope);
            font-style: normal;
            font-weight: 320;
            letter-spacing: -0.055em;
          }

          .nav {
            position: fixed;
            z-index: 50;
            left: var(--spacing-md);
            right: var(--spacing-md);
            top: 20px;
            height: 64px;
            padding: 0 var(--spacing-xs) 0 var(--spacing-md);
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.82);
            backdrop-filter: blur(18px);
            border: 1px solid rgba(255, 255, 255, 0.9);
            border-radius: var(--radius-lg);
          }
        ` }} />
      </head>


      <body>
        <Preloader />
        <WebVitals />
        {children}
        <CookieConsent />
        <PrivacyModal />

        {/* Yandex.Metrika counter — lazyOnload defers third-party analytics until idle */}
        <Script id="yandex-metrika" strategy="lazyOnload">

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
