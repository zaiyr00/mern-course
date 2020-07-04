const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    // Проверка на доступность сервера
    if (req.method === 'OPTIONS') {
        return next()
    }

    // Для запроса (GET, POST...)
    try {
        const token = req.headers.authorization.split(" ")[1] // "Bearer TOKEN"

        // Если нет авторизации
        if (!token) {
            return res.status(401).json({ message: 'Нет авторизации' })
        }

        // Раскодировка токена
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Помещение токена в user
        req.user = decoded;

        next()

    } catch (e) {
        res.status(401).json({ message: 'Нет авторизации' })
    }
}