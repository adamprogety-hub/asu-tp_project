"use client";

import { useCallback, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedMiniScada, scadaSlides } from "./AnimatedMiniScada";
import BrandStar from "./BrandStar";

export default function ScadaCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const move = useCallback((next: number) => {
    const normalized = (next + 7) % 7;
    setDirection(next > active || (active === 6 && normalized === 0) ? 1 : -1);
    setActive(normalized);
  }, [active]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => move((active + 1) % 7), 6000);
    return () => window.clearInterval(id);
  }, [active, move, paused]);

  return (
    <div
      className="scada-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="scada-stage">
        <AnimatedMiniScada variant={active} direction={direction} />
      </div>
      <div className="carousel-controls">
        <div className="carousel-caption">
          <span>{String(active + 1).padStart(2, "0")} / 07</span>
          <div>
            <strong>{scadaSlides[active][0]}</strong>
            <small>{scadaSlides[active][1]}</small>
          </div>
        </div>
        <div className="carousel-dots">
          {scadaSlides.map((slide, i) => (
            <button
              key={slide[0]}
              className={active === i ? "active" : ""}
              onClick={() => move(i)}
              aria-label={`Показать: ${slide[0]}`}
            >
              <BrandStar size={10} />
            </button>
          ))}
        </div>
        <div className="carousel-arrows">
          <button
            onClick={() => move(active - 1)}
            aria-label="Предыдущая мнемосхема"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => move(active + 1)}
            aria-label="Следующая мнемосхема"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
