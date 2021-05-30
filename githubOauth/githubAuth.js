const passport = require('passport')
require('./passportSetup')
const {Router} = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const keys = require('../keys/index')

router.get('/auth', passport.authenticate('github', {scope: ['profile', 'email']}))

router.get('/failed', (req, res) => {
    // res.redirect('http://localhost:3000?auth=error')
    res.json({message: "Authorization failed"})
})

router.get('/successAuth', passport.authenticate('github', {failureRedirect: '/failed'}),
    (req, res) => {
        const token = jwt.sign({id: req.user._id}, keys.SECRET_KEY, {expiresIn: '1m'})
        req.session.save((err) => {
            if (err) {
                throw err
            }
            res.redirect(`http://localhost:3000/auth/github/${token}`)
        })
    }
)

router.post('/token/checkout', async (req, res) => {
    try {
        const {token} = req.body
        const decode = jwt.verify(token, keys.SECRET_KEY)
        if (!decode) {
            return res.status(400).json({message: 'Неверный токен'})
        }
        const user = await User.findOne({_id: decode.id})
        const newToken = jwt.sign({id: user._id}, keys.SECRET_KEY, {expiresIn: '24h'})
        return res.status(200).json({
            message: "GitHub авторизация прошла успешно",
            newToken
        })
    } catch (error) {
        return res.status(500).json({message: 'Server error', error})
    }

})

router.get('/logout', (req, res) => {
    req.session.destroy()
    req.logout();
    res.json({message: "You logged out"})

})


module.exports = router