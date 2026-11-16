import { HOLIDAYS, MONTHS } from '../holidays.js';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Разбивает месяц на недели (понедельник — первый день). Пустые клетки — null.
export function getWeeks(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7; // 0 = понедельник
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/**
 * Задание 2. Календарь на месяц.
 * month — номер месяца от 1 до 12, year — год.
 * Если параметры не заданы, выводится текущий месяц.
 */
export default function Calendar({ month, year }) {
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();
  const weeks = getWeeks(m, y);

  const isToday = day => day === now.getDate() && m === now.getMonth() + 1 && y === now.getFullYear();
  const monthHolidays = Object.entries(HOLIDAYS)
    .filter(([key]) => key.startsWith(`${m}-`))
    .map(([key, name]) => `${key.split('-')[1]} — ${name}`);

  return (
    <div className="calendar">
      <table>
        <caption>{MONTHS[m - 1]} {y}</caption>
        <thead>
          <tr>{WEEKDAYS.map((d, i) => <th key={d} className={i >= 5 ? 'we' : ''}>{d}</th>)}</tr>
        </thead>
        <tbody>
          {weeks.map((week, w) => (
            <tr key={w}>
              {week.map((day, i) => {
                if (day === null) return <td key={i} className="empty" />;
                const holiday = HOLIDAYS[`${m}-${day}`];
                const classes = [];
                if (i >= 5) classes.push('weekend');        // суббота и воскресенье
                if (holiday) classes.push('holiday');
                if (isToday(day)) classes.push('today');
                return <td key={i} className={classes.join(' ')} title={holiday}>{day}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="holidays-list">
        {monthHolidays.length ? monthHolidays.map(h => <li key={h}>{h}</li>) : <li>В этом месяце нет праздничных дней</li>}
      </ul>
    </div>
  );
}
