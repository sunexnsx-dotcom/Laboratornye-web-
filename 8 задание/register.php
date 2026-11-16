<?php
/*
 * Задание 3. Обработка формы регистрации на PHP.
 * Принимает ФИО, логин, пароль и дату рождения (POST), проверяет их
 * и возвращает ответ в формате JSON для React-приложения.
 */

header('Content-Type: application/json; charset=utf-8');

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

function respond(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
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
    respond(200, ['ok' => false, 'errors' => $errors]); // ошибки заполнения — обычный ответ, форма покажет их пользователю
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
