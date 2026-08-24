"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BrandStar from "./BrandStar";

const faqs = [
  [
    "Можно подключить существующие шкафы?",
    "Во многих случаях — да. Это зависит от контроллеров, протоколов связи и доступа к программе. Сначала провожу экспресс-аудит и точно отмечаю, что можно сохранить.",
  ],
  [
    "Нужно менять всю автоматику?",
    "Нет. Я проектирую модернизацию точечно: сохраняю исправное оборудование, добавляю модули связи или заменяю только устаревшие компоненты.",
  ],
  [
    "Что будет при отключении интернета?",
    "Локальные контроллеры продолжают автономно выполнять алгоритмы и защиты. Временно недоступным становится только удалённый контроль.",
  ],
  [
    "Можно объединить разных производителей?",
    "Да, если оборудование поддерживает совместимые протоколы или может быть подключено через шлюзы: Modbus, BACnet, OPC UA и другие.",
  ],
  [
    "Можно начать с одной установки?",
    "Да. Пилот на одной-двух установках позволяет проверить архитектуру, интерфейс и экономический эффект перед масштабированием.",
  ],
] as const;

export default function FAQSection() {
  const [faq, setFaq] = useState<number>(-1);

  return (
    <section className="faq section stack-panel panel-white layer-8" id="faq">
      <div className="faq-title">
        <span className="section-tag">/ FAQ</span>
        <h2>Частые вопросы о диспетчеризации вентиляции</h2>
        <p>Коротко о совместимости, отказоустойчивости и формате работы.</p>
      </div>
      <div className="faq-list">
        {faqs.map(([q, a], i) => (
          <div className={`faq-item ${faq === i ? "open" : ""}`} key={q}>
            <button onClick={() => setFaq(faq === i ? -1 : i)}>
              <span>0{i + 1}</span>
              <strong>{q}</strong>
              <BrandStar size={14} className="faq-chevron" />
            </button>
            <AnimatePresence initial={false}>
              {faq === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
