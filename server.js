require('dotenv').config(); // Загружаем переменные из .env
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// Используем порт из .env или 3000 по умолчанию
const PORT = process.env.PORT || 3000;

// Настройка подключения через переменные окружения
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        // Это обязательное условие для внешнего подключения к Render
        rejectUnauthorized: false 
    }
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Ошибка подключения к базе:', err.message);
    } else {
        console.log('✅ База данных подключена успешно!');
    }
});

app.use(express.static('public'));

/**
 * Эндпоинт: Получение всех зданий
 */
app.get('/api/buildings', async (req, res) => {
    try {
        const query = 'SELECT building_id, building_lat, building_long FROM Buildings';
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Ошибка при получении зданий:", err.message);
        res.status(500).json({ error: "Ошибка базы данных" });
    }
});

/**
 * API для сенсоров
 */
app.get('/api/sensors', async (req, res) => {
    const { date, hour } = req.query;
    
    // Проверка на наличие параметров, чтобы сервер не падал
    if (!date || !hour) {
        return res.status(400).json({ error: "Параметры date и hour обязательны" });
    }

    const targetTime = `${date} ${hour.padStart(2, '0')}:00:00`;
    
    try {
        const query = `
            SELECT r.*, s.*, b.* FROM Sensor_Readings r
            JOIN Sensors s ON r.sensor_id = s.sensor_id
            JOIN Buildings b ON s.building_id = b.building_id
            WHERE r.timestamp = $1
        `;
        const { rows } = await pool.query(query, [targetTime]);
        res.json(rows);
    } catch (err) {
        console.error("Ошибка при получении данных сенсоров:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🔗 Ссылка: http://localhost:${PORT}`);
});