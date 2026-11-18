import { useState } from 'react';

// Задание 1. Таблица умножения чисел от 0 до max.
// При наведении подсвечиваются строка и столбец ячейки.
export default function MultiplicationTable({ max = 10 }) {
  const numbers = Array.from({ length: max + 1 }, (_, i) => i);
  const [hover, setHover] = useState(null); // { row, col } или null

  return (
    <div className="scroll">
      <table className="mult" onMouseLeave={() => setHover(null)}>
        <thead>
          <tr>
            <th className="corner">×</th>
            {numbers.map(n => <th key={n}>{n}</th>)}
          </tr>
        </thead>
        <tbody>
          {numbers.map(row => (
            <tr key={row}>
              <th>{row}</th>
              {numbers.map(col => {
                const classes = [];
                if (row === col) classes.push('square');
                if (hover && (hover.row === row || hover.col === col)) classes.push('hl');
                if (hover && hover.row === row && hover.col === col) classes.push('hl-cell');
                return (
                  <td key={col} className={classes.join(' ')} onMouseEnter={() => setHover({ row, col })}>
                    {row * col}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
