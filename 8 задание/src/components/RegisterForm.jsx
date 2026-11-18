import { useState } from 'react';

const EMPTY = { fio: '', login: '', password: '', birthdate: '' };

// Задание 3. Форма регистрации.
// Форма отправляется обычным POST-запросом в register.php: PHP проверяет данные
// и сам формирует страницу с результатом. В браузере работает только встроенная проверка полей.
export default function RegisterForm() {
  const [form, setForm] = useState(EMPTY);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form className="form" action="register.php" method="post">
      <div className="field">
        <label htmlFor="fio">ФИО</label>
        <input id="fio" name="fio" value={form.fio} onChange={change} required minLength={5} maxLength={100}
               pattern="[A-Za-zА-Яа-яЁё\- ]+" placeholder="Иванов Иван Иванович" autoComplete="name" />
        <small>Фамилия, имя и отчество через пробел, только буквы и дефис</small>
      </div>

      <div className="field">
        <label htmlFor="login">Логин</label>
        <input id="login" name="login" value={form.login} onChange={change} required minLength={3} maxLength={20}
               pattern="[A-Za-z0-9_]+" placeholder="ivanov_2006" autoComplete="username" />
        <small>От 3 до 20 символов: латинские буквы, цифры, знак _</small>
      </div>

      <div className="field">
        <label htmlFor="password">Пароль</label>
        <input id="password" name="password" type="password" value={form.password} onChange={change}
               required minLength={6} maxLength={50} autoComplete="new-password" />
        <small>Не короче 6 символов, должны быть буквы и цифры</small>
      </div>

      <div className="field">
        <label htmlFor="birthdate">Дата рождения</label>
        <input id="birthdate" name="birthdate" type="date" value={form.birthdate} onChange={change}
               required min="1900-01-01" max={today} />
      </div>

      <button type="submit" className="btn btn--fill">Зарегистрироваться</button>
    </form>
  );
}
