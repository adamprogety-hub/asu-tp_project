"use client";

import React, { useState, useMemo } from "react";
import { Check, ChevronDown, Upload, Paperclip, X, ArrowRight, Radio, Clock3 } from "lucide-react";
import { useTrack } from "../hooks/useTrack";
import { PrivacyLink } from "../app/CookieConsent";

function LeadForm({ compact = false }: { compact?: boolean }) {
  const { track } = useTrack();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [contact, setContact] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [honeypot, setHoneypot] = useState("");

  const isValidContact = useMemo(() => {
    if (!contact) return false;
    const digitsCount = contact.replace(/\D/g, "").length;
    const isPhone = contact.startsWith("+7") && digitsCount === 11;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    return isPhone || isEmail;
  }, [contact]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isPhoneLike = /^[+0-9(]/.test(value);

    if (isPhoneLike) {
      const digits = value.replace(/\D/g, "");
      let number = digits;
      if (number.startsWith("7") || number.startsWith("8")) {
        number = number.substring(1);
      }
      number = number.substring(0, 10);

      let formatted = "";
      if (digits.length > 0) {
        formatted = "+7";
      }
      if (number.length > 0) {
        formatted += " (" + number.substring(0, 3);
      }
      if (number.length >= 4) {
        formatted += ") " + number.substring(3, 6);
      }
      if (number.length >= 7) {
        formatted += "-" + number.substring(6, 8);
      }
      if (number.length >= 9) {
        formatted += "-" + number.substring(8, 10);
      }
      setContact(formatted);
    } else {
      setContact(value);
    }
    if (errorMsg) setErrorMsg("");
  };

  const addFiles = (incoming: FileList | File[]) =>
    setFiles((current) => {
      const merged = [...current, ...Array.from(incoming)].filter(
        (file, index, all) =>
          all.findIndex(
            (item) => item.name === file.name && item.size === file.size,
          ) === index,
      );
      return merged.slice(0, 10);
    });

  const fileSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${Math.max(1, Math.round(bytes / 1024))} КБ`
      : `${(bytes / 1024 / 1024).toFixed(1)} МБ`;

  return (
    <form
      className={`lead-form ${compact ? "compact" : ""}`}
      onSubmit={async (e) => {
        e.preventDefault();
        if (honeypot) return;

        setErrorMsg("");
        setSending(true);
        try {
          const formData = new FormData(e.currentTarget);
          files.forEach((file) => {
            formData.append("files", file);
          });

          const response = await fetch("/api/send-lead", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            setSent(true);
            const isEmail = contact.includes('@');
            const descRaw  = (formData.get('description') as string | null) ?? '';
            const descLen  = descRaw.trim().length;
            const descBucket = descLen === 0 ? 'empty'
                             : descLen < 60  ? 'short'
                             : descLen < 200 ? 'medium'
                             :                'long';

            const objectType  = (formData.get('objectType') as string | null) ?? '';
            const unitsRaw    = (formData.get('unitsCount') as string | null) ?? '';
            const unitsCount  = unitsRaw ? parseInt(unitsRaw, 10) : null;
            const fileExts = files
              .map(f => f.name.split('.').pop()?.toLowerCase() ?? 'unknown')
              .filter((v, i, a) => a.indexOf(v) === i)
              .join(',');

            track('lead_form_submit', {
              contact_type:     isEmail ? 'email' : 'phone',
              form_type:        compact ? 'compact' : 'full',
              object_type:      objectType || 'not_selected',
              units_count:      unitsCount,
              description:      descBucket,
              files_count:      files.length,
              file_types:       fileExts || 'none',
            });
            setFiles([]);
          } else {
            const data = await response.json().catch(() => ({}));
            setErrorMsg(data.error || "Не удалось отправить заявку. Попробуйте позже.");
          }
        } catch (error) {
          console.error("Submit error:", error);
          setErrorMsg("Произошла ошибка при отправке. Проверьте интернет-соединение.");
        } finally {
          setSending(false);
        }
      }}
    >
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <div className="field-grid">
        <label>
          <span>Ваше имя</span>
          <input required name="name" placeholder="Как к вам обращаться?" />
        </label>
        <label>
          <span>Телефон или почта</span>
          <input
            required
            name="contact"
            value={contact}
            onChange={handleContactChange}
            placeholder="+7 999 000 00 00 или name@company.ru"
            className={isValidContact ? "valid-input" : ""}
          />
        </label>
        {!compact && (
          <label>
            <span>Тип объекта</span>
            <div className="select-control">
              <select defaultValue="" name="objectType">
                <option value="" disabled>
                  Выберите объект
                </option>
                <option>Бизнес-центр</option>
                <option>Торговый объект</option>
                <option>Мedicинский центр</option>
                <option>Гостиница</option>
                <option>Склад / производство</option>
                <option>Другое</option>
              </select>
              <ChevronDown aria-hidden="true" />
            </div>
          </label>
        )}
        {!compact && (
          <label>
            <span>Количество установок</span>
            <input type="number" min="1" name="unitsCount" placeholder="Например, 8" />
          </label>
        )}
      </div>
      {!compact && (
        <label className="wide-field">
          <span>Коротко о задаче</span>
          <textarea name="description" placeholder="Что нужно объединить и контролировать?" />
        </label>
      )}
      {!compact && (
        <div className="file-upload-block">
          <label
            className="file-drop"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addFiles(event.dataTransfer.files);
            }}
          >
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.dwg,.dxf,.zip,.rar,.7z,.txt"
              onChange={(event) =>
                event.target.files && addFiles(event.target.files)
              }
            />
            <i>
              <Upload />
            </i>
            <span>
              <strong>Приложить файлы</strong>
              <small>Перетащите сюда или выберите на устройстве</small>
            </span>
            <b>до 10 файлов</b>
          </label>
          {files.length > 0 && (
            <div className="file-list" aria-label="Выбранные файлы">
              {files.map((file) => (
                <div className="file-chip" key={`${file.name}-${file.size}`}>
                  <Paperclip />
                  <span>
                    <strong>{file.name}</strong>
                    <small>{fileSize(file.size)}</small>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFiles((current) =>
                        current.filter((item) => item !== file),
                      )
                    }
                    aria-label={`Удалить ${file.name}`}
                  >
                    <X />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="form-consents">
        <label className="consent-check">
          <input type="checkbox" required />
          <i>
            <Check />
          </i>
          <span>
            Я даю согласие на обработку персональных данных и принимаю{" "}
            <PrivacyLink>Политику конфиденциальности</PrivacyLink>.
          </span>
        </label>
        <label className="consent-check optional">
          <input type="checkbox" />
          <i>
            <Check />
          </i>
          <span>
            Согласен получать полезные материалы и информацию о решениях acengine.ru.
            Необязательно.
          </span>
        </label>
      </div>
      <button className="button dark wide" type="submit" disabled={sending || sent}>
        {sent ? (
          <>
            <Check size={18} /> Отправлено! Свяжемся в течение 2 часов
          </>
        ) : sending ? (
          <>
            Отправка...
          </>
        ) : (
          <>
            Получить предварительную концепцию <ArrowRight size={18} />
          </>
        )}
      </button>

      {errorMsg && (
        <p className="form-error-msg">
          {errorMsg}
        </p>
      )}

      <p style={{ marginTop: "10px" }}>
        {sent
          ? "Мы свяжемся с вами в течение 2 часов для уточнения деталей."
          : "PDF, фото, документы, таблицы, архивы и CAD-файлы. До 10 файлов. Нажимая кнопку, вы соглашаетесь с обработкой данных."}
      </p>
    </form>
  );
}

export default function LeadFormSection() {
  return (
    <section className="contact section stack-panel panel-blue layer-9" id="contact">
      <div className="contact-shell">
        <svg className="contact-ribbons" viewBox="0 0 1200 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="ct-rb1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="30%" stopColor="white" stopOpacity="0.08" />
              <stop offset="50%" stopColor="white" stopOpacity="0.13" />
              <stop offset="70%" stopColor="white" stopOpacity="0.08" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ct-rb2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="40%" stopColor="white" stopOpacity="0.05" />
              <stop offset="60%" stopColor="white" stopOpacity="0.08" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M -30,60 C 80,120  200,300 340,295 C 460,290 520,200 620,205 C 720,210 800,360 940,365 C 1040,369 1120,310 1230,340 L 1230,398 C 1120,368 1040,427 940,423 C 800,418 720,268 620,263 C 520,258 460,348 340,353 C 200,358 80,178 -30,118 Z"
            fill="url(#ct-rb1)"
          />
          <path
            d="M -30,-20 C 100,40  260,180 400,175 C 520,170 580,80  680,78 C 800,76  920,160 1230,130 L 1230,178 C 920,208 800,124 680,126 C 580,128 520,218 400,223 C 260,228 100,88 -30,28 Z"
            fill="url(#ct-rb2)"
          />
        </svg>
        <div className="contact-copy">
          <span className="section-tag light">/ Предварительная концепция</span>
          <h2>
            Подключить вентиляцию
            <br />
            объекта
            <br />
            <span className="title-accent">к диспетчеризации</span>
          </h2>
          <p>
            Вы общаетесь напрямую со мной — я и проектирую решение, и сам участвую в запуске на объекте.
          </p>
          <div className="contact-meta">
            <span>
              <Radio /> Ответ в течение рабочего дня
            </span>
            <span>
              <Clock3 /> Первый разбор — бесплатно
            </span>
          </div>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
