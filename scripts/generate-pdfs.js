const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// ── Логотип с тёмной плашкой — читаем из favicon.svg ───────────────────────
const LOGO_SVG = fs.readFileSync(
  path.join(__dirname, '../public/favicon.svg'), 'utf8'
);

// ── Базовые стили — компактнее чтобы влезть на одну A4-страницу ─────────────
const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Onest', 'Helvetica Neue', Arial, sans-serif;
    background: #f5f6f3;
    color: #101312;
    font-size: 9.5pt;
    line-height: 1.5;
  }
  .page {
    width: 210mm;
    height: 297mm;
    padding: 10mm 13mm 10mm;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  /* HEADER */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    border-bottom: 1.5px solid #101312;
    margin-bottom: 12px;
    flex-shrink: 0;
  }
  .logo-wrap { display: flex; align-items: center; gap: 9px; }
  .logo-wrap svg { width: 28px; height: 28px; }
  .logo-text {
    font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 600;
    font-size: 13pt;
    letter-spacing: -0.04em;
    color: #101312;
  }
  .header-tag { font-size: 7.5pt; color: #6e7470; letter-spacing: 0.06em; text-transform: uppercase; }

  /* HERO */
  .hero {
    background: #141716;
    color: #fff;
    border-radius: 10px;
    padding: 14px 18px 12px;
    margin-bottom: 12px;
    flex-shrink: 0;
  }
  .hero-tag { font-size: 7.5pt; color: #c8f251; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; margin-bottom: 5px; }
  .hero h1 {
    font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
    font-size: 16pt;
    font-weight: 600;
    line-height: 1.18;
    letter-spacing: -0.03em;
    color: #fff;
    margin-bottom: 6px;
  }
  .hero-sub { font-size: 8.5pt; color: rgba(255,255,255,0.58); }

  /* SECTION */
  .section { margin-bottom: 10px; flex-shrink: 0; }
  .section-title {
    font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
    font-size: 7pt;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #6e7470;
    margin-bottom: 4px;
    padding-bottom: 3px;
    border-bottom: 1px solid #dfe2de;
  }

  /* CHECKLIST ITEMS */
  .item { display: flex; align-items: flex-start; gap: 8px; padding: 4px 0; border-bottom: 1px solid #eceeed; }
  .item:last-child { border-bottom: none; }
  .checkbox { width: 13px; height: 13px; border: 1.5px solid #101312; border-radius: 3px; flex-shrink: 0; margin-top: 1px; }
  .item-text { font-size: 9pt; line-height: 1.4; }

  /* RESULT BOX */
  .result-box {
    background: #fff;
    border: 1.5px solid #dfe2de;
    border-radius: 8px;
    padding: 10px 13px;
    margin-bottom: 10px;
    flex-shrink: 0;
  }
  .result-box-title {
    font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
    font-size: 7pt; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #6e7470; margin-bottom: 5px;
  }
  .result-item { display: flex; gap: 8px; margin-bottom: 4px; font-size: 9pt; line-height: 1.4; }
  .result-badge {
    background: #c8f251; color: #101312; font-weight: 700; font-size: 7.5pt;
    padding: 1px 6px; border-radius: 20px; white-space: nowrap; flex-shrink: 0;
    height: fit-content; margin-top: 1px;
    font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
  }
  .result-badge.warn { background: #b9dff1; }
  .result-badge.danger { background: #101312; color: #c8f251; }

  /* FLAG BOX */
  .flag-box {
    background: #141716; color: #fff; border-radius: 8px;
    padding: 9px 12px; margin-bottom: 10px; font-size: 9pt; flex-shrink: 0;
  }
  .flag-box-title {
    font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700; color: #c8f251; font-size: 7.5pt;
    text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px;
  }
  .flag-item { display: flex; gap: 7px; margin-bottom: 3px; color: rgba(255,255,255,0.82); line-height: 1.4; }
  .flag-dot { color: #c8f251; flex-shrink: 0; font-weight: 700; }

  /* FOOTER */
  .footer {
    margin-top: auto;
    padding-top: 8px;
    border-top: 1.5px solid #101312;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }
  .footer-contacts { font-size: 7.5pt; color: #6e7470; line-height: 1.7; }
  .footer-contacts strong { color: #101312; font-weight: 500; }
  .footer-doc {
    font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
    font-size: 7.5pt;
    color: #6e7470;
    text-align: right;
    line-height: 1.6;
  }
`;

// ── Общая шапка HTML с Google Fonts ─────────────────────────────────────────
function htmlWrap(body) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>${BASE_CSS}</style>
</head>
<body>${body}</body>
</html>`;
}

// ── Чеклист 1 ────────────────────────────────────────────────────────────────
const html1 = htmlWrap(`
<div class="page">
  <header class="header">
    <div class="logo-wrap">${LOGO_SVG}<span class="logo-text">acengine.ru</span></div>
    <span class="header-tag">Диспетчеризация вентиляции</span>
  </header>
  <div class="hero">
    <div class="hero-tag">/ Чеклист № 1</div>
    <h1>10 признаков, что вашему объекту нужна диспетчеризация вентиляции</h1>
    <p class="hero-sub">Поставьте галочку напротив каждого пункта, который описывает ситуацию на вашем объекте.</p>
  </div>
  <div class="section">
    <div class="section-title">О проблемах</div>
    <div class="item"><div class="checkbox"></div><div class="item-text">О неисправности вентиляции узнаём от арендаторов или посетителей — не от системы</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Чтобы понять причину аварии, нужно физически выехать на объект</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">История работы установок не сохраняется — нечего анализировать</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Журналы обходов ведутся в бумажном виде или в Excel вручную</div></div>
  </div>
  <div class="section">
    <div class="section-title">О контроле</div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Дежурный инженер не может проверить статус объекта, не приезжая на место</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Нет автоматических уведомлений при отклонении параметров от нормы</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Каждая установка управляется отдельно — единого интерфейса нет</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Настройки расписаний приходится менять на каждом шкафу вручную</div></div>
  </div>
  <div class="section">
    <div class="section-title">Об энергии и деньгах</div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Вентиляция работает в полную силу даже в нерабочее время или в пустых зонах</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Нет данных о реальном потреблении — непонятно, есть ли перерасход</div></div>
  </div>
  <div class="result-box">
    <div class="result-box-title">Ваш результат</div>
    <div class="result-item"><span class="result-badge">0–3</span><span>Система работает нормально. Диспетчеризация даст комфорт и аналитику.</span></div>
    <div class="result-item"><span class="result-badge warn">4–6</span><span>Есть зоны риска. Стоит оценить, сколько стоят текущие потери.</span></div>
    <div class="result-item"><span class="result-badge danger">7–10</span><span>Объект теряет деньги и работает в режиме «тушим пожары». Диспетчеризация окупится в первый год.</span></div>
  </div>
  <footer class="footer">
    <div class="footer-contacts">
      <strong>Нашли 4 и более? Обсудим бесплатно.</strong><br>
      +7 995 887-83-10 · PetroffSCADA@yandex.ru · t.me/PetrovEngineering
    </div>
    <div class="footer-doc">acengine.ru · Документ № 1 · ${new Date().getFullYear()}</div>
  </footer>
</div>`);

// ── Чеклист 2 ────────────────────────────────────────────────────────────────
const html2 = htmlWrap(`
<div class="page">
  <header class="header">
    <div class="logo-wrap">${LOGO_SVG}<span class="logo-text">acengine.ru</span></div>
    <span class="header-tag">Диспетчеризация вентиляции</span>
  </header>
  <div class="hero">
    <div class="hero-tag">/ Чеклист № 2</div>
    <h1>Что спросить у подрядчика перед внедрением SCADA</h1>
    <p class="hero-sub">Правильный исполнитель ответит на все вопросы без уклончивых фраз. Используйте список перед встречей или при оценке КП.</p>
  </div>
  <div class="section">
    <div class="section-title">Совместимость и оборудование</div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Можно ли сохранить существующие шкафы управления и контроллеры?</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Какие протоколы связи поддерживаются? (Modbus RTU/TCP, BACnet, OPC UA — минимум)</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Что происходит при отключении интернета? Продолжают ли работать алгоритмы?</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Привязан ли проект к одному производителю или можно заменить компоненты?</div></div>
  </div>
  <div class="section">
    <div class="section-title">Система и интерфейс</div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Какую SCADA-платформу планируете использовать и почему именно её?</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Как выглядит мнемосхема — есть примеры реализованных объектов?</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Насколько детальны архивы параметров? Какой период хранения данных?</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Как настраиваются аварийные уведомления — SMS, Telegram, email?</div></div>
  </div>
  <div class="section">
    <div class="section-title">Передача и поддержка</div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Получаем ли мы исходные файлы проекта (программа ПЛК, конфигурация SCADA)?</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Можем ли самостоятельно изменить расписание или уставки после запуска?</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Что входит в гарантийный период — и что происходит после него?</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Кто проводит обучение для дежурного персонала?</div></div>
  </div>
  <div class="flag-box">
    <div class="flag-box-title">⚠ Красные флаги</div>
    <div class="flag-item"><span class="flag-dot">→</span><span>Подрядчик не даёт исходники — вы зависите от него навсегда</span></div>
    <div class="flag-item"><span class="flag-dot">→</span><span>Нет примеров реальных объектов — опыт под вопросом</span></div>
    <div class="flag-item"><span class="flag-dot">→</span><span>«Интернет нужен постоянно» без объяснений — нет автономной логики в контроллерах</span></div>
  </div>
  <footer class="footer">
    <div class="footer-contacts">
      <strong>Готовы пройти список вместе?</strong><br>
      +7 995 887-83-10 · PetroffSCADA@yandex.ru · t.me/PetrovEngineering
    </div>
    <div class="footer-doc">acengine.ru · Документ № 2 · ${new Date().getFullYear()}</div>
  </footer>
</div>`);

// ── Чеклист 3 ────────────────────────────────────────────────────────────────
const html3 = htmlWrap(`
<div class="page">
  <header class="header">
    <div class="logo-wrap">${LOGO_SVG}<span class="logo-text">acengine.ru</span></div>
    <span class="header-tag">Диспетчеризация вентиляции</span>
  </header>
  <div class="hero">
    <div class="hero-tag">/ Чеклист № 3</div>
    <h1>Чеклист готовности объекта к диспетчеризации вентиляции</h1>
    <p class="hero-sub">Чем больше пунктов отмечено — тем проще и дешевле будет интеграция. Хорошая основа для технического задания.</p>
  </div>
  <div class="section">
    <div class="section-title">Документация (ускоряет проект в 2 раза)</div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Есть актуальные принципиальные схемы шкафов автоматики</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Известны типы и модели контроллеров на каждой установке</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Есть перечень точек ввода/вывода (I/O list) или доступ к программе ПЛК</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Известны протоколы связи установленного оборудования</div></div>
  </div>
  <div class="section">
    <div class="section-title">Инфраструктура</div>
    <div class="item"><div class="checkbox"></div><div class="item-text">На объекте есть интернет или возможность его провести (GSM / LAN)</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Есть возможность прокладки кабеля связи между шкафами</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Есть место и питание для установки сервера или шлюза</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Дежурный персонал имеет рабочее место с компьютером или планшетом</div></div>
  </div>
  <div class="section">
    <div class="section-title">Автоматика</div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Контроллеры относительно современные (не старше 15 лет)</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Оборудование поддерживает открытые протоколы или подключается через шлюзы</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Доступ к программе ПЛК возможен (есть исходники или производитель готов открыть)</div></div>
    <div class="item"><div class="checkbox"></div><div class="item-text">Установки не имеют критических неисправностей перед стартом проекта</div></div>
  </div>
  <div class="result-box">
    <div class="result-box-title">Интерпретация результата</div>
    <div class="result-item"><span class="result-badge">10–12</span><span>Объект готов. Проект пройдёт быстро и с минимальными затратами.</span></div>
    <div class="result-item"><span class="result-badge warn">6–9</span><span>Потребуется предварительный аудит и, возможно, частичная модернизация.</span></div>
    <div class="result-item"><span class="result-badge danger">&lt;6</span><span>Начнём с аудита — определим что сохранить и в какой последовательности.</span></div>
  </div>
  <footer class="footer">
    <div class="footer-contacts">
      <strong>Передайте нам результат — подготовим концепцию.</strong><br>
      +7 995 887-83-10 · PetroffSCADA@yandex.ru · t.me/PetrovEngineering
    </div>
    <div class="footer-doc">acengine.ru · Документ № 3 · ${new Date().getFullYear()}</div>
  </footer>
</div>`);

// ── Генерация ────────────────────────────────────────────────────────────────
async function generate() {
  const tmpDir = path.join(__dirname, '../.tmp-pdfs');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  const outDir = path.join(__dirname, '../public/downloads');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const checklists = [
    { name: 'checklist-1-10-признаков.pdf',       html: html1 },
    { name: 'checklist-2-вопросы-подрядчику.pdf',  html: html2 },
    { name: 'checklist-3-готовность-объекта.pdf',  html: html3 },
  ];

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-web-security'] });
  const page = await browser.newPage();

  for (const { name, html } of checklists) {
    // Пишем во временный HTML-файл — puppeteer загрузит через file://
    const tmpFile = path.join(tmpDir, name.replace('.pdf', '.html'));
    fs.writeFileSync(tmpFile, html, 'utf8');

    await page.goto(`file://${tmpFile}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Ждём шрифты
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 1200));

    const outPath = path.join(outDir, name);
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    console.log(`✅ ${name}`);
    fs.unlinkSync(tmpFile); // удаляем temp
  }

  await browser.close();
  fs.rmdirSync(tmpDir, { recursive: true });
  console.log('\n📁 Сохранено в public/downloads/');
}

generate().catch(console.error);
