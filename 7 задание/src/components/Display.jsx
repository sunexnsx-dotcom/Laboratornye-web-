// Жидкокристаллический экран: 8 разрядов семисегментных цифр + разряд под знак «минус»

const SEGMENTS = {
  '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg',
  '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg',
  '-': 'g', 'E': 'adefg', 'r': 'eg', 'o': 'cdeg', ' ': ''
};

const CELLS = 9;
const OP_SIGNS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

// Разбивает строку на разряды: точка становится сегментом dp предыдущей цифры
function toCells(text, error) {
  const chars = [];
  for (const ch of text) {
    if (ch === '.') chars[chars.length - 1].dot = true;
    else chars.push({ ch, dot: false });
  }
  // как на настоящем калькуляторе — точка горит и после целого числа
  if (!text.includes('.') && !error) chars[chars.length - 1].dot = true;
  while (chars.length < CELLS) chars.unshift({ ch: ' ', dot: false });
  return chars;
}

function Digit({ ch, dot }) {
  const on = SEGMENTS[ch] ?? '';
  return (
    <div className="digit">
      {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(s => (
        <span key={s} className={`seg ${s}${on.includes(s) ? ' on' : ''}`} />
      ))}
      <span className={`seg dp${dot ? ' on' : ''}`} />
    </div>
  );
}

export default function Display({ value, operator, error, memory, power }) {
  return (
    <div className="lcd" aria-live="polite" aria-label={power ? `На экране: ${value}` : 'Калькулятор выключен'}>
      <div className="lcd__flags">
        <span className={power && memory !== 0 ? 'on' : ''}>M</span>
        <span className={power && operator ? 'on' : ''}>{OP_SIGNS[operator] ?? '+'}</span>
        <span className={power && error ? 'on' : ''}>E</span>
      </div>
      <div className="digits">
        {(power ? toCells(value, error) : toCells(' ', true)).map((c, i) => <Digit key={i} {...c} />)}
      </div>
    </div>
  );
}
