"use client";

import { useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BellRing,
  Building2,
  Check,
  ChevronDown,
  CircleGauge,
  Clock3,
  Fan,
  FileStack,
  Gauge,
  Menu,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Thermometer,
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
  ["01", "Обследование", "Фиксирую состав установок, контроллеры, сигналы и каналы связи."],
  ["02", "Архитектура", "Согласуем экраны, аварии, права, уведомления и хранение данных."],
  ["03", "Проектирование", "Готовлю схемы, перечни сигналов, спецификации и алгоритмы."],
  ["04", "Автоматика", "Подключаю существующие шкафы или модернизирую то, чего не хватает."],
  ["05", "SCADA", "Создаю мнемосхемы, архивы, графики и удалённый доступ."],
  ["06", "ПНР и передача", "Проверяю сценарии на объекте и передаю исходники, схемы и резервные копии."],
] as const;

const scenarios = [
  { label: "Новый объект", title: "Система с нуля", text: "Локальная автоматика и диспетчеризация проектируются как единое целое.", stat: "100%", meta: "единая архитектура" },
  { label: "Действующий", title: "Интеграция без остановки", text: "Сохраняем рабочую автоматику и подключаем её к новой диспетчерской.", stat: "0", meta: "лишних замен" },
  { label: "Модернизация", title: "Обновляем точечно", text: "Меняем устаревшие контроллеры и добавляем только недостающие сигналы.", stat: "1→∞", meta: "масштабирование" },
  { label: "Сеть объектов", title: "Все филиалы в одном окне", text: "Объединяем территориально распределённые здания в общий центр контроля.", stat: "24/7", meta: "единый мониторинг" },
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

function MiniScada() {
  return (
    <div className="scada-shell">
      <div className="scada-top">
        <div><span className="window-dot" /><span className="window-dot" /><span className="window-dot" /></div>
        <span>Центр управления / Объект 01</span>
        <span className="live"><StatusDot /> LIVE</span>
      </div>
      <div className="scada-body">
        <aside className="scada-side">
          <div className="side-brand"><Fan size={18} /> AERON</div>
          {["Обзор", "Установки", "Аварии", "Аналитика"].map((x, i) => <span className={i === 0 ? "active" : ""} key={x}>{x}</span>)}
          <div className="side-bottom">Связь стабильна <Wifi size={13} /></div>
        </aside>
        <div className="scada-main">
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
        </div>
      </div>
      <div className="alarm-toast"><span><BellRing size={15}/></span><div><b>ПВ-08 · Требует внимания</b><small>Фильтр загрязнён на 82%</small></div><time>14:26</time></div>
    </div>
  );
}

function LeadForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  return (
    <form className={`lead-form ${compact ? "compact" : ""}`} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <div className="field-grid">
        <label><span>Ваше имя</span><input required placeholder="Как к вам обращаться?" /></label>
        <label><span>Телефон или Telegram</span><input required placeholder="+7 999 000 00 00" /></label>
        {!compact && <label><span>Тип объекта</span><select defaultValue=""><option value="" disabled>Выберите объект</option><option>Бизнес-центр</option><option>Торговый объект</option><option>Медицинский центр</option><option>Гостиница</option><option>Склад / производство</option><option>Другое</option></select></label>}
        {!compact && <label><span>Количество установок</span><input type="number" min="1" placeholder="Например, 8" /></label>}
      </div>
      {!compact && <label className="wide-field"><span>Коротко о задаче</span><textarea placeholder="Что нужно объединить и контролировать?" /></label>}
      <button className="button dark wide" type="submit">{sent ? <><Check size={18}/> Заявка принята</> : <>Получить предварительную концепцию <ArrowRight size={18}/></>}</button>
      <p>{sent ? "Спасибо. Инженер свяжется с вами и уточнит исходные данные." : "Можно приложить схемы и фотографии после первого контакта. Нажимая кнопку, вы соглашаетесь с обработкой данных."}</p>
    </form>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scenario, setScenario] = useState(0);
  const [faq, setFaq] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  return (
    <main>
      <motion.div className="progress" style={{ scaleX }} />
      <nav className="nav">
        <a className="logo" href="#top" aria-label="AERON — на главную"><span>AER</span><Fan size={20}/><span>N</span></a>
        <div className="nav-links">
          <a href="#result">Возможности</a><a href="#process">Как работаю</a><a href="#cases">Кейс</a><a href="#faq">Вопросы</a>
        </div>
        <a className="nav-cta" href="#contact">Обсудить объект <ArrowDownRight size={16}/></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">{menuOpen ? <X/> : <Menu/>}</button>
      </nav>
      <AnimatePresence>{menuOpen && <motion.div className="mobile-menu" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><a href="#result" onClick={()=>setMenuOpen(false)}>Возможности</a><a href="#process" onClick={()=>setMenuOpen(false)}>Как работаю</a><a href="#cases" onClick={()=>setMenuOpen(false)}>Кейс</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Обсудить объект</a></motion.div>}</AnimatePresence>

      <section className="hero" id="top">
        <div className="hero-orb one"/><div className="hero-orb two"/>
        <motion.div className="hero-copy" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.8}}>
          <span className="eyebrow"><StatusDot/> Диспетчеризация вентиляции коммерческих объектов</span>
          <h1>Вся вентиляция<br/>объекта — <em>в одном</em><br/>понятном интерфейсе</h1>
          <p>Объединяю установки, существующую автоматику, SCADA, архивы и аварийные уведомления в систему, которой удобно пользоваться каждый день.</p>
          <div className="hero-actions"><a className="button dark" href="#contact">Получить решение <ArrowRight size={18}/></a><a className="text-link" href="#cases"><span className="play">▶</span> Смотреть демо</a></div>
        </motion.div>
        <motion.div className="hero-visual" initial={{opacity:0,y:50,rotateX:5}} animate={{opacity:1,y:0,rotateX:0}} transition={{duration:1,delay:.15,ease:[.22,1,.36,1]}}><MiniScada/></motion.div>
        <div className="hero-ticker"><span>MODBUS TCP</span><i/><span>BACNET</span><i/><span>OPC UA</span><i/><span>SCADA</span><i/><span>24/7 МОНИТОРИНГ</span></div>
      </section>

      <motion.section className="intro section" {...reveal}>
        <span className="section-tag">/ Результат</span>
        <h2>Не просто визуализация.<br/><span>Рабочий инструмент эксплуатации.</span></h2>
        <p className="section-lead">Техническая служба видит состояние всего объекта, понимает причину аварии и принимает решение на основании данных — ещё до выезда инженера.</p>
        <div className="benefit-grid" id="result">{benefits.map(([n,title,text,Icon])=><article key={n} className="benefit-card"><div className="card-top"><span>{n}</span><Icon size={24}/></div><h3>{title}</h3><p>{text}</p><ArrowDownRight className="card-arrow" size={20}/></article>)}</div>
      </motion.section>

      <section className="problem-section">
        <motion.div className="problem-copy" {...reveal}><span className="section-tag">/ До диспетчеризации</span><h2>Когда каждая установка работает сама по себе</h2><p>О проблеме узнают после жалоб, диагностика требует выезда, а история параметров теряется. Разрозненные панели не дают общей картины.</p><a className="text-link white" href="#audit">Проверить свой объект <ArrowRight size={17}/></a></motion.div>
        <div className="problem-console">
          <div className="console-head"><span>Журнал событий</span><b><StatusDot tone="warn"/> 3 требуют внимания</b></div>
          {[
            ["14:26:08","ПВ-08","Фильтр загрязнён","warning"],
            ["13:54:31","ВУ-04","Нет связи с контроллером","alarm"],
            ["12:18:02","ПВ-01","Режим изменён: АВТО","normal"],
            ["09:00:00","ПВ-03","Запуск по расписанию","normal"],
          ].map((x)=><div className="console-row" key={x[0]}><time>{x[0]}</time><strong>{x[1]}</strong><span>{x[2]}</span><i className={x[3]}>{x[3]==="normal"?"Событие":x[3]==="alarm"?"Авария":"Внимание"}</i></div>)}
          <div className="console-stats"><div><small>Среднее время реакции</small><strong>4:12</strong><span>минут</span></div><div><small>Выездов предотвращено</small><strong>12</strong><span>за квартал</span></div></div>
        </div>
      </section>

      <section className="audit section" id="audit">
        <motion.div className="audit-card" {...reveal}>
          <div className="audit-copy"><span className="section-tag">/ Бесплатный экспресс-аудит</span><h2>Можно ли подключить ваш объект к единой диспетчерской?</h2><p>Пришлите перечень оборудования, схемы или фотографии шкафов. Я отмечу, что можно сохранить, где нужна модернизация и какие данные получится вывести.</p><ul><li><Check/> Карта подключения</li><li><Check/> Состав проекта</li><li><Check/> Недостающие данные</li></ul></div>
          <LeadForm compact />
        </motion.div>
      </section>

      <section className="process section" id="process">
        <motion.div className="section-heading split" {...reveal}><div><span className="section-tag">/ Полный цикл</span><h2>Закрываю весь технический контур проекта</h2></div><p>Один инженер ведёт систему от первого сигнала в шкафу до готового экрана диспетчерской. Меньше потерь между отделами — больше контроля над результатом.</p></motion.div>
        <div className="steps">{steps.map(([n,title,text],i)=><motion.article key={n} {...reveal} transition={{...reveal.transition,delay:i*.04}}><span className="step-num">{n}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowDownRight/></motion.article>)}</div>
      </section>

      <section className="scenario-section section">
        <div className="section-heading"><span className="section-tag">/ Для каких объектов</span><h2>Новый, действующий<br/>или распределённый</h2></div>
        <div className="scenario-layout">
          <div className="scenario-tabs">{scenarios.map((x,i)=><button key={x.label} className={scenario===i?"active":""} onClick={()=>setScenario(i)}><span>0{i+1}</span>{x.label}<ArrowRight/></button>)}</div>
          <AnimatePresence mode="wait"><motion.div key={scenario} className="scenario-card" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:.35}}><div className="scenario-blueprint"><div className="building"><Building2/><span className="signal s1"/><span className="signal s2"/><span className="signal s3"/></div><div className="radar r1"/><div className="radar r2"/><span className="blueprint-label">Объект / {String(scenario+1).padStart(2,"0")}</span></div><div className="scenario-info"><span>{scenarios[scenario].label}</span><h3>{scenarios[scenario].title}</h3><p>{scenarios[scenario].text}</p><div className="big-stat"><strong>{scenarios[scenario].stat}</strong><small>{scenarios[scenario].meta}</small></div></div></motion.div></AnimatePresence>
        </div>
      </section>

      <section className="case section" id="cases">
        <motion.div className="case-shell" {...reveal}>
          <div className="case-top"><span className="section-tag light">/ Реальный результат</span><span>Бизнес-центр · 18 400 м² · Москва</span></div>
          <div className="case-grid"><div className="case-copy"><h2>42 установки.<br/>Один центр контроля.</h2><p>До проекта — отдельные панели и ручной обход. После — единая SCADA, архивы и Telegram-уведомления.</p><div className="case-numbers"><div><strong>648</strong><span>параметров</span></div><div><strong>37</strong><span>типов аварий</span></div><div><strong>8</strong><span>экранов</span></div></div><a className="button light-button" href="#contact">Получить демонстрацию <ArrowRight/></a></div><div className="case-ui"><MiniScada/></div></div>
        </motion.div>
      </section>

      <section className="trust section">
        <motion.div className="trust-heading" {...reveal}><span className="section-tag">/ Инженерный подход</span><h2>Система не станет<br/><em>«чёрным ящиком»</em></h2></motion.div>
        <div className="trust-grid"><article><ShieldCheck/><h3>Автономность</h3><p>Локальная автоматика продолжает работать и выполнять защиты даже без связи с диспетчерской.</p></article><article><FileStack/><h3>Исходники у вас</h3><p>Передаю схемы, программы, резервные копии, сетевые параметры и инструкции.</p></article><article><SlidersHorizontal/><h3>Прозрачные этапы</h3><p>Функции, сигналы, сроки, границы ответственности и комплект документов фиксируются заранее.</p></article></div>
      </section>

      <section className="faq section" id="faq">
        <div className="faq-title"><span className="section-tag">/ FAQ</span><h2>Частые вопросы</h2><p>Коротко о совместимости, отказоустойчивости и формате работы.</p></div>
        <div className="faq-list">{faqs.map(([q,a],i)=><div className={`faq-item ${faq===i?"open":""}`} key={q}><button onClick={()=>setFaq(faq===i?-1:i)}><span>0{i+1}</span><strong>{q}</strong><ChevronDown/></button><AnimatePresence initial={false}>{faq===i&&<motion.p initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>{a}</motion.p>}</AnimatePresence></div>)}</div>
      </section>

      <section className="contact section" id="contact">
        <motion.div className="contact-shell" {...reveal}>
          <div className="contact-copy"><span className="section-tag light">/ Предварительная концепция</span><h2>Давайте соберём<br/>ваш объект<br/><em>в одну систему</em></h2><p>Вы общаетесь напрямую с инженером, который проектирует решение и участвует в запуске.</p><div className="contact-meta"><span><Radio/> Ответ в течение рабочего дня</span><span><Clock3/> Первый разбор — бесплатно</span></div></div>
          <LeadForm />
        </motion.div>
      </section>

      <footer><div className="footer-brand"><span>AER</span><Fan/><span>N</span></div><div className="footer-row"><span>Диспетчеризация вентиляции коммерческих объектов</span><div><a href="#result">Возможности</a><a href="#process">Процесс</a><a href="#faq">FAQ</a></div><span>© 2026 · Инженерная точность</span></div></footer>
    </main>
  );
}
