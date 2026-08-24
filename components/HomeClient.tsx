"use client";

import {
  type MouseEvent,
  type ReactNode,
  forwardRef,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { CookieSettingsButton, PrivacyLink } from "../app/CookieConsent";
import { AcEngineLogo } from "../app/AcEngineLogo";
import { useTrack } from "../hooks/useTrack";
import { LeadMagnet } from "../app/LeadMagnet";
import { FounderVideo } from "../app/FounderVideo";
import dynamic from "next/dynamic";
import BrandStar from "./BrandStar";
import { AnimatedMiniScada } from "./AnimatedMiniScada";

const ProcessFlow = dynamic(() => import("./ProcessFlow"), { ssr: false });
const LeadFormSection = dynamic(() => import("./LeadFormSection"), { ssr: false });
const FAQSection = dynamic(() => import("./FAQSection"), { ssr: false });
import {
  Activity,
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  BellRing,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CircleGauge,
  FileStack,
  LayoutDashboard,
  ListChecks,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Wifi,
  X,
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



const StackSlot = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  ({ children, className = '' }, ref) => (
    <div ref={ref} className={`stack-slot${className ? ' ' + className : ''}`}>
      {children}
    </div>
  )
);
StackSlot.displayName = 'StackSlot';

function attachNeonBorder(element: HTMLElement | null) {
  if (!element) return;

  const glowPath = element.querySelector<SVGPathElement>('.neon-trace-glow');
  const linePath = element.querySelector<SVGPathElement>('.neon-trace-line');
  if (!glowPath || !linePath) return;

  const buildPath = () => {
    const { width, height } = element.getBoundingClientRect();
    if (!width || !height) return;

    const topRadius = 38;
    const path = [
      `M 0 ${height}`,
      `L ${width} ${height}`,
      `L ${width} ${topRadius}`,
      `Q ${width} 0 ${width - topRadius} 0`,
      `L ${topRadius} 0`,
      `Q 0 0 0 ${topRadius}`,
      `L 0 ${height}`,
    ].join(' ');

    glowPath.setAttribute('d', path);
    linePath.setAttribute('d', path);
  };

  buildPath();
  const resizeObserver = new ResizeObserver(buildPath);
  resizeObserver.observe(element);

  return () => resizeObserver.disconnect();
}

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

export default function HomeClient({ hero }: { hero: ReactNode }) {
  const { track } = useTrack();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navDropOpen, setNavDropOpen] = useState(false);
  const [scenario, setScenario] = useState(0);
  const [heroPassed, setHeroPassed] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [caseDirection, setCaseDirection] = useState(1);
  const [problemStep, setProblemStep] = useState(0);
  const navigationLocked = useRef(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = scrollYProgress;
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

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 1001px) and (min-height: 760px)",
    );
    const collectPanels = () =>
      Array.from(document.querySelectorAll<HTMLElement>(".stack-panel"));
    const collectEntries = (currentPanels: HTMLElement[]) =>
      currentPanels.map((panel) => ({
        panel,
        anchor: panel.closest<HTMLElement>(".stack-slot, .process-runway"),
        // Cache tagName check — avoids repeated DOM property access in hot loop
        isFooter: panel.tagName === "FOOTER",
      }));
    let panels = collectPanels();
    let entries = collectEntries(panels);
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

    // Dynamically imported sections can mount after this effect has collected
    // the initial panel list. Refresh only when a stack panel itself is added
    // or removed; ordinary content changes inside a panel are ignored.
    const stackRoot = document.querySelector(".stack-root");
    const panelObserver = new MutationObserver((mutations) => {
      const panelTreeChanged = mutations.some((mutation) =>
        [...mutation.addedNodes, ...mutation.removedNodes].some(
          (node) =>
            node instanceof Element &&
            (node.matches(".stack-panel") || Boolean(node.querySelector(".stack-panel"))),
        ),
      );
      if (!panelTreeChanged) return;

      panels = collectPanels();
      entries = collectEntries(panels);
      prevActiveIndex = -99;
      prevEnteringIndex = -99;
      prevEnteringProgress = -1;
      prevCoverProgress = -1;
      scheduleUpdate();
    });
    if (stackRoot) {
      panelObserver.observe(stackRoot, { childList: true, subtree: true });
    }

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
      panelObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      panels.forEach(resetPanelMotion);
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
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    if (!isMobile) return;

    const cards = document.querySelectorAll(".benefit-card");
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          } else {
            entry.target.classList.remove("active");
          }
        });
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0,
      }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  // Server snapshot omits the portal; client snapshot enables it without an effect render.
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

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
                href="mailto:info@acengine.ru"
                className="mobile-contact-item"
                onClick={() => track('click_email', { location: 'mobile_menu' })}
              >
                <Mail size={16} strokeWidth={1.8} />
                <span>info@acengine.ru</span>
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
              href="mailto:info@acengine.ru"
              className="nav-contact-link"
              onClick={() => track('click_email', { location: 'nav' })}
            >
              <Mail size={16} strokeWidth={1.8} />
              <span>info@acengine.ru</span>
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

      {hero}

      <div className="stack-root">
        <StackSlot>
          <section
            className="intro section stack-panel panel-paper layer-1 view-animated-panel"
            ref={attachNeonBorder}
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
              {benefits.map(([n, title, text, Icon]) => (
                <article
                  key={n}
                  className="benefit-card reveal-card"
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
                              <img
                                src={img}
                                alt={title}
                                width={180}
                                height={126}
                                className="step-icon-img"
                                loading="lazy"
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
            className="trust section stack-panel panel-paper layer-7 view-animated-panel"
            ref={attachNeonBorder}
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
          <FAQSection />
        </StackSlot>
        <StackSlot>
          <LeadFormSection />
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
                <FounderVideo />
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
