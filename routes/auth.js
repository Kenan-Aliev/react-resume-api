const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const router = Router()
const User = require('../models/user')
const regEmail = require('../emails/registration')
const keys = require('../keys/index')

const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: keys.FROM_EMAIL,
            pass: keys.EMAIL_PASS
        }
    }, {
        from: `<${keys.FROM_EMAIL}>`
    }
)


router.post('/registration',
    [
        check('email', 'Неверный формат email').isEmail(),
        check('username', 'Имя должно быть минимум 5 символов').isString().isLength({min: 5}),
        check('password', 'Пароль должен быть минимум 7 символов').isLength({min: 7})
    ],
    async (req, res) => {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return res.status(400).json({message: error.errors[0].msg})
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
            const token = jwt.sign({email, username, password}, keys.SECRET_KEY, {expiresIn: "3m"})
            await transporter.sendMail(regEmail(email, token))
            return res.status(200).json({message: "Перейдите на почту чтобы подтвердить регистрацию"})

        } catch (error) {
            return res.status(500).json({message: "Что-то пошло не так,повторите попытку", error})
        }
    })

router.post('/verification', async (req, res) => {
    try {
        const {token} = req.body
        const decode = jwt.verify(token, keys.SECRET_KEY)
        const hashPassword = await bcrypt.hash(decode.password, 10)
        const newUser = new User({
            email: decode.email,
            username: decode.username,
            password: hashPassword
        })
        await newUser.save()
        return res.status(200).json({message: "Вы успешно зарегистрировались на нашем сайте"})
    } catch (error) {
        return res.status(500).json({message: "Неверный токен или срок его действия истек", error})
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
        const token = jwt.sign({
            id: candidate._id,
            email: candidate.email
        }, keys.SECRET_KEY, {expiresIn: '24h'})
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