// Клавиатура калькулятора. Каждая кнопка описана объектом: надпись, вид, действие.

export const KEYS = [
  // верхние ряды как у образца: C/ON, OFF, √, % и MRC, M−, M+, ÷
  { label: 'C', kind: 'red', action: { type: 'clear' }, title: 'Включение и полный сброс (Esc)', key: 'Escape' },
  { label: 'OFF', kind: 'fn small', action: { type: 'off' }, title: 'Выключить' },
  { label: '√', kind: 'fn', action: { type: 'sqrt' }, title: 'Квадратный корень' },
  { label: '%', kind: 'fn', action: { type: 'percent' }, title: 'Процент', key: '%' },

  { label: 'CE', kind: 'fn small', action: { type: 'clearEntry' }, title: 'Сброс числа (Delete)', key: 'Delete' },
  { label: '←', kind: 'fn', action: { type: 'backspace' }, title: 'Удалить последнюю цифру (Backspace)', key: 'Backspace' },
  { label: '±', kind: 'fn', action: { type: 'sign' }, title: 'Смена знака' },
  { label: '1/x', kind: 'fn small', action: { type: 'inverse' }, title: 'Обратное число' },

  { label: 'MRC', kind: 'fn small', action: { type: 'memoryRecall' }, title: 'Вызов памяти, повторное нажатие — очистка' },
  { label: 'M−', kind: 'fn small', action: { type: 'memorySub' }, title: 'Вычесть из памяти' },
  { label: 'M+', kind: 'fn small', action: { type: 'memoryAdd' }, title: 'Прибавить к памяти' },
  { label: '÷', kind: 'fn', action: { type: 'operator', operator: '/' }, title: 'Деление', key: '/' },

  ...['7', '8', '9'].map(d => ({ label: d, kind: 'num', action: { type: 'digit', digit: d }, key: d })),
  { label: '×', kind: 'fn', action: { type: 'operator', operator: '*' }, title: 'Умножение', key: '*' },

  ...['4', '5', '6'].map(d => ({ label: d, kind: 'num', action: { type: 'digit', digit: d }, key: d })),
  { label: '−', kind: 'fn', action: { type: 'operator', operator: '-' }, title: 'Вычитание', key: '-' },

  ...['1', '2', '3'].map(d => ({ label: d, kind: 'num', action: { type: 'digit', digit: d }, key: d })),
  { label: '+', kind: 'fn plus', action: { type: 'operator', operator: '+' }, title: 'Сложение', key: '+' },

  { label: '0', kind: 'num', action: { type: 'digit', digit: '0' }, key: '0' },
  { label: '•', kind: 'num', action: { type: 'dot' }, title: 'Десятичная точка', key: '.' },
  { label: '=', kind: 'fn', action: { type: 'equals' }, title: 'Равно (Enter)', key: 'Enter' }
];

export default function Keypad({ onPress, pressedKey }) {
  return (
    <div className="keys">
      {KEYS.map(k => (
        <button
          key={k.label}
          type="button"
          title={k.title}
          className={`key ${k.kind.split(' ').map(c => 'key--' + c).join(' ')}${pressedKey === k.label ? ' pressed' : ''}`}
          onClick={() => onPress(k.action)}
        >
          {k.label}
        </button>
      ))}
    </div>
  );
}
