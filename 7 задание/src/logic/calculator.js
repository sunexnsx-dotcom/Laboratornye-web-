// Логика калькулятора: чистая функция-редьюсер для useReducer.
// Состояние меняется только через действия (нажатия кнопок).

export const MAX_DIGITS = 8; // разрядность экрана

export const initialState = {
  current: '0',        // число на экране (строкой — так удобно редактировать)
  stored: null,        // первое число операции
  operator: null,      // ожидающая операция: + - * /
  startNew: false,     // следующая цифра начинает новое число
  lastOperator: null,  // для повторного нажатия «=»
  lastOperand: null,
  error: false,
  memory: 0,           // память (M+, M−, MRC)
  mrcPressed: false,   // MRC нажата только что: повторное нажатие очищает память
  power: true          // OFF выключает калькулятор, C (ON) включает
};

// Число -> строка, которая помещается в 8 разрядов (null — переполнение или ошибка)
export function format(value) {
  if (!Number.isFinite(value)) return null;
  value = parseFloat(value.toPrecision(12)); // убираем погрешность вида 0.1 + 0.2
  if (Math.abs(value) >= 10 ** MAX_DIGITS) return null;
  const intDigits = Math.max(1, Math.floor(Math.abs(value)).toString().length);
  let text = value.toFixed(Math.max(0, MAX_DIGITS - intDigits));
  if (text.includes('.')) text = text.replace(/0+$/, '').replace(/\.$/, '');
  return text === '-0' ? '0' : text;
}

function calculate(a, op, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
    default: return b;
  }
}

const countDigits = text => text.replace('-', '').replace('.', '').length;

const errorState = state => ({ ...state, current: 'Error', error: true, stored: null, operator: null });

// Записывает результат на экран или переводит калькулятор в ошибку
function withResult(state, value, extra = {}) {
  const text = format(value);
  if (text === null) return errorState(state);
  return { ...state, current: text, ...extra };
}

export function reducer(state, action) {
  const next = step(state, action);
  // флаг MRC живёт только до следующего нажатия
  return action.type === 'memoryRecall' || next === state ? next : { ...next, mrcPressed: false };
}

function step(state, action) {
  // выключенный калькулятор включается только кнопкой C (ON)
  if (!state.power && action.type !== 'clear') return state;
  // после ошибки работает только C
  if (state.error && action.type !== 'clear') return state;

  const x = parseFloat(state.current);

  switch (action.type) {
    case 'digit': {
      let current = state.startNew ? '0' : state.current;
      if (countDigits(current) >= MAX_DIGITS && !state.startNew) return state;
      if (current === '0') current = action.digit;
      else if (current === '-0') current = '-' + action.digit;
      else current += action.digit;
      return { ...state, current, startNew: false };
    }

    case 'dot': {
      const current = state.startNew ? '0' : state.current;
      if (current.includes('.') || countDigits(current) >= MAX_DIGITS) return { ...state, current, startNew: false };
      return { ...state, current: current + '.', startNew: false };
    }

    case 'backspace': {             // ← — удалить последнюю цифру (результат не редактируется)
      if (state.startNew) return state;
      let current = state.current.slice(0, -1);
      if (current === '' || current === '-') current = '0';
      return { ...state, current };
    }

    case 'clearEntry':              // CE — стереть только текущее число
      return { ...state, current: '0', startNew: false };

    case 'clear':                   // C (ON) — полный сброс и включение, память сохраняется
      return { ...initialState, memory: state.memory };

    case 'off':                     // OFF — выключение (память стирается, как у настоящего калькулятора)
      return { ...initialState, power: false };

    case 'memoryAdd':               // M+ — прибавить число на экране к памяти
    case 'memorySub': {             // M− — вычесть число на экране из памяти
      const sign = action.type === 'memoryAdd' ? 1 : -1;
      const memory = parseFloat((state.memory + sign * x).toPrecision(12));
      if (format(memory) === null) return errorState(state);
      return { ...state, memory, startNew: true };
    }

    case 'memoryRecall':            // MRC — первое нажатие показывает память, второе подряд очищает её
      if (state.mrcPressed) return { ...state, memory: 0, mrcPressed: false };
      return withResult(state, state.memory, { startNew: true, mrcPressed: true });

    case 'operator': {
      let next = state;
      // цепочка: 2 + 3 × … — сначала считаем 2 + 3
      if (state.operator !== null && !state.startNew) {
        next = withResult(state, calculate(state.stored, state.operator, x));
        if (next.error) return next;
      }
      return { ...next, stored: parseFloat(next.current), operator: action.operator, startNew: true };
    }

    case 'equals': {
      if (state.operator !== null) {
        return withResult(state, calculate(state.stored, state.operator, x), {
          lastOperator: state.operator, lastOperand: x, operator: null, stored: null, startNew: true
        });
      }
      if (state.lastOperator !== null) {   // повторное «=»: 2 + 3 = = → 8
        return withResult(state, calculate(x, state.lastOperator, state.lastOperand), { startNew: true });
      }
      return { ...state, startNew: true };
    }

    case 'sign':                    // ± — смена знака
      if (state.current === '0') return state;
      return { ...state, current: state.current.startsWith('-') ? state.current.slice(1) : '-' + state.current };

    case 'sqrt':                    // √
      if (x < 0) return errorState(state);
      return withResult(state, Math.sqrt(x), { startNew: true });

    case 'inverse':                 // 1/x
      if (x === 0) return errorState(state);
      return withResult(state, 1 / x, { startNew: true });

    case 'percent': {
      // 200 + 10 % → 10 % от 200 = 20, затем «=» даёт 220
      // 200 × 10 % → 0,1, затем «=» даёт 20;  без операции: 50 % → 0,5
      const value = state.operator === '+' || state.operator === '-' ? state.stored * x / 100 : x / 100;
      return withResult(state, value, { startNew: true });
    }

    default:
      return state;
  }
}
