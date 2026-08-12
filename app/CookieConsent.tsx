"use client";

import { useEffect, useState } from "react";
import { Check, ChevronRight, Settings2, X } from "lucide-react";

const STORAGE_KEY = "aeron-cookie-consent";
const MAX_AGE = 365 * 24 * 60 * 60 * 1000;

type CookieChoice = { analytics: boolean; savedAt: number };

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
    else {
      try {
        const choice = JSON.parse(saved) as CookieChoice;
        if (Date.now() - choice.savedAt > MAX_AGE) setVisible(true);
        else {
          setAnalytics(Boolean(choice.analytics));
          document.documentElement.dataset.analyticsConsent = choice.analytics ? "granted" : "denied";
        }
      } catch { setVisible(true); }
    }
    const openSettings = () => { setSettings(true); setVisible(true); };
    window.addEventListener("aeron:cookie-settings", openSettings);
    return () => window.removeEventListener("aeron:cookie-settings", openSettings);
  }, []);

  const save = (allowAnalytics: boolean) => {
    const choice: CookieChoice = { analytics: allowAnalytics, savedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
    document.documentElement.dataset.analyticsConsent = allowAnalytics ? "granted" : "denied";
    setAnalytics(allowAnalytics);
    setVisible(false);
    setSettings(false);
  };

  if (!visible) return null;

  return <div className="cookie-layer" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
    <div className="cookie-card">
      <div className="cookie-copy">
        <span className="cookie-kicker">Ваш выбор важен</span>
        <h2 id="cookie-title">Настройки файлов cookie</h2>
        <p>Мы используем необходимые технологии для работы сайта. Аналитика включается только с вашего согласия. Подробнее — в <PrivacyLink>политике конфиденциальности</PrivacyLink>.</p>
      </div>
      {settings && <div className="cookie-options">
        <div><span><b>Необходимые</b><small>Сохраняют ваш выбор и обеспечивают базовую работу сайта.</small></span><span className="cookie-fixed"><Check/> Всегда активны</span></div>
        <label><span><b>Аналитические</b><small>Помогают анонимно оценивать посещаемость и улучшать интерфейс.</small></span><input type="checkbox" checked={analytics} onChange={(e)=>setAnalytics(e.target.checked)}/><i/></label>
      </div>}
      <div className="cookie-actions">
        {!settings && <button type="button" className="cookie-settings" onClick={()=>setSettings(true)}><Settings2/> Настроить</button>}
        {settings && <button type="button" className="cookie-settings" onClick={()=>save(analytics)}>Сохранить выбор</button>}
        <button type="button" className="cookie-essential" onClick={()=>save(false)}>Только необходимые</button>
        <button type="button" className="cookie-accept" onClick={()=>save(true)}>Разрешить все <ChevronRight/></button>
      </div>
    </div>
  </div>;
}

export function CookieSettingsButton() {
  return <button className="footer-privacy-button" type="button" onClick={()=>window.dispatchEvent(new Event("aeron:cookie-settings"))}>Настройки cookie</button>;
}

export function PrivacyLink({ children = "Политика конфиденциальности", className = "" }: { children?: React.ReactNode; className?: string }) {
  return <button className={`privacy-link ${className}`} type="button" onClick={(event)=>{event.stopPropagation();window.dispatchEvent(new Event("aeron:privacy"));}}>{children}</button>;
}

const policySections = [
  ["01", "Общие положения", "Настоящая Политика определяет порядок обработки и защиты персональных данных посетителей сайта acengine.ru. Оператор обрабатывает данные законно, добросовестно и только для заранее определённых целей."],
  ["02", "Какие данные обрабатываются", "Через формы могут собираться имя, компания, телефон или Telegram, тип объекта, количество установок, описание задачи и приложенные пользователем материалы. Автоматически могут обрабатываться IP-адрес, тип устройства и браузера, время посещения, источник перехода и выбранные настройки cookie."],
  ["03", "Цели и основания", "Данные используются для ответа на обращение, подготовки предварительной концепции, оценки проекта, организации демонстрации и дальнейшей деловой коммуникации. Основное основание — согласие пользователя, выраженное отдельным действием перед отправкой формы."],
  ["04", "Порядок и сроки", "Обработка выполняется автоматизированно и без использования средств автоматизации. Данные хранятся до достижения заявленной цели, отзыва согласия либо окончания срока, предусмотренного применимым законодательством, после чего удаляются или обезличиваются."],
  ["05", "Передача и защита", "Оператор не продаёт персональные данные. Передача техническим подрядчикам допускается только в объёме, необходимом для работы сайта, связи с пользователем или исполнения договора. Применяются организационные и технические меры ограничения доступа и защиты информации."],
  ["06", "Права пользователя", "Пользователь вправе запросить сведения об обработке, уточнение, блокирование или удаление данных, а также отозвать согласие через форму связи на сайте. Отзыв не влияет на законность обработки, выполненной до его получения."],
  ["07", "Файлы cookie", "Необходимые технологии обеспечивают работу сайта и сохраняют выбранный режим конфиденциальности. Аналитические технологии включаются только после отдельного согласия. Выбор хранится до 12 месяцев и может быть изменён кнопкой «Настройки cookie» в подвале."],
  ["08", "Изменение политики", "Политика обновляется при изменении процессов обработки или требований законодательства. Дата последнего обновления: 3 августа 2026 года."],
] as const;

export function PrivacyModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = () => setOpen(true);
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("aeron:privacy", show);
    window.addEventListener("keydown", closeOnEscape);
    return () => { window.removeEventListener("aeron:privacy", show); window.removeEventListener("keydown", closeOnEscape); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    return () => {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      if (top) {
        window.scrollTo({ top: parseInt(top || "0") * -1, behavior: "instant" as unknown as ScrollBehavior });
      }
    };
  }, [open]);
  if (!open) return null;
  return <div className="privacy-modal-layer" role="dialog" aria-modal="true" aria-labelledby="privacy-title" onClick={()=>setOpen(false)}>
    <div className="privacy-modal" onClick={(event)=>event.stopPropagation()}>
      <header><div><span>Правовая информация · Редакция 03.08.2026</span><h2 id="privacy-title">Политика конфиденциальности</h2><p>Обработка персональных данных и использование файлов cookie на сайте acengine.ru.</p></div><button type="button" onClick={()=>setOpen(false)} aria-label="Закрыть политику"><X/></button></header>
      <div className="privacy-modal-body">
        <div className="privacy-operator"><strong>Реквизиты оператора перед публикацией</strong><p>Необходимо указать полное наименование ИП или юридического лица, ИНН, юридический адрес и рабочий email. Сейчас оператор обозначен как владелец сайта acengine.ru.</p></div>
        {policySections.map(([number,title,text])=><section key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p>{number==="07"&&<div className="modal-cookie-table"><div><b>Необходимые</b><span>Работа сайта и хранение выбора</span><small>до 12 месяцев</small></div><div><b>Аналитические</b><span>Анонимная статистика, если подключена</span><small>после согласия</small></div></div>}</div></section>)}
      </div>
      <footer><span>acengine.ru · Диспетчеризация вентиляции</span></footer>
    </div>
  </div>;
}
