"use client";

import {
  type MouseEvent,
  type ReactNode,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { CookieSettingsButton, PrivacyLink } from "./CookieConsent";
import { AcEngineLogo } from "./AcEngineLogo";
import SplitText from "../components/SplitText";
import TypingText from "../components/TypingText";
import { useTrack } from "../hooks/useTrack";
import { LeadMagnet } from "./LeadMagnet";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bell,
  BellRing,
  BookOpen,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CircleGauge,
  Clock3,
  Database,
  EyeOff,
  Fan,
  Factory,
  FileStack,
  Flame,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Paperclip,
  Phone,
  Play,
  Plus,
  Radio,
  Send,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Thermometer,
  Unlink,
  Upload,
  User,
  Wifi,
  WifiOff,
  X,
  Zap,
} from "lucide-react";

const benefits = [
  [
    "01",
    "Единая картина",
    "Собираю все установки, режимы и активные аварии объекта в один экран.",
    CircleGauge,
  ],
  [
    "02",
    "Аварии сразу",
    "Настраиваю уведомления так, чтобы ответственный узнал об аварии раньше, чем кто-то пожалуется.",
    BellRing,
  ],
  [
    "03",
    "Диагностика удалённо",
    "Причину остановки вижу удалённо: датчики, приводы, журнал событий — всё доступно без выезда на объект.",
    Wifi,
  ],
  [
    "04",
    "История объекта",
    "Настраиваю архивирование так, чтобы каждый параметр, событие и действие оператора можно было поднять в любой момент.",
    Activity,
  ],
] as const;

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

const scenarios = [
  {
    label: "SCADA и диспетчеризация",
    title: "Платформы мониторинга",
    text: "Создаю мнемосхемы, аварийную сигнализацию, архивы, тренды, отчёты и удалённый доступ. Выбор платформы зависит от масштаба объекта, требований заказчика и уже установленного оборудования.",
    brands: "MasterSCADA 4D · Simple-Scada · Rapid SCADA · TRACE MODE · WinCC",
    stat: "5+",
    meta: "популярных систем",
  },
  {
    label: "Контроллеры",
    title: "Программируемая логика",
    text: "Программирую новые контроллеры, подключаю готовую локальную автоматику и модернизирую действующие шкафы без необязательной замены исправного оборудования.",
    brands: "Segnetics · ОВЕН · Wiren Board · CAREL · Siemens · Schneider Electric",
    stat: "6+",
    meta: "основных брендов",
  },
  {
    label: "Полевое оборудование",
    title: "Периферия и автоматика",
    text: "Интегрирую частотные преобразователи, приводы клапанов и заслонок, датчики температуры и давления, счётчики и исполнительные механизмы.",
    brands: "Belimo · Danfoss · ОВЕН · Delta · INNOVERT · VEDA",
    stat: "6+",
    meta: "лидирующих вендоров",
  },
  {
    label: "Протоколы интеграции",
    title: "Промышленные сети",
    text: "Объединяю оборудование разных производителей в одном интерфейсе и предусматриваю возможность дальнейшего расширения системы.",
    brands: "Modbus RTU/TCP · BACnet/IP · OPC UA/DA · MQTT · RS-485 · Ethernet",
    stat: "6+",
    meta: "стандартов связи",
  },
] as const;

const caseStudies = [
  {
    meta: "Бизнес-центр · 18 400 м² · Москва",
    title: ["42 установки.", "Один центр контроля."],
    text: "Застал объект с разрозненными панелями и ручным обходом. Собрал единую SCADA, настроил архивы и Telegram-уведомления для дежурной службы.",
    metrics: [
      ["648", "параметров"],
      ["37", "типов аварий"],
      ["8", "экранов"],
    ],
    variant: 0,
  },
  {
    meta: "Офисный комплекс · 8 200 м² · Санкт-Петербург",
    title: ["12 установок.", "Точный климат по этажам."],
    text: "Связал приточные системы общими алгоритмами и единым расписанием. Теперь дежурный видит всю технологическую цепочку каждой установки с одного экрана.",
    metrics: [
      ["214", "сигналов"],
      ["9", "алгоритмов"],
      ["3", "экрана"],
    ],
    variant: 1,
  },
  {
    meta: "Медицинский центр · 11 600 м² · Казань",
    title: ["26 зон.", "Воздух под контролем."],
    text: "Настроил контроль температуры и CO₂ по каждому помещению отдельно. Отклонения автоматически попадают в журнал — я вижу проблему раньше, чем кто-то успеет пожаловаться.",
    metrics: [
      ["26", "климатических зон"],
      ["52", "датчика"],
      ["4", "уровня доступа"],
    ],
    variant: 2,
  },
  {
    meta: "Гостиничный комплекс · 21 000 м² · Сочи",
    title: ["−18% энергии.", "Без потери комфорта."],
    text: "Через аналитику обнаружил одновременный нагрев и охлаждение, лишние ночные режимы и завышенную производительность вентиляторов. Исправил — минус 18%.",
    metrics: [
      ["5.4", "МВт·ч экономии"],
      ["−18%", "за месяц"],
      ["24/7", "аналитика"],
    ],
    variant: 3,
  },
  {
    meta: "Логистический центр · 36 000 м² · Подмосковье",
    title: ["Авария видна", "раньше жалобы."],
    text: "Разделил события по приоритетам и настроил автоматическую маршрутизацию на дежурную смену. Эскалация срабатывает, если сигнал не подтвердили вовремя.",
    metrics: [
      ["4:12", "средняя реакция"],
      ["37", "сценариев аварий"],
      ["3", "канала связи"],
    ],
    variant: 4,
  },
  {
    meta: "Торговый центр · 47 500 м² · Екатеринбург",
    title: ["412 кВт.", "Тепло под контролем."],
    text: "Собрал насосы, клапаны и теплообменник в единый контур с общей логикой. Теперь диспетчер видит давление, температуры и фактическую нагрузку в реальном времени.",
    metrics: [
      ["2.8", "bar давление"],
      ["15.5°", "дельта контура"],
      ["74%", "нагрузка"],
    ],
    variant: 5,
  },
  {
    meta: "Розничная сеть · 4 объекта · Москва",
    title: ["4 объекта.", "Одна диспетчерская."],
    text: "Объединил четыре филиала защищёнными каналами связи в единую диспетчерскую. Центральная служба видит все установки, аварии и доступность каждого объекта.",
    metrics: [
      ["38", "установок"],
      ["99.98%", "доступность"],
      ["1", "центр контроля"],
    ],
    variant: 6,
  },
] as const;

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

/** Base reveal — opacity + translateY only, safe in sticky contexts */
const reveal = {
  initial:     { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
} as const;

/** Stagger container */
const staggerContainer = {
  initial:     {},
  whileInView: {},
  viewport:    { once: true, margin: "-60px" },
  variants: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  },
  initial2: "hidden",
  animate:  "visible",
} as const;

/** Stagger item — no scale, no blur */
const staggerItem = {
  variants: {
    hidden:  { opacity: 0, y: 24 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  },
} as const;

/** Slide from left */
const slideLeft = {
  initial:     { opacity: 0, x: -36 },
  whileInView: { opacity: 1, x: 0   },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
} as const;

/** Slide from right */
const slideRight = {
  initial:     { opacity: 0, x: 36 },
  whileInView: { opacity: 1, x: 0  },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
} as const;


function StatusDot({ tone = "ok" }: { tone?: "ok" | "warn" }) {
  return <span className={`status-dot ${tone}`} />;
}

const scadaSlides = [
  ["Обзор объекта", "Все установки и ключевые показатели"],
  ["Приточная установка", "Полная технологическая цепочка ПВ-01"],
  ["Климатические зоны", "Температура и CO₂ по помещениям"],
  ["Энергопотребление", "Нагрузка и потенциал экономии"],
  ["Аварии и события", "Приоритеты и время реакции"],
  ["Тепловой контур", "Насосы, клапаны и теплообменник"],
  ["Сеть объектов", "Филиалы и каналы связи"],
] as const;

function OverviewScene() {
  return (
    <>
      <div className="scada-headline">
        <div>
          <small>Сейчас</small>
          <strong>Объект работает штатно</strong>
        </div>
        <span>03 августа · 14:28</span>
      </div>
      <div className="metric-row">
        <div>
          <span>В работе</span>
          <strong>07</strong>
          <i>из 8 установок</i>
        </div>
        <div>
          <span>Температура</span>
          <strong>21.8°</strong>
          <i>среднее значение</i>
        </div>
        <div>
          <span>Энергия</span>
          <strong>−18%</strong>
          <i>за этот месяц</i>
        </div>
      </div>
      <div className="system-map">
        <div className="unit-card unit-main">
          <span>
            <StatusDot /> ПВ-01
          </span>
          <Fan className="spinning" size={42} />
          <strong>Приточная</strong>
          <small>48.2 Hz · 22.4 °C</small>
        </div>
        <div className="air-line">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="room-card">
          <Thermometer size={22} />
          <strong>Зона A</strong>
          <span>22.1 °C</span>
          <small>CO₂ 612 ppm</small>
        </div>
      </div>
      <div className="chart-card">
        <div className="chart-title">
          <span>Температура притока</span>
          <b>Последние 24 часа</b>
        </div>
        <div className="chart">
          <svg
            viewBox="0 0 600 90"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#a9d9f0" stopOpacity=".6" />
                <stop offset="1" stopColor="#a9d9f0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className="area"
              d="M0,67 C70,54 90,61 135,45 S220,37 270,43 S350,24 400,36 S500,25 600,15 L600,90 L0,90Z"
            />
            <path d="M0,67 C70,54 90,61 135,45 S220,37 270,43 S350,24 400,36 S500,25 600,15" />
          </svg>
        </div>
      </div>
    </>
  );
}

function ScadaScene({ variant }: { variant: number }) {
  if (variant === 0) return <OverviewScene />;
  if (variant === 1)
    return (
      <>
        <div className="scada-headline">
          <div>
            <small>ПВ-01 · Автоматический режим</small>
            <strong>Приточная установка</strong>
          </div>
          <span>
            <StatusDot /> Все защиты активны
          </span>
        </div>
        <div className="metric-row">
          <div>
            <span>Приток</span>
            <strong>8 420</strong>
            <i>м³/ч</i>
          </div>
          <div>
            <span>Частота</span>
            <strong>48.2</strong>
            <i>Hz</i>
          </div>
          <div>
            <span>Уставка</span>
            <strong>22.0°</strong>
            <i>факт 22.4 °C</i>
          </div>
        </div>
        <div className="tech-flow">
          <div className="flow-node">
            <small>Наружный воздух</small>
            <strong>−3.2°</strong>
            <span>RH 78%</span>
          </div>
          <div className="flow-pipe">
            <i />
          </div>
          <div className="flow-node icon-node">
            <SlidersHorizontal />
            <strong>Фильтр</strong>
            <span>68%</span>
          </div>
          <div className="flow-pipe">
            <i />
          </div>
          <div className="flow-node icon-node hot">
            <Flame />
            <strong>Нагрев</strong>
            <span>62%</span>
          </div>
          <div className="flow-pipe">
            <i />
          </div>
          <div className="flow-node icon-node">
            <Fan className="spinning" />
            <strong>Вентилятор</strong>
            <span>48.2 Hz</span>
          </div>
          <div className="flow-pipe">
            <i />
          </div>
          <div className="flow-node">
            <small>Приточный воздух</small>
            <strong>22.4°</strong>
            <span>8 420 м³/ч</span>
          </div>
        </div>
        <div className="micro-panels">
          <div>
            <b>Клапан теплоносителя</b>
            <span className="mini-track">
              <i style={{ width: "62%" }} />
            </span>
            <small>62%</small>
          </div>
          <div>
            <b>Перепад фильтра</b>
            <span className="mini-track">
              <i style={{ width: "38%" }} />
            </span>
            <small>184 Pa</small>
          </div>
        </div>
      </>
    );
  if (variant === 2)
    return (
      <>
        <div className="scada-headline">
          <div>
            <small>Бизнес-центр · 4 этажа</small>
            <strong>Климатические зоны</strong>
          </div>
          <span>18 зон · 16 в норме</span>
        </div>
        <div className="zone-layout">
          <div className="floor-stack">
            {[4, 3, 2, 1].map((floor) => (
              <div key={floor}>
                <b>0{floor}</b>
                <span className={floor === 3 ? "zone-warn" : ""} />
                <span />
                <span />
                <span />
              </div>
            ))}
          </div>
          <div className="zone-grid">
            {[
              ["A-401", "22.1°", "612"],
              ["A-402", "21.8°", "580"],
              ["B-301", "24.6°", "980"],
              ["B-302", "22.3°", "640"],
              ["C-201", "21.9°", "704"],
              ["C-202", "22.0°", "618"],
            ].map((z, i) => (
              <div className={i === 2 ? "warn" : ""} key={z[0]}>
                <span>
                  <StatusDot tone={i === 2 ? "warn" : "ok"} />
                  {z[0]}
                </span>
                <strong>{z[1]}</strong>
                <small>CO₂ {z[2]} ppm</small>
              </div>
            ))}
          </div>
        </div>
        <div className="micro-panels compact-panels">
          <div>
            <b>Средняя температура</b>
            <strong>22.2 °C</strong>
          </div>
          <div>
            <b>Качество воздуха</b>
            <strong>92%</strong>
          </div>
          <div>
            <b>Отклонения</b>
            <strong>02</strong>
          </div>
        </div>
      </>
    );
  if (variant === 3)
    return (
      <>
        <div className="scada-headline">
          <div>
            <small>Аналитика · Август</small>
            <strong>Энергопотребление</strong>
          </div>
          <span>Экономия к базовой линии 18%</span>
        </div>
        <div className="energy-layout">
          <div className="energy-chart">
            <div className="energy-y">
              <span>120</span>
              <span>80</span>
              <span>40</span>
              <span>0</span>
            </div>
            <div className="energy-bars">
              {[62, 76, 54, 88, 68, 51, 64, 72, 48, 59, 44, 53].map((h, i) => (
                <i
                  key={i}
                  style={{ height: `${h}%` }}
                  className={i > 8 ? "saved" : ""}
                />
              ))}
            </div>
            <div className="base-line">Базовая линия</div>
          </div>
          <div className="energy-summary">
            <small>Сегодня</small>
            <strong>842</strong>
            <span>кВт·ч</span>
            <div>
              Прогноз месяца <b>24.8 МВт·ч</b>
            </div>
            <div>
              Сэкономлено <b>5.4 МВт·ч</b>
            </div>
          </div>
        </div>
        <div className="equipment-load">
          {[
            ["Вентиляторы", "42%"],
            ["Нагрев", "31%"],
            ["Охлаждение", "18%"],
            ["Прочее", "9%"],
          ].map((x, i) => (
            <div key={x[0]}>
              <i className={`load-c${i}`} />
              <span>{x[0]}</span>
              <b>{x[1]}</b>
            </div>
          ))}
        </div>
      </>
    );
  if (variant === 4)
    return (
      <>
        <div className="scada-headline">
          <div>
            <small>Журнал · Последние 24 часа</small>
            <strong>Аварии и события</strong>
          </div>
          <span>Среднее время реакции 4:12</span>
        </div>
        <div className="alarm-layout">
          <div className="alarm-ring">
            <div>
              <strong>03</strong>
              <span>активные</span>
            </div>
          </div>
          <div className="alarm-list">
            {[
              ["Критическая", "ВУ-04 · Нет связи с контроллером", "13:54"],
              ["Внимание", "ПВ-08 · Фильтр загрязнён на 82%", "14:26"],
              ["Внимание", "ПВ-06 · Температура выше уставки", "12:48"],
              ["Событие", "ПВ-01 · Запуск по расписанию", "09:00"],
            ].map((x, i) => (
              <div key={x[1]} className={i === 0 ? "critical" : ""}>
                <i />
                <span>
                  <b>{x[0]}</b>
                  <small>{x[1]}</small>
                </span>
                <time>{x[2]}</time>
              </div>
            ))}
          </div>
        </div>
        <div className="alarm-footer">
          <span>
            <Check /> 24 события подтверждено
          </span>
          <span>
            <BellRing /> Telegram-канал активен
          </span>
          <span>
            <Clock3 /> Эскалация через 10 мин
          </span>
        </div>
      </>
    );
  if (variant === 5)
    return (
      <>
        <div className="scada-headline">
          <div>
            <small>Контур К1 · Автоматический режим</small>
            <strong>Тепловой контур</strong>
          </div>
          <span>
            <StatusDot /> Давление стабильно
          </span>
        </div>
        <div className="hydro-scheme">
          <div className="hydro-source">
            <Flame />
            <b>Теплообменник</b>
            <strong>68.4 °C</strong>
          </div>
          <div className="hydro-line supply">
            <i />
            <span>Подача 64.2 °C</span>
          </div>
          <div className="hydro-load">
            <Factory />
            <b>Калориферы</b>
            <strong>412 kW</strong>
          </div>
          <div className="hydro-line return">
            <i />
            <span>Обратка 48.7 °C</span>
          </div>
          <div className="pump">
            <Fan className="spinning" />
            <span>Н-01</span>
            <b>42.8 Hz</b>
          </div>
          <div className="valve">
            <SlidersHorizontal />
            <span>Клапан</span>
            <b>62%</b>
          </div>
        </div>
        <div className="metric-row hydro-metrics">
          <div>
            <span>Давление</span>
            <strong>2.8 bar</strong>
            <i>норма</i>
          </div>
          <div>
            <span>ΔT контура</span>
            <strong>15.5 °C</strong>
            <i>расчёт 16 °C</i>
          </div>
          <div>
            <span>Мощность</span>
            <strong>412 kW</strong>
            <i>нагрузка 74%</i>
          </div>
        </div>
      </>
    );
  return (
    <>
      <div className="scada-headline">
        <div>
          <small>Распределённая система</small>
          <strong>Сеть объектов</strong>
        </div>
        <span>4 объекта · 38 установок</span>
      </div>
      <div className="network-map">
        <div className="network-core">
          <Server />
          <strong>AC ENGINE CLOUD</strong>
          <span>OPC UA / VPN</span>
        </div>
        {[
          ["Москва", "12 установок", "ok", "n1"],
          ["Химки", "8 установок", "ok", "n2"],
          ["Подольск", "10 установок", "warn", "n3"],
          ["Одинцово", "8 установок", "ok", "n4"],
        ].map((n) => (
          <div className={`site-node ${n[3]}`} key={n[0]}>
            <MapPin />
            <span>
              <b>{n[0]}</b>
              <small>{n[1]}</small>
            </span>
            <StatusDot tone={n[2] === "warn" ? "warn" : "ok"} />
          </div>
        ))}
      </div>
      <div className="network-footer">
        <span>
          <Wifi /> Каналы связи защищены
        </span>
        <span>
          <Activity /> 99.98% доступность
        </span>
        <span>
          <BellRing /> 1 предупреждение
        </span>
      </div>
    </>
  );
}

function MiniScada({ variant = 0 }: { variant?: number }) {
  return (
    <div className={`scada-shell variant-${variant}`}>
      <div className="scada-top">
        <div>
          <span className="window-dot" />
          <span className="window-dot" />
          <span className="window-dot" />
        </div>
        <span>Центр управления / {scadaSlides[variant][0]}</span>
        <span className="live">
          <StatusDot /> LIVE
        </span>
      </div>
      <div className="scada-body image-only">
        <img
          src={`/images/scada-slides/slide-0${variant + 1}.webp`}
          alt={scadaSlides[variant][0]}
          className="scada-slide-img"
        />
      </div>
    </div>
  );
}

function AnimatedMiniScada({
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
              // Z-parallax: enters from side + approaches from viewer (scale 0.88→1)
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

function ScadaCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const move = (next: number) => {
    const normalized = (next + 7) % 7;
    setDirection(next > active || (active === 6 && normalized === 0) ? 1 : -1);
    setActive(normalized);
  };
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => move((active + 1) % 7), 6000);
    return () => window.clearInterval(id);
  }, [active, paused]);
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

function LeadForm({ compact = false }: { compact?: boolean }) {
  const { track } = useTrack();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [contact, setContact] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  // Honeypot: боты заполняют скрытые поля — мы их игнорируем
  const [honeypot, setHoneypot] = useState("");

  const isValidContact = useMemo(() => {
    if (!contact) return false;
    // Для телефона: должно быть ровно 11 цифр (+7 и 10 цифр номера)
    const digitsCount = contact.replace(/\D/g, "").length;
    const isPhone = contact.startsWith("+7") && digitsCount === 11;
    // Для почты: базовая проверка на формат email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    return isPhone || isEmail;
  }, [contact]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Если начинается с цифры, плюса или скобки — расцениваем как попытку ввести телефон
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
      // Иначе разрешаем свободный ввод букв (для email)
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
            // ── Track lead submission (обезличено — никаких личных данных) ──
            const isEmail = contact.includes('@');

            // Длина описания: только бакет, не текст
            const descRaw  = (formData.get('description') as string | null) ?? '';
            const descLen  = descRaw.trim().length;
            const descBucket = descLen === 0 ? 'empty'
                             : descLen < 60  ? 'short'   // 1-60 символов
                             : descLen < 200 ? 'medium'  // 61-200
                             :                'long';    // 201+

            // Тип объекта из дропдауна — не персональные данные
            const objectType  = (formData.get('objectType') as string | null) ?? '';
            const unitsRaw    = (formData.get('unitsCount') as string | null) ?? '';
            const unitsCount  = unitsRaw ? parseInt(unitsRaw, 10) : null;

            // Расширения файлов — без имён файлов
            const fileExts = files
              .map(f => f.name.split('.').pop()?.toLowerCase() ?? 'unknown')
              .filter((v, i, a) => a.indexOf(v) === i)  // уникальные
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
      {/* ── Honeypot (скрыто от людей, видно ботам) ── */}
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

const contactLinks = {
  telegram: "https://t.me/PetrovEngineering",
};

const contactPhone = {
  label: "+7 995 887-83-10",
  href: "tel:+79958878310",
};

function getFloatingNavigationTargets() {
  const hero = document.querySelector<HTMLElement>(".hero");
  const panels = Array.from(
    document.querySelectorAll<HTMLElement>(".stack-panel"),
  );
  const panelTargets = panels.map((panel) => {
    const runway = panel.closest<HTMLElement>(".process-runway");
    if (runway) return runway;

    const slot = panel.closest<HTMLElement>(".stack-slot");
    if (slot && slot.getBoundingClientRect().height > 1) return slot;
    return panel;
  });
  const uniqueTargets = Array.from(new Set(panelTargets));
  return hero ? [hero, ...uniqueTargets] : uniqueTargets;
}

function getCurrentNavigationIndex(targets: HTMLElement[]) {
  const marker = window.scrollY + 16;
  let currentIndex = 0;
  targets.forEach((target, index) => {
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    if (targetTop <= marker) currentIndex = index;
  });
  return currentIndex;
}

function FloatingActions({ visible, menuOpen }: { visible: boolean; menuOpen: boolean }) {
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [onDarkBackground, setOnDarkBackground] = useState(false);
  const [hasNextSection, setHasNextSection] = useState(true);
  const actionsRef = useRef<HTMLDivElement>(null);
  const navigationLocked = useRef(false);

  useEffect(() => {
    if (!visible) {
      setSocialsOpen(false);
      setPhoneOpen(false);
    }
  }, [visible]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSocialsOpen(false);
        setPhoneOpen(false);
      }
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setSocialsOpen(false);
        setPhoneOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const detectBackground = () => {
      frame = 0;
      const targets = getFloatingNavigationTargets();
      setHasNextSection(
        getCurrentNavigationIndex(targets) < targets.length - 1,
      );
      const x = Math.max(1, window.innerWidth - 52);
      const y = Math.max(1, window.innerHeight - 52);
      const underneath = document
        .elementsFromPoint(x, y)
        .filter((element) => !element.closest(".floating-actions"));
      const activePanel = underneath
        .map((element) => element.closest<HTMLElement>(".stack-panel, .hero"))
        .find((element): element is HTMLElement => Boolean(element));

      if (activePanel) {
        setOnDarkBackground(
          activePanel.matches(".footer-dark, .problem-section"),
        );
        return;
      }

      const background = underneath
        .map((element) => getComputedStyle(element).backgroundColor)
        .map((color) =>
          color.match(
            /rgba?\((\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)(?:[, /]+(\d+(?:\.\d+)?))?\)/,
          ),
        )
        .find(
          (match) =>
            match && (match[4] === undefined || Number(match[4]) > 0.1),
        );

      if (background) {
        const [, red, green, blue] = background;
        const luminance =
          (0.2126 * Number(red) +
            0.7152 * Number(green) +
            0.0722 * Number(blue)) /
          255;
        setOnDarkBackground(luminance < 0.46);
      }
    };
    // Throttle: run detectBackground every 4th scroll event.
    // elementsFromPoint + getComputedStyle force layout — 75% reduction in cost.
    // 4 frames ≈ 67ms at 60fps — imperceptible for a nav colour change.
    let scrollTick = 0;
    const scheduleDetection = () => {
      scrollTick = (scrollTick + 1) % 4;
      if (scrollTick !== 0) return;
      if (!frame) frame = window.requestAnimationFrame(detectBackground);
    };
    detectBackground();
    window.addEventListener("scroll", scheduleDetection, { passive: true });
    window.addEventListener("resize", scheduleDetection);
    return () => {
      window.removeEventListener("scroll", scheduleDetection);
      window.removeEventListener("resize", scheduleDetection);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const openContact = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
    setSocialsOpen(false);
  };

  const lockNavigationBriefly = () => {
    navigationLocked.current = true;
    window.setTimeout(() => {
      navigationLocked.current = false;
    }, 900);
  };

  const navigateToHero = () => {
    if (navigationLocked.current) return;
    setSocialsOpen(false);
    setPhoneOpen(false);
    lockNavigationBriefly();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToNextSection = () => {
    if (navigationLocked.current) return;
    const targets = getFloatingNavigationTargets();
    const currentIndex = getCurrentNavigationIndex(targets);
    const nextTarget = targets[currentIndex + 1];
    if (!nextTarget) {
      setHasNextSection(false);
      return;
    }
    const targetTop = nextTarget.getBoundingClientRect().top + window.scrollY;
    const isFooter = Boolean(nextTarget.querySelector("footer"));
    setSocialsOpen(false);
    setPhoneOpen(false);
    lockNavigationBriefly();
    window.scrollTo({
      top: Math.max(0, targetTop - (isFooter ? 6 : 8)),
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={actionsRef}
          className={`floating-actions ${onDarkBackground ? "on-dark" : "on-light"}${menuOpen ? " behind-overlay" : ""}`}
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            className="floating-button"
            type="button"
            onClick={navigateToHero}
            aria-label="В начало сайта"
          >
            <ArrowUp />
          </button>
          <div className="floating-action-item">
            <AnimatePresence>
              {socialsOpen && (
                <motion.div
                  className="social-menu"
                  initial={{ opacity: 0, x: 8, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 6, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  role="menu"
                  aria-label="Выбор мессенджера"
                >
                  <span>Написать напрямую</span>
                  <button
                    type="button"
                    role="menuitem"
                    className="no-icon"
                    onClick={() => openContact(contactLinks.telegram)}
                  >
                    <strong>Telegram</strong>
                    <ArrowRight />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              className={`floating-button social-toggle ${socialsOpen ? "active" : ""}`}
              type="button"
              onClick={() => {
                setPhoneOpen(false);
                setSocialsOpen((open) => !open);
              }}
              aria-label={
                socialsOpen
                  ? "Закрыть меню социальных сетей"
                  : "Открыть социальные сети"
              }
              aria-expanded={socialsOpen}
            >
              {socialsOpen ? <X /> : <MessageCircle />}
            </button>
          </div>
          <div className="floating-action-item mobile-phone-action">
            <AnimatePresence>
              {phoneOpen && (
                <motion.div
                  className="phone-menu"
                  initial={{ opacity: 0, x: 8, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 6, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  role="dialog"
                  aria-label="Позвонить владельцу сайта"
                >
                  <span>Позвонить напрямую</span>
                  <a href={contactPhone.href} className="no-icon">
                    <span>
                      <small>Телефон</small>
                      <strong>{contactPhone.label}</strong>
                    </span>
                    <ArrowRight />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              className={`floating-button phone-toggle ${phoneOpen ? "active" : ""}`}
              type="button"
              onClick={() => {
                setSocialsOpen(false);
                setPhoneOpen((open) => !open);
              }}
              aria-label={
                phoneOpen ? "Закрыть номер телефона" : "Показать номер телефона"
              }
              aria-expanded={phoneOpen}
            >
              {phoneOpen ? <X /> : <Phone />}
            </button>
          </div>
          <button
            className="floating-button"
            type="button"
            onClick={navigateToNextSection}
            aria-label="К следующей секции"
            disabled={!hasNextSection}
          >
            <ArrowDown />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
    const progress = (delta + 1.04) / 0.76;
    return progress * progress * (3 - 2 * progress);
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
            loading="lazy"
          />
        </div>
      </div>
    </motion.article>
  );
}

/** Reusable 4-pointed brand star from the logo mark */
function BrandStar({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`brand-star-icon ${className}`}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M50 5 C50 5,56 38,62 44 C68 50,95 50,95 50 C95 50,68 50,62 56 C56 62,50 95,50 95 C50 95,44 62,38 56 C32 50,5 50,5 50 C5 50,32 50,38 44 C44 38,50 5,50 5 Z" />
    </svg>
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
  // Star is "active" when fillValue > 0.5
  const starFill = useTransform(fillValue, [0, 0.5, 1], ["#d9ddda", "#101312", "#101312"]);
  const starScale = useTransform(fillValue, [0, 0.5, 1], [0.75, 1.1, 1]);

  return (
    <span className="process-segment">
      <b>{String(index + 1).padStart(2, "0")}</b>
      {/* 4-pointed brand star instead of progress bar line */}
      <motion.svg
        className="process-star"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ scale: starScale }}
        aria-hidden="true"
      >
        <motion.path
          d="M50 5
             C50 5, 56 38, 62 44
             C68 50, 95 50, 95 50
             C95 50, 68 50, 62 56
             C56 62, 50 95, 50 95
             C50 95, 44 62, 38 56
             C32 50, 5 50, 5 50
             C5 50, 32 50, 38 44
             C44 38, 50 5, 50 5 Z"
          style={{ fill: starFill }}
        />
      </motion.svg>
    </span>
  );
}

function ProcessFlow({
  scrollToSection,
}: {
  scrollToSection: (id: string, event?: MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
}) {
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

const StackSlot = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  ({ children, className = '' }, ref) => (
    <div ref={ref} className={`stack-slot${className ? ' ' + className : ''}`}>
      {children}
    </div>
  )
);
StackSlot.displayName = 'StackSlot';

/* ── Client journey accordion data ─────────────────────────── */
const WORK_STEPS = [
  {
    n: "01",
    title: "Аудит — смотрю что есть",
    img: "/images/steps/step-01-audit.webp",
    body: "Выезжаю на объект или анализирую схемы удалённо. Фиксирую оборудование, протоколы передачи данных и точки подключения. После — конкретное предложение: что будет сделано, сроки и стоимость.",
  },
  {
    n: "02",
    title: "Интеграция — подключаю систему",
    img: "/images/steps/step-02-module.webp",
    body: "Подключаю оборудование поэтапно — объект продолжает работать во время монтажа. Настраиваю протоколы, пишу адресацию и проверяю передачу данных перед сдачей.",
  },
  {
    n: "03",
    title: "Запуск — система работает",
    img: "/images/steps/step-03-system.webp",
    body: "Ввожу в эксплуатацию, обучаю дежурного инженера реагировать на аварии до выезда. После сдачи — всегда на связи. Расширение системы — по запросу.",
  },
] as const;

/* ── Problem chips data ─────────────────────────────────── */
type LucideIcon = React.ComponentType<{ size?: number; strokeWidth?: number }>;
const PROBLEM_CHIPS: {
  label: string;
  Icon: LucideIcon;
  top: string;
  left: string;
  fly: [number, number, number]; // [x, y, rotate] in px/deg
}[] = [
  // Row 1
  { label: "Авария после жалоб",      Icon: AlertTriangle,    top: "10%", left: "2%",  fly: [-280, -200, -20] },
  { label: "Нет мониторинга 24/7",    Icon: EyeOff,           top: "8%",  left: "34%", fly: [-30,  -270,  10] },
  { label: "Диагностика = выезд",     Icon: Gauge,            top: "12%", left: "65%", fly: [300,  -210,  24] },
  // Row 2
  { label: "Нет истории данных",      Icon: Database,         top: "40%", left: "0%",  fly: [-320, -20,  -30] },
  { label: "Реакция после сбоя",      Icon: Bell,             top: "38%", left: "28%", fly: [-80,  -240,  14] },
  { label: "Нет удалённого доступа",  Icon: WifiOff,          top: "42%", left: "58%", fly: [260,  -40,  -16] },
  // Row 3
  { label: "Разные протоколы",        Icon: Unlink,           top: "70%", left: "5%",  fly: [-260,  220, -22] },
  { label: "Ручной журнал",           Icon: BookOpen,         top: "68%", left: "33%", fly: [50,    290,   8] },
  { label: "Каждый сам по себе",      Icon: Server,           top: "72%", left: "60%", fly: [300,   210,  20] },
];

function ProblemChip({
  chip,
  progress,
}: {
  chip: (typeof PROBLEM_CHIPS)[number];
  progress: MotionValue<number>;
}) {
  const x       = useTransform(progress, [0, 0.62], [0, chip.fly[0]]);
  const y       = useTransform(progress, [0, 0.62], [0, chip.fly[1]]);
  const rotate  = useTransform(progress, [0, 0.62], [0, chip.fly[2]]);
  const opacity = useTransform(progress, [0.30, 0.58], [1, 0]);
  const scale   = useTransform(progress, [0, 0.62], [1, 0.7]);

  return (
    <motion.div
      className="problem-chip"
      style={{ x, y, rotate, opacity, scale, top: chip.top, left: chip.left }}
    >
      <chip.Icon size={13} strokeWidth={1.5} />
      <span>{chip.label}</span>
    </motion.div>
  );
}

export default function Home() {
  const { track } = useTrack();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navDropOpen, setNavDropOpen] = useState(false);
  const [scenario, setScenario] = useState(0);
  const [faq, setFaq] = useState(0);
  const [heroPassed, setHeroPassed] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [caseDirection, setCaseDirection] = useState(1);
  const [problemStep, setProblemStep] = useState(0);
  const navigationLocked = useRef(false);
  const reduceMotion = useReducedMotion();
  const problemSlotRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = scrollYProgress;
  const heroCopyY = useTransform(
    scrollYProgress,
    [0, 0.09],
    [0, reduceMotion ? 0 : 130],
  );
  const heroCopyOpacity = useTransform(
    scrollYProgress,
    [0, 0.065],
    [1, reduceMotion ? 1 : 0],
  );
  // heroCopyBlur removed — filter:blur() rasterizes every scroll frame
  const heroVisualY = useTransform(
    scrollYProgress,
    [0, 0.12],
    [0, reduceMotion ? 0 : -70],
  );
  // heroVisualScale removed — scale + translate on same element = extra composite layer
  const heroOrbY = useTransform(
    scrollYProgress,
    [0, 0.12],
    [0, reduceMotion ? 0 : 180],
  );
  const caseVisualY = useTransform(
    scrollYProgress,
    [0.48, 0.78],
    [reduceMotion ? 0 : 54, reduceMotion ? 0 : -54],
  );

  const moveCase = (next: number) => {
    const normalized = (next + caseStudies.length) % caseStudies.length;
    setCaseDirection(
      next > activeCase ||
        (activeCase === caseStudies.length - 1 && normalized === 0)
        ? 1
        : -1,
    );
    setActiveCase(normalized);
  };
  const scrollToSection = (id: string, event?: MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    if (event) event.preventDefault();

    // iOS Safari fix: if mobile menu lock is active (body is position:fixed),
    // restore scroll position BEFORE calculating target rect — otherwise
    // getBoundingClientRect() and window.scrollY will be wrong (body is frozen at 0)
    if (document.body.style.position === "fixed") {
      const savedTop = parseInt(document.body.style.top || "0") * -1;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo({ top: savedTop, behavior: "instant" as ScrollBehavior });
    }

    if (id === "#top") {
      navigationLocked.current = true;
      setNavDropOpen(false);
      setMenuOpen(false);
      window.history.replaceState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(() => {
        navigationLocked.current = false;
      }, 1200);
      return;
    }

    const target = document.querySelector<HTMLElement>(id);
    if (!target) return;

    navigationLocked.current = true;
    setNavDropOpen(false);
    setMenuOpen(false);

    window.history.replaceState(null, "", id);

    // On mobile: use scrollIntoView — it doesn't depend on window.scrollY
    // and is more reliable on iOS Safari than window.scrollTo().
    // scroll-margin-top in CSS handles the fixed nav bar offset.
    // On desktop: keep the stack-slot-aware calculation for smooth panel transitions.
    const isMobile = window.matchMedia("(max-width: 1000px)").matches;
    if (isMobile) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const slot = target.closest<HTMLElement>(".stack-slot, .process-runway");
      const scrollTarget = slot || target;
      const rect = scrollTarget.getBoundingClientRect();
      const targetTop = Math.max(0, window.scrollY + rect.top - 8);
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }

    window.setTimeout(() => {
      navigationLocked.current = false;
    }, 1200);
  };

  const scrollToContact = (event: MouseEvent<HTMLAnchorElement>) => {
    scrollToSection("#contact", event);
  };
  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 1001px) and (min-height: 760px)",
    );
    const panels = Array.from(
      document.querySelectorAll<HTMLElement>(".stack-panel"),
    );
    const entries = panels.map((panel) => ({
      panel,
      anchor: panel.closest<HTMLElement>(".stack-slot, .process-runway"),
      // Cache tagName check — avoids repeated DOM property access in hot loop
      isFooter: panel.tagName === "FOOTER",
    }));
    let frame = 0;
    const resetPanelMotion = (panel: HTMLElement) => {
      panel.classList.remove(
        "is-pinned",
        "is-being-covered",
        "is-entering",
        "is-depth-active",
        "is-content-hidden",
      );
      panel.style.removeProperty("--stack-content-y");
      panel.style.removeProperty("--stack-content-opacity");
    };
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const smoothstep = (value: number) => value * value * (3 - 2 * value);

    // State cache — skip all DOM writes when values haven't meaningfully changed.
    // Main win: when scrolling WITHIN a section (not between panels) the function
    // exits after the comparison, touching zero DOM properties.
    const SKIP_THRESHOLD = 0.0015;
    let prevActiveIndex = -99;
    let prevEnteringIndex = -99;
    let prevEnteringProgress = -1;
    let prevCoverProgress = -1;

    const updatePinnedPanels = () => {
      frame = 0;
      if (!media.matches) {
        panels.forEach(resetPanelMotion);
        return;
      }
      const viewportSpan = Math.max(1, window.innerHeight - 8);
      const remainingScroll =
        document.documentElement.scrollHeight -
        window.innerHeight -
        window.scrollY;

      // --- READ PHASE (all getBCR calls together, before any writes) ---
      const anchorTops = entries.map(
        ({ anchor }) =>
          anchor?.getBoundingClientRect().top ?? window.innerHeight,
      );

      const pinnedStates = entries.map(({ isFooter }, index) => {
        const anchorTop = anchorTops[index];
        return anchorTop <= 8.5 || (isFooter && remainingScroll <= 12);
      });
      let activeIndex = -1;
      pinnedStates.forEach((isPinned, index) => {
        if (isPinned) activeIndex = index;
      });
      const enteringIndex =
        activeIndex + 1 < entries.length &&
        anchorTops[activeIndex + 1] < window.innerHeight
          ? activeIndex + 1
          : -1;
      const enteringProgress =
        enteringIndex >= 0
          ? smoothstep(
              clamp(
                (window.innerHeight - anchorTops[enteringIndex]) / viewportSpan,
              ),
            )
          : 0;
      const coverProgress =
        enteringIndex >= 0
          ? smoothstep(clamp((enteringProgress - 0.08) / 0.82))
          : 0;

      // --- SKIP CHECK — exit early if nothing has changed meaningfully ---
      if (
        activeIndex === prevActiveIndex &&
        enteringIndex === prevEnteringIndex &&
        Math.abs(enteringProgress - prevEnteringProgress) < SKIP_THRESHOLD &&
        Math.abs(coverProgress - prevCoverProgress) < SKIP_THRESHOLD
      ) return;

      prevActiveIndex = activeIndex;
      prevEnteringIndex = enteringIndex;
      prevEnteringProgress = enteringProgress;
      prevCoverProgress = coverProgress;

      // --- WRITE PHASE ---
      entries.forEach(({ panel }, index) => {
        panel.classList.toggle("is-pinned", pinnedStates[index]);
        panel.classList.toggle("is-content-hidden", index < activeIndex);
        panel.classList.toggle(
          "is-being-covered",
          index === activeIndex && coverProgress > 0.002,
        );
        panel.classList.toggle("is-entering", index === enteringIndex);
        panel.classList.toggle(
          "is-depth-active",
          index === activeIndex || index === enteringIndex,
        );

        if (index === activeIndex) {
          panel.style.setProperty(
            "--stack-content-y",
            `${(-coverProgress * 18).toFixed(2)}px`,
          );
          panel.style.setProperty(
            "--stack-content-opacity",
            `${(1 - coverProgress).toFixed(4)}`,
          );
        } else if (index === enteringIndex) {
          panel.style.setProperty(
            "--stack-content-y",
            `${((1 - enteringProgress) * 28).toFixed(2)}px`,
          );
          panel.style.removeProperty("--stack-content-opacity");
        } else {
          panel.style.removeProperty("--stack-content-y");
          panel.style.removeProperty("--stack-content-opacity");
        }
      });
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updatePinnedPanels);
    };

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    updatePinnedPanels();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    media.addEventListener("change", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      media.removeEventListener("change", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      panels.forEach(resetPanelMotion);
    };
  }, []);
  useEffect(() => {
    // На мобильных устройствах включаем наблюдатель для активации карточек при прохождении центра экрана
    const media = window.matchMedia("(max-width: 1000px)");
    let observer: IntersectionObserver | null = null;
    
    const setupObserver = () => {
      if (observer) {
        observer.disconnect();
      }

      if (media.matches) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              entry.target.classList.toggle("card-active", entry.isIntersecting);
            });
          },
          {
            // Отслеживаем пересечение с горизонтальной полосой по центру экрана
            rootMargin: "-42% 0px -42% 0px",
            threshold: 0,
          }
        );

        const cards = document.querySelectorAll(".benefit-card");
        cards.forEach((card) => observer?.observe(card));
      } else {
        const cards = document.querySelectorAll(".benefit-card");
        cards.forEach((card) => card.classList.remove("card-active"));
      }
    };

    setupObserver();
    media.addEventListener("change", setupObserver);
    const timer = setTimeout(setupObserver, 800);

    return () => {
      if (observer) observer.disconnect();
      media.removeEventListener("change", setupObserver);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // FAQ items: на мобильных .is-pinned не срабатывает — нужен отдельный IO
    const media = window.matchMedia("(max-width: 1000px)");
    let faqObserver: IntersectionObserver | null = null;

    const setupFaqObserver = () => {
      if (faqObserver) faqObserver.disconnect();

      if (media.matches) {
        faqObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("faq-visible");
                // Однократно — после появления больше не следим
                faqObserver?.unobserve(entry.target);
              }
            });
          },
          { rootMargin: "0px 0px -15% 0px", threshold: 0.1 }
        );
        const faqItems = document.querySelectorAll(".faq-item");
        faqItems.forEach((item) => faqObserver?.observe(item));
      } else {
        // На десктопе убираем класс — там работает is-pinned
        document.querySelectorAll(".faq-item").forEach((item) => item.classList.remove("faq-visible"));
      }
    };

    setupFaqObserver();
    media.addEventListener("change", setupFaqObserver);
    const timer = setTimeout(setupFaqObserver, 600);

    return () => {
      if (faqObserver) faqObserver.disconnect();
      media.removeEventListener("change", setupFaqObserver);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroPassed(!entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Portal mount state for SSR safety
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (menuOpen) {
      // Simple overflow lock — does NOT create stacking context issues
      // that body:position:fixed causes with position:fixed children
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <main className={menuOpen ? "menu-is-open" : ""}>
      <motion.div className="progress" style={{ scaleX }} />
      <FloatingActions visible={heroPassed} menuOpen={menuOpen} />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <a href="#result" className="mobile-menu-item" onClick={(e) => scrollToSection("#result", e)}>
              <CircleGauge size={16} strokeWidth={1.5} />
              <span>Возможности</span>
            </a>
            <a href="#process" className="mobile-menu-item" onClick={(e) => scrollToSection("#process", e)}>
              <ListChecks size={16} strokeWidth={1.5} />
              <span>Как работаю</span>
            </a>
            <a href="#cases" className="mobile-menu-item" onClick={(e) => scrollToSection("#cases", e)}>
              <LayoutDashboard size={16} strokeWidth={1.5} />
              <span>Что уже выполнено</span>
            </a>
            <a href="#audit" className="mobile-menu-item" onClick={(e) => scrollToSection("#audit", e)}>
              <ShieldCheck size={16} strokeWidth={1.5} />
              <span>Бесплатный аудит</span>
            </a>
            <a href="#faq" className="mobile-menu-item" onClick={(e) => scrollToSection("#faq", e)}>
              <MessageCircle size={16} strokeWidth={1.5} />
              <span>Вопросы</span>
            </a>
            <a href="#about" className="mobile-menu-item" onClick={(e) => scrollToSection("#about", e)}>
              <User size={16} strokeWidth={1.5} />
              <span>Меня зовут Павел</span>
            </a>
            <a
              className="mobile-menu-cta"
              href="#contact"
              onClick={(e) => scrollToSection("#contact", e)}
            >
              Обсудить объект <ArrowDownRight size={17} />
            </a>
            <div className="mobile-menu-contacts">
              <a
                href="tel:+79958878310"
                className="mobile-contact-item"
                onClick={() => track('click_phone', { location: 'mobile_menu' })}
              >
                <Phone size={16} strokeWidth={1.8} />
                <span>+7 995 887-83-10</span>
              </a>
              <a
                href="mailto:PetroffSCADA@yandex.ru"
                className="mobile-contact-item"
                onClick={() => track('click_email', { location: 'mobile_menu' })}
              >
                <Mail size={16} strokeWidth={1.8} />
                <span>PetroffSCADA@yandex.ru</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav rendered via portal directly into document.body — 100% above all stacking contexts */}
      {mounted && createPortal(
        <nav
          className="nav"
          style={menuOpen ? {
            background: "#ffffff",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            zIndex: 99999,
            boxShadow: "none",
          } : undefined}
        >
          <a className="logo" href="#top" aria-label="acengine.ru — на главную" onClick={(e) => scrollToSection("#top", e)}>
            <AcEngineLogo size={36} className="logo-svg" style={{ color: "var(--ink)" }} />
            <span className="logo-divider" />
            <span className="logo-text">acengine.ru</span>
          </a>
          <div className="nav-right">
            <a
              href="tel:+79958878310"
              className="nav-contact-link"
              onClick={() => track('click_phone', { location: 'nav' })}
            >
              <Phone size={16} strokeWidth={1.8} />
              <span>+7 995 887-83-10</span>
            </a>
            <a
              href="mailto:PetroffSCADA@yandex.ru"
              className="nav-contact-link"
              onClick={() => track('click_email', { location: 'nav' })}
            >
              <Mail size={16} strokeWidth={1.8} />
              <span>PetroffSCADA@yandex.ru</span>
            </a>
            <div className="nav-dropdown-wrap">
              <button
                className={`nav-dropdown-btn${navDropOpen ? " is-open" : ""}`}
                onClick={() => setNavDropOpen(!navDropOpen)}
                aria-label="Навигация по сайту"
              >
                <span>Навигация</span>
                <ChevronDown size={14} strokeWidth={1.5} />
              </button>
              <AnimatePresence>
                {navDropOpen && (
                  <motion.div
                    className="nav-dropdown-panel"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.25, 0, 0.1, 1] }}
                  >
                    <a href="#result" className="nav-drop-item" onClick={(e) => scrollToSection("#result", e)}>
                      <CircleGauge size={15} strokeWidth={1.5} />
                      <span>Возможности</span>
                    </a>
                    <a href="#process" className="nav-drop-item" onClick={(e) => scrollToSection("#process", e)}>
                      <ListChecks size={15} strokeWidth={1.5} />
                      <span>Как работаю</span>
                    </a>
                    <a href="#cases" className="nav-drop-item" onClick={(e) => scrollToSection("#cases", e)}>
                      <LayoutDashboard size={15} strokeWidth={1.5} />
                      <span>Что уже выполнено</span>
                    </a>
                    <a href="#audit" className="nav-drop-item" onClick={(e) => scrollToSection("#audit", e)}>
                      <ShieldCheck size={15} strokeWidth={1.5} />
                      <span>Бесплатный аудит</span>
                    </a>
                    <a href="#faq" className="nav-drop-item" onClick={(e) => scrollToSection("#faq", e)}>
                      <MessageCircle size={15} strokeWidth={1.5} />
                      <span>Вопросы</span>
                    </a>
                    <a href="#about" className="nav-drop-item" onClick={(e) => scrollToSection("#about", e)}>
                      <User size={15} strokeWidth={1.5} />
                      <span>Меня зовут Павел</span>
                    </a>
                    <div className="nav-drop-divider" />
                    <a href="#contact" className="nav-drop-item nav-drop-cta" onClick={(e) => scrollToSection("#contact", e)}>
                      <Send size={15} strokeWidth={1.5} />
                      <span>Обсудить объект</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a className="nav-cta" href="#contact" onClick={(e) => scrollToSection("#contact", e)}>
              Обсудить объект <ArrowDownRight size={16} />
            </a>
          </div>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Открыть меню"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>,
        document.body
      )}

      <section className="hero" id="top">
        <motion.div className="hero-orb one" style={{ y: heroOrbY }} />
        <div className="hero-orb two" />
        <motion.div
          className="hero-equipment"
          style={{
            opacity: heroCopyOpacity,
          }}
          aria-hidden="true"
        >
          <motion.div
            className="equipment-piece cabinet"
            initial={{ opacity: 0, x: -150, rotate: -18, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, rotate: -10, scale: 1 }}
            transition={{
              duration: 1.15,
              delay: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src="/images/hero/control-cabinet.webp"
              alt=""
              width={520}
              height={420}
              priority
              quality={85}
            />
          </motion.div>
          <motion.div
            className="equipment-piece industrial-fan"
            initial={{ opacity: 0, x: 150, rotate: 18, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, rotate: 9, scale: 1 }}
            transition={{
              duration: 1.15,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src="/images/hero/industrial-fan.webp"
              alt=""
              width={420}
              height={360}
              priority
              quality={85}
            />
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-copy-scroll"
          style={{
            y: heroCopyY,
            opacity: heroCopyOpacity,
          }}
        >
          <div className="hero-copy">

            <div
              className="hero-labels"
              aria-label="SCADA и HVAC для коммерческих объектов"
            >
              <span className="hero-label primary">SCADA / HVAC</span>
              <span className="hero-label secondary">SCADA · АСУ ТП · Диспетчеризация</span>
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
              аварийные уведомления в систему, которой удобно пользоваться
              каждый день.
            </p>
            <div className="hero-actions">
              <a className="button dark" href="#contact" onClick={(e) => scrollToSection("#contact", e)}>
                Получить решение <ArrowRight size={18} />
              </a>
              <a className="button outline" href="#cases" onClick={(e) => scrollToSection("#cases", e)}>
                <Play size={14} fill="currentColor" strokeWidth={0} style={{ transform: "translateX(1px)" }} /> Что уже выполнено
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          style={{ y: heroVisualY }}
        >
          <ScadaCarousel />
        </motion.div>
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

      <div className="stack-root">
        <StackSlot>
          <section
            className="intro section stack-panel panel-paper layer-1"
            ref={(el: HTMLElement | null) => {
              if (!el) return;

              const svgEl = el.querySelector<SVGElement>('.intro-neon-svg');
              const glowPath = el.querySelector<SVGPathElement>('.neon-trace-glow');
              const linePath = el.querySelector<SVGPathElement>('.neon-trace-line');
              if (!glowPath || !linePath || !svgEl) return;

              // Build rounded-rect path starting at bottom-left
              // border-radius: 38px top corners, 0 bottom corners
              const buildPath = () => {
                const { width: W, height: H } = el.getBoundingClientRect();
                if (!W || !H) return;
                const Rt = 38; // top corners radius
                const Rb = 0;  // bottom corners radius
                // Path starts at bottom-left going clockwise:
                // bottom edge → bottom-right corner → right edge → top-right corner
                // → top edge → top-left corner → left edge → back
                const d = [
                  `M ${Rb} ${H}`,
                  `L ${W - Rb} ${H}`,
                  Rb > 0 ? `Q ${W} ${H} ${W} ${H - Rb}` : `L ${W} ${H}`,
                  `L ${W} ${Rt}`,
                  `Q ${W} 0 ${W - Rt} 0`,
                  `L ${Rt} 0`,
                  `Q 0 0 0 ${Rt}`,
                  `L 0 ${H - Rb}`,
                  Rb > 0 ? `Q 0 ${H} ${Rb} ${H}` : `L ${Rb} ${H}`,
                ].join(' ');

                [glowPath, linePath].forEach(p => {
                  p.setAttribute('d', d);
                  // No dasharray — full border appears simultaneously from all edges
                });
              };

              buildPath();
              const ro = new ResizeObserver(buildPath);
              ro.observe(el);

              // All edges appear simultaneously — pure opacity, no running line
              const obs = new IntersectionObserver(([entry]) => {
                el.classList.toggle('neon-active', entry.isIntersecting);
                if (entry.isIntersecting) {
                  // Start invisible, then fade the full border in at once
                  [glowPath, linePath].forEach(p => {
                    p.style.transition = 'none';
                    p.style.opacity = '0';
                  });
                  requestAnimationFrame(() => requestAnimationFrame(() => {
                    glowPath.style.transition = 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
                    glowPath.style.opacity = '1';
                    linePath.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s';
                    linePath.style.opacity = '1';
                  }));
                } else {
                  glowPath.style.transition = 'opacity 0.7s ease';
                  glowPath.style.opacity = '0';
                  linePath.style.transition = 'opacity 0.5s ease';
                  linePath.style.opacity = '0';
                }
              }, { threshold: 0.15 });
              obs.observe(el);
            }}
          >
            {/* SVG border trace */}
            <svg
              className="intro-neon-svg"
              aria-hidden="true"
            >
              <defs>
                <filter id="neon-blur-1" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                </filter>
              </defs>
              {/* Outer glow layer — uses SVG-native blur for iOS Safari compat */}
              <path className="neon-trace-glow" filter="url(#neon-blur-1)" />
              {/* Sharp neon line */}
              <path className="neon-trace-line" />
            </svg>
            <span className="section-tag">/ Результат</span>
            <h2>
              Не просто визуализация.
              <br />
              <span>Рабочий инструмент мониторинга вентиляции.</span>
            </h2>
            <p className="section-lead">
              После моего проекта дежурный инженер видит состояние всего объекта
              на одном экране, понимает причину аварии и принимает решение по
              данным — ещё до выезда.
            </p>
            <div className="benefit-grid" id="result">
              {benefits.map(([n, title, text, Icon], i) => (
                <article
                  key={n}
                  className="benefit-card reveal-card"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="card-top">
                    <span>{n}</span>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <div className="toggle-switch" aria-hidden="true">
                    <span className="toggle-thumb" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </StackSlot>

        <StackSlot>
          <section className="problem-section stack-panel layer-2">
            <div className="problem-copy">
              <span className="section-tag">/ До диспетчеризации</span>
              <h2>Проблема: каждая установка вентиляции работает сама по себе</h2>
              <p>
                На большинстве объектов, с которыми ко мне приходят, о проблеме
                узнают после жалоб. Диагностика требует выезда, история
                параметров нигде не хранится. Каждая установка живёт сама по
                себе.
              </p>
              <a className="text-link white" href="#audit" onClick={(e) => scrollToSection("#audit", e)}>
                Проверить свой объект <ArrowRight size={17} />
              </a>
            </div>
            {/* RIGHT: dark variant of site accordion — same HTML as vendors section */}
            <div className="problem-steps-col">
              <div className="work-accordion-dark">
                {WORK_STEPS.map(({ n, title, img, body }, i) => (
                  <div
                    key={n}
                    className={`accordion-item${problemStep === i ? " open" : ""}`}
                  >
                    <button
                      className="accordion-header"
                      onClick={() => setProblemStep(problemStep === i ? -1 : i)}
                      aria-expanded={problemStep === i}
                    >
                      <span className="accordion-num">{n}</span>
                      <span className="accordion-title">{title}</span>
                      <span className="accordion-icon">
                        <BrandStar size={16} />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {problemStep === i && (
                        <motion.div
                          key={n}
                          className="accordion-content"
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="accordion-body">
                            <div className="accordion-left">
                              <p>{body}</p>
                            </div>
                            <motion.div
                              className="step-icon-reveal"
                              initial={{ scale: 0.68, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.68, opacity: 0 }}
                              transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <Image
                                src={img}
                                alt={title}
                                width={180}
                                height={126}
                                className="step-icon-img"
                                loading="lazy"
                                quality={88}
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

          </section>
        </StackSlot>
        <StackSlot>
          <section
            className="audit section stack-panel panel-ice layer-3"
            id="audit"
          >
            <div className="audit-card">
              {/* Decorative SVG ribbons — volumetric arc stripes referencing AC logo */}
              <svg
                className="audit-ribbons"
                viewBox="0 0 1200 420"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  <linearGradient id="aug-rb1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="white" stopOpacity="0.05"/>
                    <stop offset="30%"  stopColor="white" stopOpacity="0.55"/>
                    <stop offset="50%"  stopColor="white" stopOpacity="0.72"/>
                    <stop offset="70%"  stopColor="white" stopOpacity="0.55"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0.05"/>
                  </linearGradient>
                  <linearGradient id="aug-rb2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="white" stopOpacity="0.03"/>
                    <stop offset="30%"  stopColor="white" stopOpacity="0.38"/>
                    <stop offset="50%"  stopColor="white" stopOpacity="0.52"/>
                    <stop offset="70%"  stopColor="white" stopOpacity="0.38"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0.03"/>
                  </linearGradient>
                  <linearGradient id="aug-rb3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="white" stopOpacity="0"/>
                    <stop offset="50%"  stopColor="white" stopOpacity="0.32"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                </defs>

                {/*
                  Ribbon 1 — main wide ribbon with 2 twist points.
                  Wide sections (~60px gap), twist pinch points (~7px gap).
                  Path: top edge forward, then bottom edge reversed.
                  Twist 1 near x=350 (top≈100, bottom≈107).
                  Twist 2 near x=850 (top≈145, bottom≈152).
                */}
                <path
                  d="M -20,340
                     C 100,250 200,80  350,100
                     C 450,110 540,40  600,40
                     C 660,40  740,100 850,145
                     C 950,185 1100,70 1220,60
                     L 1220,120
                     C 1100,130 950,160 850,152
                     C 740,145 660,100 600,100
                     C 540,100 450,120 350,107
                     C 200,87  100,310 -20,400
                     Z"
                  fill="url(#aug-rb1)"
                />

                {/*
                  Ribbon 2 — medium ribbon, offset lower, staggered twists.
                  Twist 1 near x=420 (6px gap), Twist 2 near x=900 (6px gap).
                */}
                <path
                  d="M -20,270
                     C 150,200 300,185 420,190
                     C 520,194 560,235 660,240
                     C 780,248 860,115 900,120
                     C 940,125 1100,175 1220,180
                     L 1220,230
                     C 1100,225 940,132 900,126
                     C 860,121 780,298 660,290
                     C 560,285 520,202 420,196
                     C 300,191 150,250 -20,320
                     Z"
                  fill="url(#aug-rb2)"
                />

                {/*
                  Ribbon 3 — thin accent ribbon, 1 tight twist near x=300.
                  Starts high, pinches to 4px, opens up toward top-right.
                */}
                <path
                  d="M -20,150
                     C 80,110  200,75  300,80
                     C 400,84  450,28  500,30
                     C 650,32  900,-15 1220,-10
                     L 1220,16
                     C 900,11  650,58  500,56
                     C 450,54  400,109 300,84
                     C 200,80  80,136 -20,176
                     Z"
                  fill="url(#aug-rb3)"
                />
              </svg>
              <div className="audit-copy">
                <span className="section-tag">/ Для тех, кто ещё оценивает</span>
                <h2>Объект теряет деньги на вентиляции — или нет?</h2>
                <p>
                  Проверьте свою ситуацию за 5 минут. Три чеклиста для разных ролей —
                  узнаете готов ли объект и какие вопросы задать подрядчику.
                </p>
                <ul>
                  <li>
                    <Check /> PDF — одна страница
                  </li>
                  <li>
                    <Check /> Бесплатно
                  </li>
                  <li>
                    <Check /> Без регистрации
                  </li>
                </ul>
              </div>
              <LeadMagnet />
            </div>
          </section>
        </StackSlot>

        <ProcessFlow scrollToSection={scrollToSection} />

        <StackSlot>
          <section className="scenario-section section stack-panel panel-ice layer-5" id="vendors">
            <div className="vendors-container">
              <div className="vendors-left-col">
                <div className="section-heading">
                  <span className="section-tag">/ Вендоры и платформы</span>
                  <h2>Оборудование и протоколы для диспетчеризации вентиляции</h2>
                  <p className="section-lead">
                    Подбираю оборудование для новых систем и подключаю автоматику, которая уже установлена. Не привязываю проект к одному производителю.
                  </p>
                </div>
                <div className="scenario-footer">
                  <p>Уже установлен другой контроллер или SCADA? Проверю интерфейсы связи и предложу способ интеграции без полной замены автоматики.</p>
                  <a href="#contact" className="button dark" onClick={(e) => scrollToSection("#contact", e)}>
                    Обсудить оборудование <ArrowRight size={16} strokeWidth={1.8} />
                  </a>
                </div>
              </div>

              <div className="vendors-right-col">
                <div className="vendors-accordion">
                  {scenarios.map((x, i) => {
                    const isOpen = scenario === i;
                    return (
                      <div
                        key={x.label}
                        className={`accordion-item ${isOpen ? "open" : ""}`}
                      >
                        <button
                          className="accordion-header"
                          onClick={() => setScenario(isOpen ? -1 : i)}
                        >
                          <span className="accordion-num">0{i + 1}</span>
                          <span className="accordion-title">{x.label}</span>
                          <motion.div
                            className="accordion-icon"
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <BrandStar size={18} />
                          </motion.div>
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="accordion-content"
                            >
                              <div className="accordion-body">
                                <div className="accordion-left">
                                  <p>{x.text}</p>
                                  <div className="big-stat">
                                    <strong>{x.stat}</strong>
                                    <small>{x.meta}</small>
                                  </div>
                                </div>
                                <div className="accordion-right">
                                  <span className="brands-label">Используемые решения:</span>
                                  <div className="brand-tags-container">
                                    {x.brands.split(" · ").map((brand) => (
                                      <span key={brand} className="brand-tag">{brand}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </StackSlot>

        <StackSlot>
          <section
            className="case section stack-panel panel-mist layer-6"
            id="cases"
          >
            <div className="case-carousel">
              <motion.div
                className="case-shell"
                drag="x"
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.06}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) moveCase(activeCase + 1);
                  if (info.offset.x > 60) moveCase(activeCase - 1);
                }}
              >
                {/* Ribbon decoration — teal brand stripes on dark bg */}
                <svg className="case-ribbons" viewBox="0 0 1100 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id="cs-rb1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#5ab3a5" stopOpacity="0"/>
                      <stop offset="30%"  stopColor="#5ab3a5" stopOpacity="0.12"/>
                      <stop offset="50%"  stopColor="#5ab3a5" stopOpacity="0.18"/>
                      <stop offset="70%"  stopColor="#5ab3a5" stopOpacity="0.12"/>
                      <stop offset="100%" stopColor="#5ab3a5" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="cs-rb2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#5ab3a5" stopOpacity="0"/>
                      <stop offset="40%"  stopColor="#5ab3a5" stopOpacity="0.08"/>
                      <stop offset="60%"  stopColor="#5ab3a5" stopOpacity="0.11"/>
                      <stop offset="100%" stopColor="#5ab3a5" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {/* Wide ribbon — bottom-left origin, S-curve with 2 twists */}
                  <path
                    d="M -20,420
                       C 120,310 240,130 380,145
                       C 500,158 560,60  640,55
                       C 720,50  820,155 920,160
                       C 1000,164 1060,90 1120,70
                       L 1120,128
                       C 1060,148 1000,222 920,218
                       C 820,213 720,108 640,113
                       C 560,118 500,218 380,205
                       C 240,190 120,370 -20,478
                       Z"
                    fill="url(#cs-rb1)"
                  />
                  {/* Medium ribbon — upper area, tighter curve */}
                  <path
                    d="M -20,280
                       C 100,215 220,80  360,90
                       C 460,98  520,180 620,175
                       C 740,169 840,60  1120,-20
                       L 1120,28
                       C 840,108 740,117 620,223
                       C 520,228 460,146 360,138
                       C 220,128 100,263 -20,328
                       Z"
                    fill="url(#cs-rb2)"
                  />
                </svg>
                <div className="case-top">
                  <span className="section-tag light">
                    / Что уже выполнено
                  </span>
                  <div className="case-top-right">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.span
                        key={activeCase}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {caseStudies[activeCase].meta}
                      </motion.span>
                    </AnimatePresence>
                    <div className="case-arrows">
                      <button
                        onClick={() => moveCase(activeCase - 1)}
                        aria-label="Предыдущий проект"
                      >
                        <ChevronLeft />
                      </button>
                      <b>{String(activeCase + 1).padStart(2, "0")} / 07</b>
                      <button
                        onClick={() => moveCase(activeCase + 1)}
                        aria-label="Следующий проект"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="case-grid">
                  <AnimatePresence initial={false} mode="sync">
                    <motion.div
                      className="case-copy"
                      key={activeCase}
                      // Copy: enters from far (scale 0.88) + side — feels like it approaches viewer
                      initial={{ x: caseDirection * 120, scale: 0.88, opacity: 0 }}
                      animate={{ x: 0, scale: 1, opacity: 1 }}
                      // Exit: barely moves — new slide "covers" it like a card on top
                      exit={{ x: caseDirection * -28, scale: 0.97, opacity: 0 }}
                      transition={{
                        duration: 0.75,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <h2>
                        <span>{caseStudies[activeCase].title[0]}</span>
                        <br />
                        <span>{caseStudies[activeCase].title[1]}</span>
                      </h2>
                      <p>{caseStudies[activeCase].text}</p>
                      <div className="case-numbers">
                        {caseStudies[activeCase].metrics.map(
                          ([value, label]) => (
                            <div key={label}>
                              <strong>{value}</strong>
                              <span>{label}</span>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="case-actions">
                        <a className="button light-button" href="#contact" onClick={(e) => scrollToSection("#contact", e)}>
                          То, что нам нужно <ArrowRight />
                        </a>
                        <div className="case-dots">
                          {caseStudies.map((item, index) => (
                            <button
                              key={item.meta}
                              className={index === activeCase ? "active" : ""}
                              onClick={() => moveCase(index)}
                              aria-label={`Показать кейс ${index + 1}`}
                            >
                              <BrandStar size={11} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  {/* SCADA screen: parallax offset (60px vs 120px) creates depth vs copy */}
                  <AnimatePresence initial={false} mode="sync">
                    <motion.div
                      key={activeCase}
                      className="case-ui"
                      style={{ y: caseVisualY }}
                      initial={{ x: caseDirection * 60, scale: 0.93, opacity: 0 }}
                      animate={{ x: 0, scale: 1, opacity: 1 }}
                      exit={{ x: caseDirection * -12, scale: 0.98, opacity: 0 }}
                      transition={{
                        duration: 0.75,
                        delay: 0.04,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <AnimatedMiniScada
                        variant={caseStudies[activeCase].variant}
                        direction={caseDirection}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <motion.div
                  className={`case-airflow-sweep ${caseDirection < 0 ? "reverse" : ""}`}
                  key={`case-air-${activeCase}`}
                  initial={{
                    x: caseDirection > 0 ? "-180%" : "500%",
                    opacity: 0,
                  }}
                  animate={{
                    x: caseDirection > 0 ? "500%" : "-180%",
                    opacity: [0, 0.55, 0.38, 0],
                  }}
                  transition={{
                    duration: 1.16,
                    times: [0, 0.2, 0.7, 1],
                    ease: [0.32, 0, 0.18, 1],
                  }}
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </section>
        </StackSlot>

        <StackSlot>
          <section
            className="trust section stack-panel panel-paper layer-7"
            ref={(el: HTMLElement | null) => {
              if (!el) return;

              const svgEl = el.querySelector<SVGElement>('.intro-neon-svg');
              const glowPath = el.querySelector<SVGPathElement>('.neon-trace-glow');
              const linePath = el.querySelector<SVGPathElement>('.neon-trace-line');
              if (!glowPath || !linePath || !svgEl) return;

              // Build rounded-rect path starting at bottom-left
              // border-radius: 38px top corners, 0 bottom corners
              const buildPath = () => {
                const { width: W, height: H } = el.getBoundingClientRect();
                if (!W || !H) return;
                const Rt = 38; // top corners radius
                const Rb = 0;  // bottom corners radius
                // Path starts at bottom-left going clockwise:
                // bottom edge → bottom-right corner → right edge → top-right corner
                // → top edge → top-left corner → left edge → back
                const d = [
                  `M ${Rb} ${H}`,
                  `L ${W - Rb} ${H}`,
                  Rb > 0 ? `Q ${W} ${H} ${W} ${H - Rb}` : `L ${W} ${H}`,
                  `L ${W} ${Rt}`,
                  `Q ${W} 0 ${W - Rt} 0`,
                  `L ${Rt} 0`,
                  `Q 0 0 0 ${Rt}`,
                  `L 0 ${H - Rb}`,
                  Rb > 0 ? `Q 0 ${H} ${Rb} ${H}` : `L ${Rb} ${H}`,
                ].join(' ');

                [glowPath, linePath].forEach(p => {
                  p.setAttribute('d', d);
                  // No dasharray — full border appears simultaneously from all edges
                });
              };

              buildPath();
              const ro = new ResizeObserver(buildPath);
              ro.observe(el);

              // All edges appear simultaneously — pure opacity, no running line
              const obs = new IntersectionObserver(([entry]) => {
                el.classList.toggle('neon-active', entry.isIntersecting);
                if (entry.isIntersecting) {
                  // Start invisible, then fade the full border in at once
                  [glowPath, linePath].forEach(p => {
                    p.style.transition = 'none';
                    p.style.opacity = '0';
                  });
                  requestAnimationFrame(() => requestAnimationFrame(() => {
                    glowPath.style.transition = 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
                    glowPath.style.opacity = '1';
                    linePath.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s';
                    linePath.style.opacity = '1';
                  }));
                } else {
                  glowPath.style.transition = 'opacity 0.7s ease';
                  glowPath.style.opacity = '0';
                  linePath.style.transition = 'opacity 0.5s ease';
                  linePath.style.opacity = '0';
                }
              }, { threshold: 0.15 });
              obs.observe(el);
            }}
          >
            {/* SVG border trace — drawn from bottom-left on scroll */}
            <svg
              className="intro-neon-svg"
              aria-hidden="true"
            >
              <defs>
                <filter id="neon-blur-2" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                </filter>
              </defs>
              {/* Outer glow layer — uses SVG-native blur for iOS Safari compat */}
              <path className="neon-trace-glow" filter="url(#neon-blur-2)" />
              {/* Sharp neon line */}
              <path className="neon-trace-line" />
            </svg>
            <div className="trust-heading">
              <span className="section-tag">/ Инженерный подход</span>
              <h2>
                SCADA-система не станет
                <br />
                <span className="title-accent">«чёрным ящиком»</span>
              </h2>
            </div>
            <div className="trust-grid">
              <article
                  className="benefit-card reveal-card"
                  style={{ animationDelay: '0s' }}
                >
                <div className="card-top">
                  <span>01</span>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3>Автономность</h3>
                  <p>
                    Проектирую так, чтобы объект работал автономно даже без
                    связи с диспетчерской — все защиты остаются активными.
                  </p>
                </div>
                <div className="toggle-switch" aria-hidden="true">
                  <span className="toggle-thumb" />
                </div>
              </article>
              <article
                  className="benefit-card reveal-card"
                  style={{ animationDelay: '0.1s' }}
                >
                <div className="card-top">
                  <span>02</span>
                  <FileStack size={24} />
                </div>
                <div>
                  <h3>Исходники у вас</h3>
                  <p>
                    Передаю схемы, программы, резервные копии, сетевые параметры и
                    инструкции.
                  </p>
                </div>
                <div className="toggle-switch" aria-hidden="true">
                  <span className="toggle-thumb" />
                </div>
              </article>
              <article
                  className="benefit-card reveal-card"
                  style={{ animationDelay: '0.2s' }}
                >
                <div className="card-top">
                  <span>03</span>
                  <SlidersHorizontal size={24} />
                </div>
                <div>
                  <h3>Прозрачные этапы</h3>
                  <p>
                    Фиксирую функции, сигналы, сроки и границы ответственности
                    до старта работ — чтобы не было сюрпризов в конце.
                  </p>
                </div>
                <div className="toggle-switch" aria-hidden="true">
                  <span className="toggle-thumb" />
                </div>
              </article>
            </div>
          </section>
        </StackSlot>

        <StackSlot>
          <section
            className="faq section stack-panel panel-white layer-8"
            id="faq"
          >
            <div className="faq-title">
              <span className="section-tag">/ FAQ</span>
              <h2>Частые вопросы о диспетчеризации вентиляции</h2>
              <p>
                Коротко о совместимости, отказоустойчивости и формате работы.
              </p>
            </div>
            <div className="faq-list">
              {faqs.map(([q, a], i) => (
                <div
                  className={`faq-item ${faq === i ? "open" : ""}`}
                  key={q}
                >
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
                      >
                        {a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        </StackSlot>
        <StackSlot>
          <section
            className="contact section stack-panel panel-blue layer-9"
            id="contact"
          >
            <div className="contact-shell">
              {/* Ribbon decoration — white stripes, sweep top-left → bottom-right */}
              <svg className="contact-ribbons" viewBox="0 0 1200 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                <defs>
                  <linearGradient id="ct-rb1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="white" stopOpacity="0"/>
                    <stop offset="30%"  stopColor="white" stopOpacity="0.08"/>
                    <stop offset="50%"  stopColor="white" stopOpacity="0.13"/>
                    <stop offset="70%"  stopColor="white" stopOpacity="0.08"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="ct-rb2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="white" stopOpacity="0"/>
                    <stop offset="40%"  stopColor="white" stopOpacity="0.05"/>
                    <stop offset="60%"  stopColor="white" stopOpacity="0.08"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path
                  d="M -30,60
                     C 80,120  200,300 340,295
                     C 460,290 520,200 620,205
                     C 720,210 800,360 940,365
                     C 1040,369 1120,310 1230,340
                     L 1230,398
                     C 1120,368 1040,427 940,423
                     C 800,418 720,268 620,263
                     C 520,258 460,348 340,353
                     C 200,358 80,178 -30,118
                     Z"
                  fill="url(#ct-rb1)"
                />
                <path
                  d="M -30,-20
                     C 100,40  260,180 400,175
                     C 520,170 580,80  680,78
                     C 800,76  920,160 1230,130
                     L 1230,178
                     C 920,208 800,124 680,126
                     C 580,128 520,218 400,223
                     C 260,228 100,88 -30,28
                     Z"
                  fill="url(#ct-rb2)"
                />
              </svg>
              <div className="contact-copy">
                <span className="section-tag light">
                  / Предварительная концепция
                </span>
                <h2>
                  Подключить вентиляцию
                  <br />
                  объекта
                  <br />
                  <span className="title-accent">к диспетчеризации</span>
                </h2>
                <p>
                  Вы общаетесь напрямую со мной — я и проектирую решение,
                  и сам участвую в запуске на объекте.
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
        </StackSlot>

        <StackSlot>
          <footer
            className="stack-panel footer-dark about-footer layer-10"
            id="about"
          >
            <div className="founder-section">
              <div className="founder-heading">
                <div>
                  <span className="section-tag light">
                    / Лично отвечаю за результат
                  </span>
                  <h2>
                    Меня зовут
                    <br />
                    Павел
                  </h2>
                </div>
                <p>
                  Я инженер по автоматизации. Сам погружаюсь в объект,
                  проектирую архитектуру и остаюсь на связи после запуска.
                </p>
              </div>
              <div className="founder-content">
                <div
                  className="founder-video"
                  aria-label="Место для приветственного видео Павла"
                >
                  <div className="founder-video-grid" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="founder-video-label">
                    <i /> Приветственное видео
                  </span>
                  <div className="founder-play">
                    <Play fill="currentColor" />
                  </div>
                  <div className="founder-video-caption">
                    <strong>Знакомство без презентаций</strong>
                    <span>Скоро здесь появится видео · 02:14</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-row">
              <span>Диспетчеризация вентиляции коммерческих объектов</span>
              <div>
                <PrivacyLink>Конфиденциальность</PrivacyLink>
                <CookieSettingsButton />
                <a href="#faq" onClick={(e) => scrollToSection("#faq", e)}>FAQ</a>
              </div>
              <span>
                © 2026 · Инженерная точность · Разработал сайт —{" "}
                <a
                  href="https://t.me/asphxdel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-credit"
                  onClick={() => track('click_telegram', { location: 'footer', handle: 'asphxdel' })}
                >
                  Илья Хаймин
                </a>
              </span>
            </div>
          </footer>
        </StackSlot>
      </div>
    </main>
  );
}
