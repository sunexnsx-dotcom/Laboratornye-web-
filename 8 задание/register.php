<?php
/*
 * Задание 3. Обработка формы регистрации на PHP.
 * Принимает ФИО, логин, пароль и дату рождения из формы (POST), проверяет их
 * и выводит страницу с результатом регистрации или со списком ошибок.
 */

header('Content-Type: text/html; charset=utf-8');

// Склонение слова «год»
function ageWord(int $n): string
{
    $n100 = $n % 100;
    $n10 = $n % 10;
    if ($n100 >= 11 && $n100 <= 14) return 'лет';
    if ($n10 === 1) return 'год';
    if ($n10 >= 2 && $n10 <= 4) return 'года';
    return 'лет';
}

// Экранирование вывода, чтобы введённый текст не мог стать HTML-кодом
function e(string $text): string
{
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

// Выводит HTML-страницу с результатом и завершает скрипт
function respond(int $code, array $body): void
{
    http_response_code($code);
    $ok = $body['ok'];
    ?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $ok ? 'Регистрация прошла успешно' : 'Ошибка регистрации' ?></title>
    <style>
        body { margin: 0; font-family: Arial, sans-serif; background: #f4f6fa; color: #1f2937; }
        .box { max-width: 560px; margin: 60px auto; padding: 24px 28px; background: #fff; border-radius: 12px;
               box-shadow: 0 6px 20px rgba(0, 0, 0, .08); }
        h1 { margin: 0 0 14px; font-size: 22px; color: <?= $ok ? '#2f7a4b' : '#c0392b' ?>; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { text-align: left; padding: 8px 6px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
        th { width: 40%; color: #6b7280; }
        .hash { font-family: Consolas, monospace; font-size: 12px; word-break: break-all; color: #6b7280; }
        ul { color: #c0392b; padding-left: 20px; }
        a { display: inline-block; padding: 10px 18px; background: #3b5bdb; color: #fff; border-radius: 8px; text-decoration: none; }
    </style>
</head>
<body>
<div class="box">
<?php if ($ok): ?>
    <h1>Регистрация прошла успешно</h1>
    <table>
        <?php foreach ($body['user'] as $label => $value): ?>
            <tr><th><?= e($label) ?></th><td class="<?= $label === 'Хеш пароля' ? 'hash' : '' ?>"><?= e($value) ?></td></tr>
        <?php endforeach; ?>
    </table>
    <a href="app.html#reg">Зарегистрировать ещё</a>
<?php else: ?>
    <h1>Исправьте ошибки</h1>
    <ul>
        <?php foreach ($body['errors'] as $error): ?>
            <li><?= e($error) ?></li>
        <?php endforeach; ?>
    </ul>
    <a href="javascript:history.back()">Вернуться к форме</a>
<?php endif; ?>
</div>
</body>
</html>
<?php
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'errors' => ['Данные нужно отправлять методом POST через форму регистрации.']]);
}

$fio       = preg_replace('/\s+/u', ' ', trim($_POST['fio'] ?? ''));
$login     = trim($_POST['login'] ?? '');
$password  = $_POST['password'] ?? '';
$birthdate = trim($_POST['birthdate'] ?? '');

$errors = [];

// ФИО: буквы, пробелы и дефис, минимум два слова
if ($fio === '') {
    $errors[] = 'Введите ФИО.';
} elseif (!preg_match('/^[A-Za-zА-Яа-яЁё\- ]{5,100}$/u', $fio)) {
    $errors[] = 'ФИО может содержать только буквы, пробелы и дефис (от 5 до 100 символов).';
} elseif (count(explode(' ', $fio)) < 2) {
    $errors[] = 'Укажите как минимум фамилию и имя.';
}

// Логин: латиница, цифры, подчёркивание
if ($login === '') {
    $errors[] = 'Введите логин.';
} elseif (!preg_match('/^[A-Za-z0-9_]{3,20}$/', $login)) {
    $errors[] = 'Логин: от 3 до 20 символов, только латинские буквы, цифры и знак _.';
}

// Пароль: не короче 6 символов, есть буквы и цифры
if ($password === '') {
    $errors[] = 'Введите пароль.';
} elseif (mb_strlen($password) < 6) {
    $errors[] = 'Пароль должен быть не короче 6 символов.';
} elseif (!preg_match('/\pL/u', $password) || !preg_match('/\d/', $password)) {
    $errors[] = 'Пароль должен содержать и буквы, и цифры.';
}

// Дата рождения: правильная дата, не в будущем, не раньше 1900 года
$birth = DateTime::createFromFormat('!Y-m-d', $birthdate);
$today = new DateTime('today');
if ($birthdate === '') {
    $errors[] = 'Укажите дату рождения.';
} elseif (!$birth || $birth->format('Y-m-d') !== $birthdate) {
    $errors[] = 'Дата рождения указана неверно.';
} elseif ($birth > $today) {
    $errors[] = 'Дата рождения не может быть в будущем.';
} elseif ((int)$birth->format('Y') < 1900) {
    $errors[] = 'Проверьте год рождения.';
}

if ($errors) {
    respond(200, ['ok' => false, 'errors' => $errors]);
}

$age = $birth->diff($today)->y;

respond(200, [
    'ok'   => true,
    'user' => [
        'ФИО'           => $fio,
        'Логин'         => $login,
        'Пароль'        => str_repeat('•', mb_strlen($password)) . ' (сохранён в виде хеша)',
        'Дата рождения' => $birth->format('d.m.Y'),
        'Возраст'       => $age . ' ' . ageWord($age),
        // Пароль никогда не хранят в открытом виде — только хеш
        'Хеш пароля'    => password_hash($password, PASSWORD_DEFAULT),
    ],
]);
