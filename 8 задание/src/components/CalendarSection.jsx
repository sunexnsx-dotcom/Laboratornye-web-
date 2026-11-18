import { useState } from 'react';
import Calendar from './Calendar.jsx';
import { MONTHS } from '../holidays.js';

// Управление календарём: выбор месяца и года, стрелки, «Текущий месяц»
export default function CalendarSection() {
  const now = new Date();
  // null — параметры не заданы, календарь сам покажет текущий месяц
  const [selected, setSelected] = useState(null);
  const month = selected?.month ?? now.getMonth() + 1;
  const year = selected?.year ?? now.getFullYear();

  const shift = delta => {
    const d = new Date(year, month - 1 + delta, 1);
    setSelected({ month: d.getMonth() + 1, year: d.getFullYear() });
  };

  const years = Array.from({ length: 61 }, (_, i) => now.getFullYear() - 50 + i);

  return (
    <>
      <div className="cal-controls">
        <button className="btn" onClick={() => shift(-1)} title="Предыдущий месяц">←</button>
        <select aria-label="Месяц" value={month} onChange={e => setSelected({ month: +e.target.value, year })}>
          {MONTHS.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
        </select>
        <select aria-label="Год" value={year} onChange={e => setSelected({ month, year: +e.target.value })}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button className="btn" onClick={() => shift(1)} title="Следующий месяц">→</button>
        <button className="btn btn--fill" onClick={() => setSelected(null)}>Текущий месяц</button>
      </div>

      {selected ? <Calendar month={selected.month} year={selected.year} /> : <Calendar />}

      <div className="legend">
        <span className="l-we">Выходной (суббота, воскресенье)</span>
        <span className="l-hd">Праздничный день</span>
        <span className="l-td">Сегодня</span>
      </div>
    </>
  );
}
