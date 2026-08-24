import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import ScadaCarousel from "./ScadaCarousel";

export default function HeroServer() {
  return (
    <section className="hero" id="top">
      <div className="hero-orb one" />
      <div className="hero-orb two" />
      <div className="hero-equipment" aria-hidden="true">
        <div className="equipment-piece cabinet">
          <Image
            src="/images/hero/control-cabinet.webp"
            alt=""
            width={520}
            height={420}
            priority
            quality={85}
          />
        </div>
        <div className="equipment-piece industrial-fan">
          <Image
            src="/images/hero/industrial-fan.webp"
            alt=""
            width={420}
            height={360}
            priority
            quality={85}
          />
        </div>
      </div>

      <div className="hero-copy-scroll">
        <div className="hero-copy">
          <div
            className="hero-labels"
            aria-label="SCADA и HVAC для коммерческих объектов"
          >
            <span className="hero-label primary">SCADA / HVAC</span>
            <span className="hero-label secondary">
              SCADA · АСУ ТП · Диспетчеризация
            </span>
          </div>
          <h1>
            Диспетчеризация
            <br />
            вентиляции — <span className="title-accent">в одном</span>
            <br />
            интерфейсе
          </h1>
          <p>
            Объединяю установки, существующую автоматику, SCADA, архивы и
            аварийные уведомления в систему, которой удобно пользоваться каждый
            день.
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
