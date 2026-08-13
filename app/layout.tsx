import type { Metadata } from "next";
import { Manrope, Onest } from "next/font/google";
import "./globals.css";
import { CookieConsent, PrivacyModal } from "./CookieConsent";
import Script from "next/script";

const onest = Onest({ variable: "--font-onest", subsets: ["cyrillic", "latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["cyrillic", "latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://acengine.ru"),
  title: "acengine.ru — диспетчеризация вентиляции",
  description: "Проектирование и внедрение систем диспетчеризации вентиляции коммерческих объектов: SCADA, архивы, аварии и удалённый контроль.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
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
    <html lang="ru" className={`${onest.variable} ${manrope.variable}`}>

      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Pre-establish connection to Yandex Metrika CDN */}
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />

        {/* Critical inline CSS for instant above-the-fold render (eliminates 740ms render blocking penalty) */}
        <style id="critical-css" dangerouslySetInnerHTML={{ __html: `
          :root {
            --ink: #101312;
            --muted: #6e7470;
            --line: #dfe2de;
            --paper: #f5f6f3;
            --blue: #b9dff1;
            --blue-2: #dff2fa;
            --acid: #c8f251;
            --dark: #141716;
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
            font-size: clamp(32px, 5.5vw, 68px);
            line-height: 1.08;
            letter-spacing: -0.03em;
            font-family: var(--font-manrope);
            font-weight: 800;
            margin: 0 0 var(--spacing-md);
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
