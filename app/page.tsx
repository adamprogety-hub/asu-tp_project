"use client";

import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { CookieSettingsButton, PrivacyLink } from "./CookieConsent";
import {
  Activity,
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BellRing,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CircleGauge,
  Clock3,
  Fan,
  Factory,
  FileStack,
  Flame,
  Gauge,
  MapPin,
  Menu,
  MessageCircle,
  Paperclip,
  Phone,
  Play,
  Radio,
  Send,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Thermometer,
  Upload,
  Wifi,
  X,
  Zap,
} from "lucide-react";

const benefits = [
  ["01", "Единая картина", "Все установки, режимы, связь и активные аварии — на одном экране.", CircleGauge],
  ["02", "Аварии сразу", "Ответственные получают уведомление раньше, чем поступит жалоба от персонала.", BellRing],
  ["03", "Диагностика удалённо", "Причина остановки, показания датчиков и состояние приводов видны до выезда.", Wifi],
  ["04", "История объекта", "Архив параметров, графики, события и действия пользователей всегда под рукой.", Activity],
] as const;

const steps = [
  ["01", "Обследование", "Фиксирую состав установок, контроллеры, сигналы и каналы связи.", "60 000"],
  ["02", "Архитектура", "Согласуем экраны, аварии, права, уведомления и хранение данных.", "120 000"],
  ["03", "Проектирование", "Готовлю схемы, перечни сигналов, спецификации и алгоритмы.", "200 000"],
  ["04", "Автоматика", "Подключаю существующие шкафы или модернизирую то, чего не хватает.", "350 000"],
  ["05", "SCADA", "Создаю мнемосхемы, архивы, графики и удалённый доступ.", "300 000"],
  ["06", "ПНР и передача", "Проверяю сценарии на объекте и передаю исходники, схемы и резервные копии.", "200 000"],
] as const;

const scenarios = [
  { label: "Новый объект", title: "Система с нуля", text: "Локальная автоматика и диспетчеризация проектируются как единое целое.", stat: "100%", meta: "единая архитектура" },
  { label: "Действующий", title: "Интеграция без остановки", text: "Сохраняем рабочую автоматику и подключаем её к новой диспетчерской.", stat: "0", meta: "лишних замен" },
  { label: "Модернизация", title: "Обновляем точечно", text: "Меняем устаревшие контроллеры и добавляем только недостающие сигналы.", stat: "1→∞", meta: "масштабирование" },
  { label: "Сеть объектов", title: "Все филиалы в одном окне", text: "Объединяем территориально распределённые здания в общий центр контроля.", stat: "24/7", meta: "единый мониторинг" },
] as const;

const caseStudies = [
  { meta: "Бизнес-центр · 18 400 м² · Москва", title: ["42 установки.", "Один центр контроля."], text: "До проекта — отдельные панели и ручной обход. После — единая SCADA, архивы и Telegram-уведомления.", metrics: [["648", "параметров"], ["37", "типов аварий"], ["8", "экранов"]], variant: 0 },
  { meta: "Офисный комплекс · 8 200 м² · Санкт-Петербург", title: ["12 установок.", "Точный климат по этажам."], text: "Приточные системы связаны общими алгоритмами, расписанием и уставками. Инженер видит всю технологическую цепочку каждой установки.", metrics: [["214", "сигналов"], ["9", "алгоритмов"], ["3", "экрана"]], variant: 1 },
  { meta: "Медицинский центр · 11 600 м² · Казань", title: ["26 зон.", "Воздух под контролем."], text: "Температура и CO₂ контролируются по помещениям, а отклонения автоматически попадают в журнал ответственного инженера.", metrics: [["26", "климатических зон"], ["52", "датчика"], ["4", "уровня доступа"]], variant: 2 },
  { meta: "Гостиничный комплекс · 21 000 м² · Сочи", title: ["−18% энергии.", "Без потери комфорта."], text: "Аналитика выявила одновременный нагрев и охлаждение, лишние ночные режимы и завышенную производительность вентиляторов.", metrics: [["5.4", "МВт·ч экономии"], ["−18%", "за месяц"], ["24/7", "аналитика"]], variant: 3 },
  { meta: "Логистический центр · 36 000 м² · Подмосковье", title: ["Авария видна", "раньше жалобы."], text: "События разделены по приоритетам и автоматически направляются дежурной смене. Эскалация срабатывает, если сообщение не подтверждено.", metrics: [["4:12", "средняя реакция"], ["37", "сценариев аварий"], ["3", "канала связи"]], variant: 4 },
  { meta: "Торговый центр · 47 500 м² · Екатеринбург", title: ["412 кВт.", "Тепло под контролем."], text: "Насосы, клапаны и теплообменник собраны в едином контуре. Диспетчер видит давление, температуры и фактическую нагрузку.", metrics: [["2.8", "bar давление"], ["15.5°", "дельта контура"], ["74%", "нагрузка"]], variant: 5 },
  { meta: "Розничная сеть · 4 объекта · Москва", title: ["4 объекта.", "Одна диспетчерская."], text: "Филиалы объединены защищёнными каналами связи. Центральная служба контролирует установки, аварии и доступность каждого объекта.", metrics: [["38", "установок"], ["99.98%", "доступность"], ["1", "центр контроля"]], variant: 6 },
] as const;

const faqs = [
  ["Можно подключить существующие шкафы?", "Во многих случаях — да. Это зависит от контроллеров, протоколов связи и доступа к программе. Сначала провожу экспресс-аудит и точно отмечаю, что можно сохранить."],
  ["Нужно менять всю автоматику?", "Нет. Я проектирую модернизацию точечно: сохраняю исправное оборудование, добавляю модули связи или заменяю только устаревшие компоненты."],
  ["Что будет при отключении интернета?", "Локальные контроллеры продолжают автономно выполнять алгоритмы и защиты. Временно недоступным становится только удалённый контроль."],
  ["Можно объединить разных производителей?", "Да, если оборудование поддерживает совместимые протоколы или может быть подключено через шлюзы: Modbus, BACnet, OPC UA и другие."],
  ["Можно начать с одной установки?", "Да. Пилот на одной-двух установках позволяет проверить архитектуру, интерфейс и экономический эффект перед масштабированием."],
] as const;

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
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
      <div className="scada-headline"><div><small>Сейчас</small><strong>Объект работает штатно</strong></div><span>03 августа · 14:28</span></div>
      <div className="metric-row">
        <div><span>В работе</span><strong>07</strong><i>из 8 установок</i></div>
        <div><span>Температура</span><strong>21.8°</strong><i>среднее значение</i></div>
        <div><span>Энергия</span><strong>−18%</strong><i>за этот месяц</i></div>
      </div>
      <div className="system-map">
        <div className="unit-card unit-main"><span><StatusDot /> ПВ-01</span><Fan className="spinning" size={42}/><strong>Приточная</strong><small>48.2 Hz · 22.4 °C</small></div>
        <div className="air-line"><i /><i /><i /><i /></div>
        <div className="room-card"><Thermometer size={22}/><strong>Зона A</strong><span>22.1 °C</span><small>CO₂ 612 ppm</small></div>
      </div>
      <div className="chart-card">
        <div className="chart-title"><span>Температура притока</span><b>Последние 24 часа</b></div>
        <div className="chart"><svg viewBox="0 0 600 90" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9d9f0" stopOpacity=".6"/><stop offset="1" stopColor="#a9d9f0" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0,67 C70,54 90,61 135,45 S220,37 270,43 S350,24 400,36 S500,25 600,15 L600,90 L0,90Z"/><path d="M0,67 C70,54 90,61 135,45 S220,37 270,43 S350,24 400,36 S500,25 600,15"/></svg></div>
      </div>
    </>
  );
}

function ScadaScene({ variant }: { variant: number }) {
  if (variant === 0) return <OverviewScene />;
  if (variant === 1) return <>
    <div className="scada-headline"><div><small>ПВ-01 · Автоматический режим</small><strong>Приточная установка</strong></div><span><StatusDot/> Все защиты активны</span></div>
    <div className="metric-row"><div><span>Приток</span><strong>8 420</strong><i>м³/ч</i></div><div><span>Частота</span><strong>48.2</strong><i>Hz</i></div><div><span>Уставка</span><strong>22.0°</strong><i>факт 22.4 °C</i></div></div>
    <div className="tech-flow">
      <div className="flow-node"><small>Наружный воздух</small><strong>−3.2°</strong><span>RH 78%</span></div><div className="flow-pipe"><i/></div>
      <div className="flow-node icon-node"><SlidersHorizontal/><strong>Фильтр</strong><span>68%</span></div><div className="flow-pipe"><i/></div>
      <div className="flow-node icon-node hot"><Flame/><strong>Нагрев</strong><span>62%</span></div><div className="flow-pipe"><i/></div>
      <div className="flow-node icon-node"><Fan className="spinning"/><strong>Вентилятор</strong><span>48.2 Hz</span></div><div className="flow-pipe"><i/></div>
      <div className="flow-node"><small>Приточный воздух</small><strong>22.4°</strong><span>8 420 м³/ч</span></div>
    </div>
    <div className="micro-panels"><div><b>Клапан теплоносителя</b><span className="mini-track"><i style={{width:"62%"}}/></span><small>62%</small></div><div><b>Перепад фильтра</b><span className="mini-track"><i style={{width:"38%"}}/></span><small>184 Pa</small></div></div>
  </>;
  if (variant === 2) return <>
    <div className="scada-headline"><div><small>Бизнес-центр · 4 этажа</small><strong>Климатические зоны</strong></div><span>18 зон · 16 в норме</span></div>
    <div className="zone-layout"><div className="floor-stack">{[4,3,2,1].map((floor)=><div key={floor}><b>0{floor}</b><span className={floor===3?"zone-warn":""}/><span/><span/><span/></div>)}</div><div className="zone-grid">{[["A-401","22.1°","612"],["A-402","21.8°","580"],["B-301","24.6°","980"],["B-302","22.3°","640"],["C-201","21.9°","704"],["C-202","22.0°","618"]].map((z,i)=><div className={i===2?"warn":""} key={z[0]}><span><StatusDot tone={i===2?"warn":"ok"}/>{z[0]}</span><strong>{z[1]}</strong><small>CO₂ {z[2]} ppm</small></div>)}</div></div>
    <div className="micro-panels compact-panels"><div><b>Средняя температура</b><strong>22.2 °C</strong></div><div><b>Качество воздуха</b><strong>92%</strong></div><div><b>Отклонения</b><strong>02</strong></div></div>
  </>;
  if (variant === 3) return <>
    <div className="scada-headline"><div><small>Аналитика · Август</small><strong>Энергопотребление</strong></div><span>Экономия к базовой линии 18%</span></div>
    <div className="energy-layout"><div className="energy-chart"><div className="energy-y"><span>120</span><span>80</span><span>40</span><span>0</span></div><div className="energy-bars">{[62,76,54,88,68,51,64,72,48,59,44,53].map((h,i)=><i key={i} style={{height:`${h}%`}} className={i>8?"saved":""}/>)}</div><div className="base-line">Базовая линия</div></div><div className="energy-summary"><small>Сегодня</small><strong>842</strong><span>кВт·ч</span><div>Прогноз месяца <b>24.8 МВт·ч</b></div><div>Сэкономлено <b>5.4 МВт·ч</b></div></div></div>
    <div className="equipment-load">{[["Вентиляторы","42%"],["Нагрев","31%"],["Охлаждение","18%"],["Прочее","9%"]].map((x,i)=><div key={x[0]}><i className={`load-c${i}`}/><span>{x[0]}</span><b>{x[1]}</b></div>)}</div>
  </>;
  if (variant === 4) return <>
    <div className="scada-headline"><div><small>Журнал · Последние 24 часа</small><strong>Аварии и события</strong></div><span>Среднее время реакции 4:12</span></div>
    <div className="alarm-layout"><div className="alarm-ring"><div><strong>03</strong><span>активные</span></div></div><div className="alarm-list">{[["Критическая","ВУ-04 · Нет связи с контроллером","13:54"],["Внимание","ПВ-08 · Фильтр загрязнён на 82%","14:26"],["Внимание","ПВ-06 · Температура выше уставки","12:48"],["Событие","ПВ-01 · Запуск по расписанию","09:00"]].map((x,i)=><div key={x[1]} className={i===0?"critical":""}><i/><span><b>{x[0]}</b><small>{x[1]}</small></span><time>{x[2]}</time></div>)}</div></div>
    <div className="alarm-footer"><span><Check/> 24 события подтверждено</span><span><BellRing/> Telegram-канал активен</span><span><Clock3/> Эскалация через 10 мин</span></div>
  </>;
  if (variant === 5) return <>
    <div className="scada-headline"><div><small>Контур К1 · Автоматический режим</small><strong>Тепловой контур</strong></div><span><StatusDot/> Давление стабильно</span></div>
    <div className="hydro-scheme"><div className="hydro-source"><Flame/><b>Теплообменник</b><strong>68.4 °C</strong></div><div className="hydro-line supply"><i/><span>Подача 64.2 °C</span></div><div className="hydro-load"><Factory/><b>Калориферы</b><strong>412 kW</strong></div><div className="hydro-line return"><i/><span>Обратка 48.7 °C</span></div><div className="pump"><Fan className="spinning"/><span>Н-01</span><b>42.8 Hz</b></div><div className="valve"><SlidersHorizontal/><span>Клапан</span><b>62%</b></div></div>
    <div className="metric-row hydro-metrics"><div><span>Давление</span><strong>2.8 bar</strong><i>норма</i></div><div><span>ΔT контура</span><strong>15.5 °C</strong><i>расчёт 16 °C</i></div><div><span>Мощность</span><strong>412 kW</strong><i>нагрузка 74%</i></div></div>
  </>;
  return <>
    <div className="scada-headline"><div><small>Распределённая система</small><strong>Сеть объектов</strong></div><span>4 объекта · 38 установок</span></div>
    <div className="network-map"><div className="network-core"><Server/><strong>AERON CLOUD</strong><span>OPC UA / VPN</span></div>{[["Москва","12 установок","ok","n1"],["Химки","8 установок","ok","n2"],["Подольск","10 установок","warn","n3"],["Одинцово","8 установок","ok","n4"]].map((n)=><div className={`site-node ${n[3]}`} key={n[0]}><MapPin/><span><b>{n[0]}</b><small>{n[1]}</small></span><StatusDot tone={n[2]==="warn"?"warn":"ok"}/></div>)}</div>
    <div className="network-footer"><span><Wifi/> Каналы связи защищены</span><span><Activity/> 99.98% доступность</span><span><BellRing/> 1 предупреждение</span></div>
  </>;
}

function MiniScada({ variant = 0 }: { variant?: number }) {
  const activeNav = variant === 3 ? 3 : variant === 4 ? 2 : variant === 0 ? 0 : 1;
  return (
    <div className={`scada-shell variant-${variant}`}>
      <div className="scada-top">
        <div><span className="window-dot" /><span className="window-dot" /><span className="window-dot" /></div>
        <span>Центр управления / {scadaSlides[variant][0]}</span>
        <span className="live"><StatusDot /> LIVE</span>
      </div>
      <div className="scada-body">
        <aside className="scada-side">
          <div className="side-brand"><Fan size={18} /> AERON</div>
          {["Обзор", "Установки", "Аварии", "Аналитика"].map((x, i) => <span className={i === activeNav ? "active" : ""} key={x}>{x}</span>)}
          <div className="side-bottom">Связь стабильна <Wifi size={13} /></div>
        </aside>
        <div className="scada-main"><ScadaScene variant={variant}/></div>
      </div>
      {variant===0&&<div className="alarm-toast"><span><BellRing size={15}/></span><div><b>ПВ-08 · Требует внимания</b><small>Фильтр загрязнён на 82%</small></div><time>14:26</time></div>}
    </div>
  );
}

function AnimatedMiniScada({ variant, direction }: { variant: number; direction: number }) {
  const activeNav = variant === 3 ? 3 : variant === 4 ? 2 : variant === 0 ? 0 : 1;
  return <div className={`scada-shell animated-scada variant-${variant}`}>
    <div className="scada-top"><div><span className="window-dot"/><span className="window-dot"/><span className="window-dot"/></div><AnimatePresence initial={false} mode="wait"><motion.span key={variant} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:.38}}>Центр управления / {scadaSlides[variant][0]}</motion.span></AnimatePresence><span className="live"><StatusDot/> LIVE</span></div>
    <div className="scada-body">
      <aside className="scada-side"><div className="side-brand"><Fan size={18}/> AERON</div>{["Обзор","Установки","Аварии","Аналитика"].map((x,i)=><span className={i===activeNav?"active":""} key={x}>{x}</span>)}<div className="side-bottom">Связь стабильна <Wifi size={13}/></div></aside>
      <div className="scada-main"><div className="scada-scene-stack"><AnimatePresence initial={false} mode="sync" custom={direction}><motion.div className="scada-scene-layer" key={variant} initial={{opacity:0,x:direction*12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:direction*-8}} transition={{duration:.68,delay:.18,ease:[.22,1,.36,1]}}><ScadaScene variant={variant}/></motion.div></AnimatePresence></div></div>
    </div>
    <AnimatePresence initial={false}>{variant===0&&<motion.div className="alarm-toast" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{delay:.42,duration:.45}}><span><BellRing size={15}/></span><div><b>ПВ-08 · Требует внимания</b><small>Фильтр загрязнён на 82%</small></div><time>14:26</time></motion.div>}</AnimatePresence>
    <motion.div className={`airflow-sweep ${direction<0?"reverse":""}`} key={`air-${variant}`} initial={{x:direction>0?"-180%":"480%",opacity:0}} animate={{x:direction>0?"480%":"-180%",opacity:[0,.9,.72,0]}} transition={{duration:1.08,times:[0,.18,.72,1],ease:[.32,0,.18,1]}} aria-hidden="true"/>
  </div>;
}

function ScadaCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const move = (next:number) => { const normalized=(next+7)%7; setDirection(next>active||(active===6&&normalized===0)?1:-1); setActive(normalized); };
  useEffect(() => { if (paused) return; const id = window.setInterval(() => move((active+1)%7), 6000); return () => window.clearInterval(id); }, [active, paused]);
  return <div className="scada-carousel" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
    <div className="scada-stage"><AnimatedMiniScada variant={active} direction={direction}/></div>
    <div className="carousel-controls">
      <div className="carousel-caption"><span>{String(active+1).padStart(2,"0")} / 07</span><div><strong>{scadaSlides[active][0]}</strong><small>{scadaSlides[active][1]}</small></div></div>
      <div className="carousel-dots">{scadaSlides.map((slide,i)=><button key={slide[0]} className={active===i?"active":""} onClick={()=>move(i)} aria-label={`Показать: ${slide[0]}`}><i/></button>)}</div>
      <div className="carousel-arrows"><button onClick={()=>move(active-1)} aria-label="Предыдущая мнемосхема"><ChevronLeft/></button><button onClick={()=>move(active+1)} aria-label="Следующая мнемосхема"><ChevronRight/></button></div>
    </div>
  </div>;
}

function LeadForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const addFiles = (incoming: FileList | File[]) => setFiles((current) => {
    const merged = [...current, ...Array.from(incoming)].filter((file, index, all) => all.findIndex((item) => item.name === file.name && item.size === file.size) === index);
    return merged.slice(0, 10);
  });
  const fileSize = (bytes:number) => bytes < 1024 * 1024 ? `${Math.max(1,Math.round(bytes/1024))} КБ` : `${(bytes/1024/1024).toFixed(1)} МБ`;
  return (
    <form className={`lead-form ${compact ? "compact" : ""}`} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <div className="field-grid">
        <label><span>Ваше имя</span><input required placeholder="Как к вам обращаться?" /></label>
        <label><span>Телефон или почта</span><input required placeholder="+7 999 000 00 00 или name@company.ru" /></label>
        {!compact && <label><span>Тип объекта</span><div className="select-control"><select defaultValue=""><option value="" disabled>Выберите объект</option><option>Бизнес-центр</option><option>Торговый объект</option><option>Медицинский центр</option><option>Гостиница</option><option>Склад / производство</option><option>Другое</option></select><ChevronDown aria-hidden="true"/></div></label>}
        {!compact && <label><span>Количество установок</span><input type="number" min="1" placeholder="Например, 8" /></label>}
      </div>
      {!compact && <label className="wide-field"><span>Коротко о задаче</span><textarea placeholder="Что нужно объединить и контролировать?" /></label>}
      {!compact && <div className="file-upload-block">
        <label className="file-drop" onDragOver={(event)=>event.preventDefault()} onDrop={(event)=>{event.preventDefault();addFiles(event.dataTransfer.files)}}>
          <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.dwg,.dxf,.zip,.rar,.7z,.txt" onChange={(event)=>event.target.files&&addFiles(event.target.files)}/>
          <i><Upload/></i><span><strong>Приложить файлы</strong><small>Перетащите сюда или выберите на устройстве</small></span><b>до 10 файлов</b>
        </label>
        {files.length>0&&<div className="file-list" aria-label="Выбранные файлы">{files.map((file)=><div className="file-chip" key={`${file.name}-${file.size}`}><Paperclip/><span><strong>{file.name}</strong><small>{fileSize(file.size)}</small></span><button type="button" onClick={()=>setFiles((current)=>current.filter((item)=>item!==file))} aria-label={`Удалить ${file.name}`}><X/></button></div>)}</div>}
      </div>}
      <div className="form-consents">
        <label className="consent-check"><input type="checkbox" required/><i><Check/></i><span>Я даю согласие на обработку персональных данных и принимаю <PrivacyLink>Политику конфиденциальности</PrivacyLink>.</span></label>
        <label className="consent-check optional"><input type="checkbox"/><i><Check/></i><span>Согласен получать полезные материалы и информацию о решениях AERON. Необязательно.</span></label>
      </div>
      <button className="button dark wide" type="submit">{sent ? <><Check size={18}/> Заявка принята</> : <>Получить предварительную концепцию <ArrowRight size={18}/></>}</button>
      <p>{sent ? "Спасибо. Инженер свяжется с вами и уточнит исходные данные." : "PDF, фото, документы, таблицы, архивы и CAD-файлы. До 10 файлов. Нажимая кнопку, вы соглашаетесь с обработкой данных."}</p>
    </form>
  );
}

const contactLinks = {
  telegram: "",
  max: "",
};

const contactPhone = {
  label: "+7 999 000-00-00",
  href: "tel:+79990000000",
};

function getFloatingNavigationTargets() {
  const hero = document.querySelector<HTMLElement>(".hero");
  const panels = Array.from(document.querySelectorAll<HTMLElement>(".stack-panel"));
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

function FloatingActions({ visible }: { visible: boolean }) {
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
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
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
      setHasNextSection(getCurrentNavigationIndex(targets) < targets.length - 1);
      const x = Math.max(1, window.innerWidth - 52);
      const y = Math.max(1, window.innerHeight - 52);
      const underneath = document.elementsFromPoint(x, y).filter((element) => !element.closest(".floating-actions"));
      const activePanel = underneath
        .map((element) => element.closest<HTMLElement>(".stack-panel, .hero"))
        .find((element): element is HTMLElement => Boolean(element));

      if (activePanel) {
        setOnDarkBackground(activePanel.matches(".footer-dark, .problem-section"));
        return;
      }

      const background = underneath
        .map((element) => getComputedStyle(element).backgroundColor)
        .map((color) => color.match(/rgba?\((\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)(?:[, /]+(\d+(?:\.\d+)?))?\)/))
        .find((match) => match && (match[4] === undefined || Number(match[4]) > 0.1));

      if (background) {
        const [, red, green, blue] = background;
        const luminance = (0.2126 * Number(red) + 0.7152 * Number(green) + 0.0722 * Number(blue)) / 255;
        setOnDarkBackground(luminance < 0.46);
      }
    };
    const scheduleDetection = () => {
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
    window.scrollTo({ top: Math.max(0, targetTop - (isFooter ? 6 : 8)), behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={actionsRef}
          className={`floating-actions ${onDarkBackground ? "on-dark" : "on-light"}`}
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <button className="floating-button" type="button" onClick={navigateToHero} aria-label="В начало сайта">
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
                  <button type="button" role="menuitem" aria-disabled={!contactLinks.telegram} onClick={() => openContact(contactLinks.telegram)}>
                    <i className="social-mark telegram"><Send /></i>
                    <strong>Telegram</strong>
                    {!contactLinks.telegram && <small>ссылка скоро</small>}
                    <ArrowRight />
                  </button>
                  <button type="button" role="menuitem" aria-disabled={!contactLinks.max} onClick={() => openContact(contactLinks.max)}>
                    <i className="social-mark max">MAX</i>
                    <strong>MAX</strong>
                    {!contactLinks.max && <small>ссылка скоро</small>}
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
              aria-label={socialsOpen ? "Закрыть меню социальных сетей" : "Открыть социальные сети"}
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
                  <a href={contactPhone.href}>
                    <i><Phone /></i>
                    <span><small>Телефон</small><strong>{contactPhone.label}</strong></span>
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
              aria-label={phoneOpen ? "Закрыть номер телефона" : "Показать номер телефона"}
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
}: {
  step: (typeof steps)[number];
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const position = useTransform(progress, (value) => index - value * (steps.length - 1));
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
            <div className="process-price"><small>Стоимость</small><strong>от {price} ₽</strong></div>
            <a className="process-cta" href="#contact">Обсудить задачу <ArrowRight size={18}/></a>
          </div>
        </div>
        <div className="process-card-icon-zone" aria-hidden="true" />
      </div>
    </motion.article>
  );
}

function ProcessSegment({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const fill = useTransform(progress, (value) => Math.max(0, Math.min(1, value * (steps.length - 1) - index + 1)));
  return <span className="process-segment"><b>{String(index + 1).padStart(2, "0")}</b><i><motion.em style={{ scaleX: fill }}/></i></span>;
}

function ProcessFlow() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const deckProgress = useSpring(scrollYProgress, { stiffness: 95, damping: 26, restDelta: 0.001 });

  return (
    <section className="process-runway" id="process" ref={ref}>
      <div className="process process-sticky stack-panel panel-paper layer-4">
        <div className="section-heading split">
          <div><span className="section-tag">/ Полный цикл</span><h2>Закрываю весь технический контур проекта</h2></div>
          <p>Шесть последовательных этапов — от первого сигнала в шкафу до готового экрана диспетчерской.</p>
        </div>
        <div className="process-deck" aria-label="Этапы и стоимость работ">
          {steps.map((step, index) => <ProcessCard key={step[0]} step={step} index={index} progress={deckProgress} reduceMotion={reduceMotion}/>) }
        </div>
        <div className="process-pagination" aria-hidden="true">
          {steps.map((step, index) => <ProcessSegment key={step[0]} index={index} progress={deckProgress}/>) }
          <span className="process-scroll-hint">Листайте вниз</span>
        </div>
        <p className="process-note">Ориентировочная стоимость типового стартового объёма. Оборудование, лицензии и выезды рассчитываются отдельно.</p>
      </div>
    </section>
  );
}

function StackSlot({ children }: { children: ReactNode }) {
  return <div className="stack-slot">{children}</div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scenario, setScenario] = useState(0);
  const [faq, setFaq] = useState(0);
  const [heroPassed, setHeroPassed] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [caseDirection, setCaseDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });
  const heroCopyY = useTransform(scrollYProgress, [0, .09], [0, reduceMotion ? 0 : 130]);
  const heroCopyOpacity = useTransform(scrollYProgress, [0, .065], [1, reduceMotion ? 1 : 0]);
  const heroCopyBlur = useTransform(scrollYProgress, [0, .065], ["blur(0px)", reduceMotion ? "blur(0px)" : "blur(10px)"]);
  const heroEquipmentY = useTransform(scrollYProgress, [0, .075], [0, reduceMotion ? 0 : 95]);
  const heroVisualY = useTransform(scrollYProgress, [0, .12], [0, reduceMotion ? 0 : -70]);
  const heroVisualScale = useTransform(scrollYProgress, [0, .12], [1, reduceMotion ? 1 : 0.965]);
  const heroOrbY = useTransform(scrollYProgress, [0, .12], [0, reduceMotion ? 0 : 180]);
  const caseVisualY = useTransform(scrollYProgress, [.48, .78], [reduceMotion ? 0 : 54, reduceMotion ? 0 : -54]);
  const moveCase = (next:number) => { const normalized=(next+caseStudies.length)%caseStudies.length; setCaseDirection(next>activeCase||(activeCase===caseStudies.length-1&&normalized===0)?1:-1); setActiveCase(normalized); };
  const scrollToContact = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const contactPanel = document.querySelector<HTMLElement>("#contact");
    if (!contactPanel) return;
    const slot = contactPanel.closest<HTMLElement>(".stack-slot");
    const target = slot && slot.getBoundingClientRect().height > 1 ? slot : contactPanel;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    window.history.replaceState(null, "", "#contact");
    window.scrollTo({ top: Math.max(0, targetTop - 8), behavior: "smooth" });
  };
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1001px) and (min-height: 760px)");
    const panels = Array.from(document.querySelectorAll<HTMLElement>(".stack-panel"));
    const entries = panels.map((panel) => ({
      panel,
      anchor: panel.closest<HTMLElement>(".stack-slot, .process-runway"),
    }));
    let frame = 0;
    const resetPanelMotion = (panel: HTMLElement) => {
      panel.classList.remove("is-pinned", "is-being-covered", "is-entering", "is-depth-active", "is-content-hidden");
      panel.style.removeProperty("--stack-content-y");
      panel.style.removeProperty("--stack-content-opacity");
    };
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const smoothstep = (value: number) => value * value * (3 - 2 * value);

    const updatePinnedPanels = () => {
      frame = 0;
      if (!media.matches) {
        panels.forEach(resetPanelMotion);
        return;
      }
      const viewportSpan = Math.max(1, window.innerHeight - 8);
      const remainingScroll = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      const anchorTops = entries.map(({ anchor }) => anchor?.getBoundingClientRect().top ?? window.innerHeight);
      const pinnedStates = entries.map(({ panel }, index) => {
        const anchorTop = anchorTops[index];
        const reachedAnchor = anchorTop <= 8.5;
        const reachedTerminalPosition = panel.tagName === "FOOTER" && remainingScroll <= 12;
        return reachedAnchor || reachedTerminalPosition;
      });
      let activeIndex = -1;
      pinnedStates.forEach((isPinned, index) => {
        if (isPinned) activeIndex = index;
      });
      const enteringIndex = activeIndex + 1 < entries.length && anchorTops[activeIndex + 1] < window.innerHeight
        ? activeIndex + 1
        : -1;
      const enteringProgress = enteringIndex >= 0
        ? smoothstep(clamp((window.innerHeight - anchorTops[enteringIndex]) / viewportSpan))
        : 0;
      const coverProgress = enteringIndex >= 0
        ? smoothstep(clamp((enteringProgress - 0.08) / 0.82))
        : 0;

      entries.forEach(({ panel }, index) => {
        panel.classList.toggle("is-pinned", pinnedStates[index]);
        panel.classList.toggle("is-content-hidden", index < activeIndex);
        panel.classList.toggle("is-being-covered", index === activeIndex && coverProgress > 0.002);
        panel.classList.toggle("is-entering", index === enteringIndex);
        panel.classList.toggle("is-depth-active", index === activeIndex || index === enteringIndex);

        if (index === activeIndex) {
          panel.style.setProperty("--stack-content-y", `${(-coverProgress * 18).toFixed(2)}px`);
          panel.style.setProperty("--stack-content-opacity", `${(1 - coverProgress).toFixed(4)}`);
        } else if (index === enteringIndex) {
          panel.style.setProperty("--stack-content-y", `${((1 - enteringProgress) * 28).toFixed(2)}px`);
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
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroPassed(!entry.isIntersecting), { threshold: 0.01 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <motion.div className="progress" style={{ scaleX }} />
      <FloatingActions visible={heroPassed} />
      <nav className="nav">
        <a className="logo" href="#top" aria-label="AERON — на главную"><span>AER</span><Fan size={20}/><span>N</span></a>
        <div className="nav-links">
          <a href="#result">Возможности</a><a href="#process">Как работаю</a><a href="#cases">Кейс</a><a href="#faq">Вопросы</a>
        </div>
        <a className="nav-cta" href="#contact">Обсудить объект <ArrowDownRight size={16}/></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">{menuOpen ? <X/> : <Menu/>}</button>
      </nav>
      <AnimatePresence>{menuOpen && <motion.div className="mobile-menu" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><a href="#result" onClick={()=>setMenuOpen(false)}>Возможности</a><a href="#process" onClick={()=>setMenuOpen(false)}>Как работаю</a><a href="#cases" onClick={()=>setMenuOpen(false)}>Кейс</a><a className="mobile-menu-cta" href="#contact" onClick={()=>setMenuOpen(false)}>Обсудить объект <ArrowDownRight size={17}/></a></motion.div>}</AnimatePresence>

      <section className="hero" id="top">
        <motion.div className="hero-orb one" style={{y:heroOrbY}}/><div className="hero-orb two"/>
        <motion.div className="hero-equipment" style={{y:heroEquipmentY,opacity:heroCopyOpacity,filter:heroCopyBlur}} aria-hidden="true">
          <motion.div className="equipment-piece cabinet" initial={{opacity:0,x:-150,rotate:-18,scale:.92}} animate={{opacity:1,x:0,rotate:-10,scale:1}} transition={{duration:1.15,delay:.22,ease:[.22,1,.36,1]}}>
            <img src="/images/hero/control-cabinet.png" alt="" />
          </motion.div>
          <motion.div className="equipment-piece industrial-fan" initial={{opacity:0,x:150,rotate:18,scale:.92}} animate={{opacity:1,x:0,rotate:9,scale:1}} transition={{duration:1.15,delay:.3,ease:[.22,1,.36,1]}}>
            <img src="/images/hero/industrial-fan.png" alt="" />
          </motion.div>
        </motion.div>
        <motion.div className="hero-copy-scroll" style={{y:heroCopyY,opacity:heroCopyOpacity,filter:heroCopyBlur}}>
        <motion.div className="hero-copy" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.8}}>
          <div className="hero-labels" aria-label="SCADA и HVAC для коммерческих объектов">
            <span className="hero-label primary">SCADA / HVAC</span>
            <span className="hero-label secondary">Коммерческие объекты</span>
          </div>
          <h1>Вся вентиляция<br/>объекта — <span className="title-accent">в одном</span><br/>понятном интерфейсе</h1>
          <p>Объединяю установки, существующую автоматику, SCADA, архивы и аварийные уведомления в систему, которой удобно пользоваться каждый день.</p>
          <div className="hero-actions"><a className="button dark" href="#contact">Получить решение <ArrowRight size={18}/></a><a className="text-link" href="#cases"><span className="play">▶</span> Смотреть демо</a></div>
        </motion.div>
        </motion.div>
        <motion.div className="hero-visual" style={{y:heroVisualY,scale:heroVisualScale}}><motion.div initial={{opacity:0,y:50,rotateX:5}} animate={{opacity:1,y:0,rotateX:0}} transition={{duration:1,delay:.15,ease:[.22,1,.36,1]}}><ScadaCarousel/></motion.div></motion.div>
        <div className="hero-ticker"><span>MODBUS TCP</span><i/><span>BACNET</span><i/><span>OPC UA</span><i/><span>SCADA</span><i/><span>24/7 МОНИТОРИНГ</span></div>
      </section>

      <div className="stack-root">
      <StackSlot>
      <motion.section className="intro section stack-panel panel-paper layer-1" {...reveal}>
        <span className="section-tag">/ Результат</span>
        <h2>Не просто визуализация.<br/><span>Рабочий инструмент эксплуатации.</span></h2>
        <p className="section-lead">Техническая служба видит состояние всего объекта, понимает причину аварии и принимает решение на основании данных — ещё до выезда инженера.</p>
        <div className="benefit-grid" id="result">{benefits.map(([n,title,text,Icon],i)=><motion.article key={n} className="benefit-card" initial={{opacity:0,y:44,scale:.985}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true,margin:"-70px"}} transition={{duration:.7,delay:i*.09,ease:[.22,1,.36,1]}}><div className="card-top"><span>{n}</span><Icon size={24}/></div><h3>{title}</h3><p>{text}</p><ArrowDownRight className="card-arrow" size={20}/></motion.article>)}</div>
      </motion.section>
      </StackSlot>

      <StackSlot>
      <section className="problem-section stack-panel layer-2">
        <motion.div className="problem-copy" {...reveal}><span className="section-tag">/ До диспетчеризации</span><h2>Когда каждая установка работает сама по себе</h2><p>О проблеме узнают после жалоб, диагностика требует выезда, а история параметров теряется. Разрозненные панели не дают общей картины.</p><a className="text-link white" href="#audit">Проверить свой объект <ArrowRight size={17}/></a></motion.div>
        <motion.div className="problem-console" initial={{opacity:0,x:55}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:"-90px"}} transition={{duration:.85,ease:[.22,1,.36,1]}}>
          <div className="console-head"><span>Журнал событий</span><b><StatusDot tone="warn"/> 3 требуют внимания</b></div>
          {[
            ["14:26:08","ПВ-08","Фильтр загрязнён","warning"],
            ["13:54:31","ВУ-04","Нет связи с контроллером","alarm"],
            ["12:18:02","ПВ-01","Режим изменён: АВТО","normal"],
            ["09:00:00","ПВ-03","Запуск по расписанию","normal"],
          ].map((x,i)=><motion.div className="console-row" key={x[0]} initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.5,delay:.22+i*.08}}><time>{x[0]}</time><strong>{x[1]}</strong><span>{x[2]}</span><i className={x[3]}>{x[3]==="normal"?"Событие":x[3]==="alarm"?"Авария":"Внимание"}</i></motion.div>)}
          <div className="console-stats"><div><small>Среднее время реакции</small><strong>4:12</strong><span>минут</span></div><div><small>Выездов предотвращено</small><strong>12</strong><span>за квартал</span></div></div>
        </motion.div>
      </section>
      </StackSlot>

      <StackSlot>
      <section className="audit section stack-panel panel-ice layer-3" id="audit">
        <motion.div className="audit-card" {...reveal}>
          <div className="audit-copy"><span className="section-tag">/ Бесплатный экспресс-аудит</span><h2>Можно ли подключить ваш объект к единой диспетчерской?</h2><p>Пришлите перечень оборудования, схемы или фотографии шкафов. Я отмечу, что можно сохранить, где нужна модернизация и какие данные получится вывести.</p><ul><li><Check/> Карта подключения</li><li><Check/> Состав проекта</li><li><Check/> Недостающие данные</li></ul></div>
          <LeadForm compact />
        </motion.div>
      </section>
      </StackSlot>

      <ProcessFlow />

      <StackSlot>
      <section className="scenario-section section stack-panel panel-white layer-5">
        <div className="section-heading"><span className="section-tag">/ Для каких объектов</span><h2>Новый, действующий<br/>или распределённый</h2></div>
        <motion.div className="scenario-layout" initial={{opacity:0,y:48}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-80px"}} transition={{duration:.8,ease:[.22,1,.36,1]}}>
          <div className="scenario-tabs">{scenarios.map((x,i)=><button key={x.label} className={scenario===i?"active":""} onClick={()=>setScenario(i)}><span>0{i+1}</span>{x.label}<ArrowRight/></button>)}</div>
          <AnimatePresence mode="wait"><motion.div key={scenario} className="scenario-card" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:.35}}><div className="scenario-blueprint"><div className="building"><Building2/><span className="signal s1"/><span className="signal s2"/><span className="signal s3"/></div><div className="radar r1"/><div className="radar r2"/><span className="blueprint-label">Объект / {String(scenario+1).padStart(2,"0")}</span></div><div className="scenario-info"><span>{scenarios[scenario].label}</span><h3>{scenarios[scenario].title}</h3><p>{scenarios[scenario].text}</p><div className="big-stat"><strong>{scenarios[scenario].stat}</strong><small>{scenarios[scenario].meta}</small></div></div></motion.div></AnimatePresence>
        </motion.div>
      </section>
      </StackSlot>

      <StackSlot>
      <section className="case section stack-panel panel-mist layer-6" id="cases">
        <motion.div className="case-carousel" {...reveal}>
            <motion.div
              className="case-shell"
              drag="x"
              dragDirectionLock
              dragConstraints={{left:0,right:0}}
              dragElastic={.06}
              onDragEnd={(_,info)=>{if(info.offset.x<-60)moveCase(activeCase+1);if(info.offset.x>60)moveCase(activeCase-1)}}
            >
              <div className="case-top">
                <span className="section-tag light">/ Реальный результат</span>
                <div className="case-top-right"><AnimatePresence initial={false} mode="wait"><motion.span key={activeCase} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.35,ease:[.22,1,.36,1]}}>{caseStudies[activeCase].meta}</motion.span></AnimatePresence><div className="case-arrows"><button onClick={()=>moveCase(activeCase-1)} aria-label="Предыдущий кейс"><ChevronLeft/></button><b>{String(activeCase+1).padStart(2,"0")} / 07</b><button onClick={()=>moveCase(activeCase+1)} aria-label="Следующий кейс"><ChevronRight/></button></div></div>
              </div>
              <div className="case-grid">
                <AnimatePresence initial={false} mode="sync"><motion.div className="case-copy" key={activeCase} initial={{opacity:0,x:caseDirection*12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:caseDirection*-8}} transition={{duration:.68,delay:.16,ease:[.22,1,.36,1]}}>
                  <h2><span>{caseStudies[activeCase].title[0]}</span><br/><span>{caseStudies[activeCase].title[1]}</span></h2>
                  <p>{caseStudies[activeCase].text}</p>
                  <div className="case-numbers">{caseStudies[activeCase].metrics.map(([value,label],index)=><motion.div key={label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.3+index*.07,duration:.5}}><strong>{value}</strong><span>{label}</span></motion.div>)}</div>
                  <div className="case-actions"><a className="button light-button" href="#contact">Получить демонстрацию <ArrowRight/></a><div className="case-dots">{caseStudies.map((item,index)=><button key={item.meta} className={index===activeCase?"active":""} onClick={()=>moveCase(index)} aria-label={`Показать кейс ${index+1}`}><i/></button>)}</div></div>
                </motion.div></AnimatePresence>
                <motion.div className="case-ui" style={{y:caseVisualY}}><AnimatedMiniScada variant={caseStudies[activeCase].variant} direction={caseDirection}/></motion.div>
              </div>
              <motion.div className={`case-airflow-sweep ${caseDirection<0?"reverse":""}`} key={`case-air-${activeCase}`} initial={{x:caseDirection>0?"-180%":"500%",opacity:0}} animate={{x:caseDirection>0?"500%":"-180%",opacity:[0,.55,.38,0]}} transition={{duration:1.16,times:[0,.2,.7,1],ease:[.32,0,.18,1]}} aria-hidden="true"/>
            </motion.div>
        </motion.div>
      </section>
      </StackSlot>

      <StackSlot>
      <section className="trust section stack-panel panel-paper layer-7">
        <motion.div className="trust-heading" {...reveal}><span className="section-tag">/ Инженерный подход</span><h2>Система не станет<br/><span className="title-accent">«чёрным ящиком»</span></h2></motion.div>
        <div className="trust-grid"><motion.article initial={{opacity:0,y:38}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-70px"}} transition={{duration:.7}}><ShieldCheck/><h3>Автономность</h3><p>Локальная автоматика продолжает работать и выполнять защиты даже без связи с диспетчерской.</p></motion.article><motion.article initial={{opacity:0,y:38}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-70px"}} transition={{duration:.7,delay:.1}}><FileStack/><h3>Исходники у вас</h3><p>Передаю схемы, программы, резервные копии, сетевые параметры и инструкции.</p></motion.article><motion.article initial={{opacity:0,y:38}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-70px"}} transition={{duration:.7,delay:.2}}><SlidersHorizontal/><h3>Прозрачные этапы</h3><p>Функции, сигналы, сроки, границы ответственности и комплект документов фиксируются заранее.</p></motion.article></div>
      </section>
      </StackSlot>

      <StackSlot>
      <section className="faq section stack-panel panel-white layer-8" id="faq">
        <div className="faq-title"><span className="section-tag">/ FAQ</span><h2>Частые вопросы</h2><p>Коротко о совместимости, отказоустойчивости и формате работы.</p></div>
        <div className="faq-list">{faqs.map(([q,a],i)=><motion.div className={`faq-item ${faq===i?"open":""}`} key={q} initial={{opacity:0,x:28}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:.55,delay:i*.055}}><button onClick={()=>setFaq(faq===i?-1:i)}><span>0{i+1}</span><strong>{q}</strong><ChevronDown/></button><AnimatePresence initial={false}>{faq===i&&<motion.p initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>{a}</motion.p>}</AnimatePresence></motion.div>)}</div>
      </section>
      </StackSlot>
      <StackSlot>
      <section className="contact section stack-panel panel-blue layer-9" id="contact">
        <motion.div className="contact-shell" {...reveal}>
          <div className="contact-copy"><span className="section-tag light">/ Предварительная концепция</span><h2>Давайте соберём<br/>ваш объект<br/><span className="title-accent">в одну систему</span></h2><p>Вы общаетесь напрямую с инженером, который проектирует решение и участвует в запуске.</p><div className="contact-meta"><span><Radio/> Ответ в течение рабочего дня</span><span><Clock3/> Первый разбор — бесплатно</span></div></div>
          <LeadForm />
        </motion.div>
      </section>
      </StackSlot>

      <StackSlot>
      <footer className="stack-panel footer-dark about-footer layer-10" id="about">
        <div className="founder-section">
          <div className="founder-heading">
            <div><span className="section-tag light">/ Лично отвечаю за результат</span><h2>Меня зовут<br/>Павел</h2></div>
            <p>Я инженер по автоматизации. Сам погружаюсь в объект, проектирую архитектуру и остаюсь на связи после запуска.</p>
          </div>
          <div className="founder-content">
            <div className="founder-video" aria-label="Место для приветственного видео Павла">
              <div className="founder-video-grid" aria-hidden="true"><span/><span/><span/><span/><span/><span/></div>
              <span className="founder-video-label"><i/> Приветственное видео</span>
              <div className="founder-play"><Play fill="currentColor"/></div>
              <div className="founder-video-caption"><strong>Знакомство без презентаций</strong><span>Скоро здесь появится видео · 02:14</span></div>
            </div>
            <aside className="founder-facts">
              <span>Коротко обо мне</span>
              <p>Не передаю проект между отделами: один человек отвечает за техническую логику, интерфейс и итог на объекте.</p>
              <div className="founder-fact-list">
                <div><b>01</b><strong>Инженер АСУ ТП</strong><small>Проектирование и запуск</small></div>
                <div><b>02</b><strong>Полный цикл</strong><small>От обследования до ПНР</small></div>
                <div><b>03</b><strong>Прямая связь</strong><small>Без менеджеров-посредников</small></div>
              </div>
              <a className="founder-cta" href="#contact" onClick={scrollToContact}><span><small>Перейти к форме заявки</small><strong>Описать ваш объект</strong></span><ArrowUpRight/></a>
            </aside>
          </div>
        </div>
        <div className="footer-row"><span>Диспетчеризация вентиляции коммерческих объектов</span><div><PrivacyLink>Конфиденциальность</PrivacyLink><CookieSettingsButton/><a href="#faq">FAQ</a></div><span>© 2026 · Инженерная точность</span></div>
      </footer>
      </StackSlot>
      </div>
    </main>
  );
}
