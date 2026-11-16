import MultiplicationTable from './components/MultiplicationTable.jsx';
import CalendarSection from './components/CalendarSection.jsx';
import RegisterForm from './components/RegisterForm.jsx';

export default function App() {
  return (
    <>
      <header>
        <h1>Лабораторная работа: задание 8</h1>
        <p>React и PHP</p>
        <nav>
          <a href="#mult">1. Таблица умножения</a>
          <a href="#cal">2. Календарь</a>
          <a href="#reg">3. Регистрация</a>
        </nav>
      </header>

      <main>
        <section id="mult">
          <h2>Задание 1. Таблица умножения</h2>
          <p className="task">Таблица умножения чисел от 0 до 10. Наведите на ячейку — подсветятся её строка и столбец.</p>
          <MultiplicationTable max={10} />
        </section>

        <section id="cal">
          <h2>Задание 2. Календарь на месяц</h2>
          <p className="task">Компонент <code>&lt;Calendar month year /&gt;</code> выводит календарь на заданный месяц.
            Выходные и праздничные дни выделены цветом. Если параметры не заданы, выводится текущий месяц.</p>
          <CalendarSection />
        </section>

        <section id="reg">
          <h2>Задание 3. Регистрация пользователя</h2>
          <p className="task">Данные формы обрабатываются на сервере в файле <code>register.php</code>.</p>
          <RegisterForm />
        </section>
      </main>
    </>
  );
}
