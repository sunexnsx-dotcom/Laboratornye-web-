import { useEffect, useReducer, useState } from 'react';
import Display from './components/Display.jsx';
import Keypad, { KEYS } from './components/Keypad.jsx';
import { initialState, reducer } from './logic/calculator.js';

// Дополнительные клавиши клавиатуры компьютера
const KEY_ALIASES = { '=': 'Enter', ',': '.' };

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pressedKey, setPressedKey] = useState(null);

  // Ввод с клавиатуры: цифры, + − * /, Enter, Backspace, Esc (C), Delete (CE)
  useEffect(() => {
    const onKeyDown = e => {
      const name = KEY_ALIASES[e.key] ?? e.key;
      const button = KEYS.find(k => k.key === name);
      if (!button) return;
      e.preventDefault();
      dispatch(button.action);
      setPressedKey(button.label);
      setTimeout(() => setPressedKey(null), 90);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="calc">
      <div className="calc__head">
        <div className="calc__brand">ВЕКТОР</div>
        <div className="calc__model"><b>КС-8</b>8 РАЗРЯДОВ</div>
      </div>

      <Display value={state.current} operator={state.operator} error={state.error}
               memory={state.memory} power={state.power} />
      <Keypad onPress={dispatch} pressedKey={pressedKey} />

      <p className="hint">Можно вводить с клавиатуры: цифры, + − * /, Enter, Backspace, Esc (C), Delete (CE). C включает калькулятор после OFF.</p>
    </div>
  );
}
