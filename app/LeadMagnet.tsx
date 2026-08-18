'use client';

import { useState, useCallback } from 'react';
import { Download, Check, ArrowRight } from 'lucide-react';
import { useTrack } from '@/hooks/useTrack';
import { motion, AnimatePresence } from 'framer-motion';

const CHECKLISTS = [
  {
    id: '1',
    num: '№ 1',
    label: '10 признаков, что объект теряет деньги на вентиляции',
    hint: 'Для управляющего / собственника',
    file: '/downloads/checklist-1-10-признаков.pdf',
  },
  {
    id: '2',
    num: '№ 2',
    label: 'Что спросить у подрядчика, чтобы не пожалеть',
    hint: 'Для технического директора',
    file: '/downloads/checklist-2-вопросы-подрядчику.pdf',
  },
  {
    id: '3',
    num: '№ 3',
    label: 'Готов ли ваш объект к диспетчеризации прямо сейчас',
    hint: 'Для инженера / проектировщика',
    file: '/downloads/checklist-3-готовность-объекта.pdf',
  },
  {
    id: 'all',
    num: 'Все',
    label: 'Все три — полный комплект',
    hint: 'Отправить коллегам или изучить самому',
    file: null,
  },
] as const;

type ChecklistId = typeof CHECKLISTS[number]['id'];

export function LeadMagnet() {
  const [selected, setSelected] = useState<ChecklistId>('all');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { track } = useTrack();

  const triggerDownload = useCallback(async (files: string[]) => {
    for (const file of files) {
      const a = document.createElement('a');
      a.href = file;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (files.length > 1) await new Promise(r => setTimeout(r, 600));
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Введите корректный email');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Трекаем в Google Sheets
      await track('lead_magnet_download', {
        email: email.trim(),
        checklist: selected,
        checklist_label: CHECKLISTS.find(c => c.id === selected)?.label ?? '',
      });

      // Отправляем email-уведомление Павлу через SMTP (как в нижней форме)
      await fetch('/api/send-lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          checklist: selected,
          checklist_label: CHECKLISTS.find(c => c.id === selected)?.label ?? '',
        }),
      }).catch(err => console.error('[LeadMagnet] notify error:', err));


      const files =
        selected === 'all'
          ? CHECKLISTS.filter(c => c.id !== 'all').map(c => c.file!)
          : [CHECKLISTS.find(c => c.id === selected)!.file!];

      await triggerDownload(files);
      setSubmitted(true);
    } catch {
      setError('Что-то пошло не так. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lm-card">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            className="lm-success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="lm-success-icon">
              <Check size={26} strokeWidth={2} />
            </div>
            <p className="lm-success-title">Скачивание началось</p>
            <p className="lm-success-text">
              Файлы загружаются в папку загрузок.<br />
              Если не началось — проверьте блокировщик попапов.
            </p>
            <button
              className="lm-back"
              onClick={() => { setSubmitted(false); setEmail(''); }}
            >
              Скачать другой
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="lm-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="lm-options">
              {CHECKLISTS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`lm-option${selected === c.id ? ' lm-option--active' : ''}`}
                  onClick={() => setSelected(c.id)}
                >
                  <span className="lm-option-num">{c.num}</span>
                  <span className="lm-option-body">
                    <span className="lm-option-label">{c.label}</span>
                    <span className="lm-option-hint">{c.hint}</span>
                  </span>
                  <span className="lm-option-check">
                    {selected === c.id && <Check size={13} strokeWidth={2.5} />}
                  </span>
                </button>
              ))}
            </div>

            <div className="lm-field-wrap">
              <input
                type="email"
                className={`lm-input${error ? ' lm-input--error' : ''}`}
                placeholder="ваш@email.ru"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                autoComplete="email"
                required
              />
              {error && <span className="lm-error">{error}</span>}
            </div>

            <p className="lm-consent">
              Нажимая «Скачать», вы соглашаетесь на получение материалов от acengine.ru. Без спама.
            </p>

            <button type="submit" className="lm-submit" disabled={loading}>
              {loading ? (
                <span className="lm-spinner" />
              ) : (
                <>
                  <Download size={15} strokeWidth={1.5} />
                  Скачать {selected === 'all' ? 'все три' : 'чеклист'}
                  <ArrowRight size={15} strokeWidth={1.5} />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
