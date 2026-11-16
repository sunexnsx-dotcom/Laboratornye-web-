import { useState } from 'react';

const EMPTY = { fio: '', login: '', password: '', birthdate: '' };

// Задание 3. Форма регистрации. Данные проверяются и обрабатываются на сервере в register.php.
export default function RegisterForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [errors, setErrors] = useState([]);
  const [user, setUser] = useState(null);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const today = new Date().toISOString().slice(0, 10);

  const submit = async e => {
    e.preventDefault();
    setStatus('sending');
    setErrors([]);
    try {
      const response = await fetch('register.php', { method: 'POST', body: new FormData(e.target) });
      const result = await response.json();
      if (result.ok) {
        setUser(result.user);
        setStatus('done');
        setForm(EMPTY);
      } else {
        setErrors(result.errors);
        setStatus('idle');
      }
    } catch {
      setErrors(['Не удалось связаться с сервером. Запустите PHP-сервер: php -S localhost:8000']);
      setStatus('idle');
    }
  };

  if (status === 'done' && user) {
    return (
      <div className="result result--ok">
        <h3>Регистрация прошла успешно</h3>
        <table>
          <tbody>
            {Object.entries(user).map(([label, value]) => (
              <tr key={label}><th>{label}</th><td className={label === 'Хеш пароля' ? 'hash' : ''}>{value}</td></tr>
            ))}
          </tbody>
        </table>
        <button className="btn" onClick={() => { setUser(null); setStatus('idle'); }}>Зарегистрировать ещё</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      {errors.length > 0 && (
        <div className="result result--err" role="alert">
          <h3>Исправьте ошибки</h3>
          <ul>{errors.map(err => <li key={err}>{err}</li>)}</ul>
        </div>
      )}

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

      <button type="submit" className="btn btn--fill" disabled={status === 'sending'}>
        {status === 'sending' ? 'Отправка…' : 'Зарегистрироваться'}
      </button>
    </form>
  );
}
