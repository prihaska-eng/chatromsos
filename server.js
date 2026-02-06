// server.js
const express = require('express');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(express.json());

// Хранилище сообщений в памяти
let messages = [];

// Хранилище пользователей (ip -> userId)
let users = {};

// Функция для генерации случайного идентификатора
function generateUserId() {
    return crypto.randomBytes(8).toString('hex'); // 16-символьный хекс
}

// Middleware для назначения userId по IP
app.use((req, res, next) => {
    const ip = req.ip;
    if (!users[ip]) {
        users[ip] = generateUserId();
    }
    req.userId = users[ip];
    next();
});

// POST /messages — отправка сообщения
app.post('/messages', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Message text is required' });

    const message = {
        id: crypto.randomBytes(6).toString('hex'),
        userId: req.userId,
        ip: req.ip,
        text,
        timestamp: new Date().toISOString()
    };

    messages.push(message);
    res.json({ success: true, message });
});

// GET /messages — получение истории сообщений
app.get('/messages', (req, res) => {
    res.json(messages);
});

// GET /me — узнать свой userId
app.get('/me', (req, res) => {
    res.json({ userId: req.userId });
});

app.listen(port, () => {
    console.log(`Chat server running on http://localhost:${port}`);
});
