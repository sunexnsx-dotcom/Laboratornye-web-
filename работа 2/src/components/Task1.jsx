// Задание 1: последние 2 цифры студенческого билета — 8 и 3.
// Только div, один цвет, без margin/padding/position.
// 1 — закрашенный квадрат, 0 — пустой.

const DIGITS = {
  8: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1]
  ],
  3: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1]
  ]
};

function Digit({ value }) {
  return (
    <div className="digit">
      {DIGITS[value].map((row, r) => (
        <div className="digit-row" key={r}>
          {row.map((cell, c) => (
            <div className={cell ? 'b' : undefined} key={c}></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Task1() {
  return (
    <div className="task1">
      <div className="numbers">
        <Digit value={8} />
        <Digit value={3} />
      </div>
    </div>
  );
}
