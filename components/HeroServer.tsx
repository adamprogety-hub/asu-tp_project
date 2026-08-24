import { ArrowRight, Play } from "lucide-react";
import ScadaCarousel from "./ScadaCarousel";

export default function HeroServer() {
  return (
    <section className="hero" id="top">
      <div className="hero-orb one" />
      <div className="hero-orb two" />
      <div className="hero-equipment" aria-hidden="true">
        <div className="equipment-piece cabinet">
          <img
            src="/images/hero/control-cabinet.webp"
            alt=""
            width={520}
            height={420}
          />
        </div>
        <div className="equipment-piece industrial-fan">
          <img
            src="/images/hero/industrial-fan.webp"
            alt=""
            width={420}
            height={360}
          />
        </div>
      </div>

      <div className="hero-copy-scroll">
        <div className="hero-copy">
          <div
            className="hero-labels"
            aria-label="Автоматизация и диспетчеризация HVAC"
          >
            <span className="hero-label primary">Павел Петров</span>
            <span className="hero-label secondary">
              АСУ ТП · SCADA · Диспетчеризация
            </span>
          </div>
          <h1>
            Автоматизация
            <br />
            и <span className="title-accent">диспетчеризация</span>
            <br />
            полного цикла
          </h1>
          <p>
            Полный цикл разработки АСУ ТП от проекта до пусконаладки. Перевожу
            сложные вентиляционные системы объектов в один удобный
            SCADA-интерфейс.
          </p>
          <div className="hero-actions">
            <a className="button dark" href="#contact">
              Получить решение <ArrowRight size={18} />
            </a>
            <a className="button outline" href="#cases">
              <Play
                size={14}
                fill="currentColor"
                strokeWidth={0}
                style={{ transform: "translateX(1px)" }}
              />{" "}
              Что уже выполнено
            </a>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <ScadaCarousel />
      </div>
      <div className="hero-ticker">
        <span>MasterSCADA 4D</span>
        <i />
        <span>Trace Mode 6</span>
        <i />
        <span>КРУГ-2000</span>
        <i />
        <span>IntraScada</span>
      </div>
    </section>
  );
}
