// Импорт необходимых модулей
const express = require('express');
const cors = require('cors');
// Импорт "базы данных" из локального JSON-файла
const sensorData = require('./data.json'); 
const app = express();
const PORT = 3000;

// Middleware для разрешения CORS (чтобы фронтенд мог запрашивать данные)
app.use(cors());
// Middleware для обработки JSON-запросов
app.use(express.json());

// -----------------------------------------------------------------
// Маршрут API для получения данных датчиков
// http://localhost:3000/api/sensors?date=...&hour=...&houseId=...
// -----------------------------------------------------------------
app.get('/api/sensors', (req, res) => {
    // Получение параметров запроса для фильтрации
    const { date, hour, houseId } = req.query;

    let filteredData = sensorData;

    // Логика фильтрации по дате и часу (Этап 5)
    if (date || hour) {
        // В реальном приложении здесь будет логика фильтрации по timestamp
        console.log(`Фильтрация данных для: Дата=${date}, Час=${hour}`);
    }
    
    // ЛОГИКА ФИЛЬТРАЦИИ ПО ЗДАНИЮ
    if (houseId) {
        filteredData = filteredData.filter(sensor => sensor.houseId === houseId);
        console.log(`Фильтрация по зданию: ${houseId}. Найдено ${filteredData.length} датчиков.`);
    }

    // Отправляем данные в формате JSON
    res.json(filteredData);
});

// Маршрут для отдачи статических файлов (чтобы открыть index.html через localhost)
app.use(express.static(__dirname));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`✅ Сервер Express запущен на порту ${PORT}`);
    console.log(`   API доступен по адресу: http://localhost:${PORT}/api/sensors`);
    console.log(`   Фронтенд доступен по адресу: http://localhost:${PORT}/index.html`);
});