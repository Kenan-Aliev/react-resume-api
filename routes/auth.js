const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()
const User = require('../models/user')

router.post('/registration',
    [
        check('email', 'Uncorrect email').isEmail(),
        check('username', 'Username must be longer than 5 symbols').isString().isLength({min: 5}),
        check('password', 'Password must be longer than 7 symbols').isLength({min: 7})
    ],
    async (req, res) => {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return res.status(400).json({message: "Заполните правильно форму", error})
            }
            const {email, username, password} = req.body
            const candidateEmail = await User.findOne({email})
            if (candidateEmail) {
                return res.status(400).json({message: "Пользователь с таким email уже существует"})
            }
            const candidateUsername = await User.findOne({username})
            if (candidateUsername) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }
            const hashPassword = await bcrypt.hash(password, 10)
            const newUser = new User({email, username, password: hashPassword})
            await newUser.save()
            return res.status(200).json({message: "Новый пользователь успешно создан"})

        } catch (e) {
            console.log(e)
        }
    })

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if (!candidate) {
            return res.status(400).json({message: "Укажите верный email"})
        }
        const isValidPassword = await bcrypt.compare(password, candidate.password)
        if (!isValidPassword) {
            return res.status(400).json({message: "Укажите верный пароль"})
        }
        const token = jwt.sign({id: candidate._id,email:candidate.email}, config.get("SECRET_KEY"), {expiresIn: '24h'})
        // req.session.user = candidate
        // req.session.save((err) => {
        //     if (err) {
        //         throw err
        //     }
            return res.status(200).json({
                token,
                user: {
                    email: candidate.email,
                    username: candidate.username
                },
                message: "Вы успешно авторизовались"
            })
        // })

    } catch (e) {
        console.log(e)
    }
})


module.exports = router