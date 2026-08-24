"use client";

import { AnimatePresence, motion } from "motion/react";

export const scadaSlides = [
  ["Обзор объекта", "Все установки и ключевые показатели"],
  ["Приточная установка", "Полная технологическая цепочка ПВ-01"],
  ["Климатические зоны", "Температура и CO₂ по помещениям"],
  ["Энергопотребление", "Нагрузка и потенциал экономии"],
  ["Аварии и события", "Приоритеты и время реакции"],
  ["Тепловой контур", "Насосы, клапаны и теплообменник"],
  ["Сеть объектов", "Филиалы и каналы связи"],
] as const;

export function StatusDot({ tone = "ok" }: { tone?: "ok" | "warn" }) {
  return <span className={`status-dot ${tone}`} />;
}

export function AnimatedMiniScada({
  variant,
  direction,
}: {
  variant: number;
  direction: number;
}) {
  return (
    <div className={`scada-shell animated-scada variant-${variant}`}>
      <div className="scada-top">
        <div>
          <span className="window-dot" />
          <span className="window-dot" />
          <span className="window-dot" />
        </div>
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={variant}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.38 }}
          >
            Центр управления / {scadaSlides[variant][0]}
          </motion.span>
        </AnimatePresence>
        <span className="live">
          <StatusDot /> LIVE
        </span>
      </div>
      <div className="scada-body image-only">
        <div className="scada-scene-stack">
          <AnimatePresence initial={false} mode="sync" custom={direction}>
            <motion.img
              key={variant}
              src={`/images/scada-slides/slide-0${variant + 1}.webp`}
              alt={scadaSlides[variant][0]}
              className="scada-slide-img scada-scene-layer"
              initial={{ opacity: 0, x: direction * 50, scale: 0.88 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction * -18, scale: 0.97 }}
              transition={{
                duration: 0.72,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </AnimatePresence>
        </div>
      </div>
      <motion.div
        className={`airflow-sweep ${direction < 0 ? "reverse" : ""}`}
        key={`air-${variant}`}
        initial={{ x: direction > 0 ? "-180%" : "480%", opacity: 0 }}
        animate={{
          x: direction > 0 ? "480%" : "-180%",
          opacity: [0, 0.9, 0.72, 0],
        }}
        transition={{
          duration: 1.08,
          times: [0, 0.18, 0.72, 1],
          ease: [0.32, 0, 0.18, 1],
        }}
        aria-hidden="true"
      />
    </div>
  );
}
