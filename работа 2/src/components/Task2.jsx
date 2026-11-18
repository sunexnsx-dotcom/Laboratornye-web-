// Задание 2: адаптивный макет из task.html, вариант 15.
// Объекты идут в вариантах 0 → 4 → 1 → 2 → 3.
// Размеры и перестройка под 1200 / 768 / 320px — в style.css.

function Block({ color, className = '' }) {
  return (
    <div className={`block c-${color.slice(1).toLowerCase()} ${className}`.trim()}>
      {color}
    </div>
  );
}

// Объект 1 — вариант 0
function Object1() {
  return (
    <div className="object o1">
      <Block color="#CD5C5C" />
      <Block color="#DC143C" />
      <Block color="#8B0000" />
    </div>
  );
}

// Объект 2 — вариант 4
function Object2() {
  return (
    <div className="object o2">
      <div className="col o2-main">
        <Block color="#FFC0CB" />
        <Block color="#FF69B4" />
      </div>
      <Block color="#C71585" />
    </div>
  );
}

// Объект 3 — вариант 1
function Object3() {
  return (
    <div className="object o3">
      <div className="col o3-main">
        <div className="row">
          <Block color="#32CD32" className="s" />
          <Block color="#00FA9A" className="l" />
        </div>
        <div className="row">
          <Block color="#2E8B57" className="l" />
          <Block color="#006400" className="s" />
        </div>
        <div className="row">
          <Block color="#9ACD32" className="s" />
          <Block color="#808000" className="l" />
        </div>
      </div>
      <div className="col o3-side">
        <Block color="#ADFF2F" />
        <Block color="#00FF00" />
      </div>
    </div>
  );
}

// Объект 4 — вариант 2
function Object4() {
  return (
    <div className="object o4">
      <Block color="#FFA07A" />
      <Block color="#FF4500" />
      <Block color="#FFA500" />
    </div>
  );
}

// Объект 5 — вариант 3
function Object5() {
  return (
    <div className="object o5">
      <div className="col o5-a">
        <Block color="#BC8F8F" />
        <Block color="#F4A460" />
      </div>
      <Block color="#D2691E" />
      <div className="col o5-c">
        <Block color="#8B4513" />
        <div className="row o5-row">
          <Block color="#A52A2A" />
          <Block color="#800000" />
        </div>
      </div>
    </div>
  );
}

export default function Task2() {
  return (
    <div className="task2">
      <div className="layout">
        <Object1 />
        <Object2 />
        <Object3 />
        <Object4 />
        <Object5 />
      </div>
    </div>
  );
}
