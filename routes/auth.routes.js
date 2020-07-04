const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

const router = Router()

const User = require('../models/User')
const config = require('config')

// /api/auth/register
router.post(
    '/register',
    // Валидация
    [
      check('email', 'Некорректный email').isEmail(),
      check('password', 'Минимальная длина пароля должна быть 6 символов')
          .isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            // Проверка на ошибки валидации
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }

            const {email, password} = req.body

            // Проверка на существавание данного пользователя в базе данных
            const candidate = await User.findOne({ email }) // email: email

            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' })
            }

            // Хэширование пароля
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, password: hashedPassword })

            // Сохранение пользователь в базе данных
            await user.save()

            res.status(201).json({ message: 'Пользователь создан' })

        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
})

// /api/auth/login
router.post(
    '/login',
    // Валидация
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ]
    ,async (req, res) => {
        try {
            const errors = validationResult(req)

            // Проверка на ошибки валидации
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }

            const { email, password } = req.body

            // Поиск пользователя по email
            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' })
            }

            // Совпавдение паролей данного пользователя
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'Неверные данные, попробуйте ещё раз' })
            }

            // Авторизация пользователя через jwt токен
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' } // сколько продлится существование jwt токена
            )

            res.json({ userId: user.id, token }) // статус 200 по умолчанию

        } catch (e) {
            res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
        }
})

module.exports = router