"use client";

import { useRef, type MouseEvent } from "react";
import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const steps = [
  [
    "01",
    "Обследование",
    "Фиксирую состав установок, контроллеры, сигналы и каналы связи.",
    "30 000",
  ],
  [
    "02",
    "Архитектура",
    "Согласуем экраны, аварии, права, уведомления и хранение данных.",
    "60 000",
  ],
  [
    "03",
    "Проектирование",
    "Готовлю схемы, перечни сигналов, спецификации и алгоритмы.",
    "100 000",
  ],
  [
    "04",
    "Автоматика",
    "Подключаю существующие шкафы или модернизирую то, чего не хватает.",
    "175 000",
  ],
  [
    "05",
    "SCADA",
    "Создаю мнемосхемы, архивы, графики и удалённый доступ.",
    "150 000",
  ],
  [
    "06",
    "ПНР и передача",
    "Проверяю сценарии на объекте и передаю исходники, схемы и резервные копии.",
    "100 000",
  ],
] as const;

function ProcessCard({
  step,
  index,
  progress,
  reduceMotion,
  scrollToSection,
}: {
  step: (typeof steps)[number];
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
  scrollToSection: (id: string, event?: MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
}) {
  const position = useTransform(
    progress,
    (value) => index - value * (steps.length - 1),
  );
  const x = useTransform(position, (delta) => {
    if (reduceMotion) return 0;
    if (delta < 0) return `${Math.max(-124, delta * 124)}%`;
    return Math.min(delta, 3) * 28;
  });
  const rotate = useTransform(position, (delta) => {
    if (reduceMotion || delta <= 0) return 0;
    return Math.min(delta, 3) * (index % 2 === 0 ? -1.15 : 1.15);
  });
  const opacity = useTransform(position, (delta) => {
    if (reduceMotion || delta >= -0.28) return 1;
    if (delta <= -1.04) return 0;
    const progressVal = (delta + 1.04) / 0.76;
    return progressVal * progressVal * (3 - 2 * progressVal);
  });
  const [number, title, text, price] = step;

  return (
    <motion.article
      className={`process-card${number === "05" ? " accent" : ""}`}
      style={{ x, rotate, opacity, zIndex: steps.length - index }}
    >
      <div className="process-card-layout">
        <div className="process-card-left">
          <div className="process-card-top">
            <span>{number} / 06</span>
            <span>{number === "05" ? "Ключевой этап" : "Полный цикл"}</span>
          </div>
          <div className="process-card-copy">
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
          <div className="process-card-footer">
            <div className="process-price">
              <small>Стоимость</small>
              <strong>от {price} ₽</strong>
            </div>
            <a className="process-cta" href="#contact" onClick={(e) => scrollToSection("#contact", e)}>
              Обсудить задачу <ArrowRight size={18} />
            </a>
          </div>
        </div>
        <div className="process-card-icon-zone" aria-hidden="true">
          <Image
            src={`/images/process-slides/step-${number}.webp`}
            alt={title}
            fill
            className="process-card-step-img"
            sizes="(max-width: 768px) 100vw, 40vw"
            style={{ objectFit: "cover" }}
            priority={index < 2}
            loading={index >= 2 ? "lazy" : undefined}
          />
        </div>
      </div>
    </motion.article>
  );
}

function ProcessSegment({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const fillValue = useTransform(progress, (value) =>
    Math.max(0, Math.min(1, value * (steps.length - 1) - index + 1)),
  );
  const starFill = useTransform(fillValue, [0, 0.5, 1], ["#d9ddda", "#101312", "#101312"]);
  const starScale = useTransform(fillValue, [0, 0.5, 1], [0.75, 1.1, 1]);

  return (
    <span className="process-segment">
      <b>{String(index + 1).padStart(2, "0")}</b>
      <motion.svg
        className="process-star"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ scale: starScale }}
        aria-hidden="true"
      >
        <motion.path
          d="M50 5 C50 5, 56 38, 62 44 C68 50, 95 50, 95 50 C95 50, 68 50, 62 56 C56 62, 50 95, 50 95 C50 95, 44 62, 38 56 C32 50, 5 50, 5 50 C5 50, 32 50, 38 44 C44 38, 50 5, 50 5 Z"
          style={{ fill: starFill }}
        />
      </motion.svg>
    </span>
  );
}

interface ProcessFlowProps {
  scrollToSection: (id: string, event?: MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
}

export default function ProcessFlow({ scrollToSection }: ProcessFlowProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const deckProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section className="process-runway" id="process" ref={ref}>
      <div className="process process-sticky stack-panel panel-paper layer-4">
        <div className="section-heading split">
          <div>
            <span className="section-tag">/ Полный цикл</span>
            <h2>Полный технический контур SCADA-проекта</h2>
          </div>
          <p>
            Шесть последовательных этапов — от первого сигнала в шкафу до
            готового экрана диспетчерской.
          </p>
        </div>
        <div className="process-deck" aria-label="Этапы и стоимость работ">
          {steps.map((step, index) => (
            <ProcessCard
              key={step[0]}
              step={step}
              index={index}
              progress={deckProgress}
              reduceMotion={reduceMotion}
              scrollToSection={scrollToSection}
            />
          ))}
        </div>
        <div className="process-pagination" aria-hidden="true">
          {steps.map((step, index) => (
            <ProcessSegment
              key={step[0]}
              index={index}
              progress={deckProgress}
            />
          ))}
          <span className="process-scroll-hint">Листайте вниз</span>
        </div>
        <p className="process-note">
          Ориентировочная стоимость типового стартового объёма. Оборудование,
          лицензии и выезды рассчитываются отдельно.
        </p>
      </div>
    </section>
  );
}
