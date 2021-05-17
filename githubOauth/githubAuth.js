const passport = require('passport')
require('./passportSetup')
const {Router} = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/user')

router.get('/auth', passport.authenticate('github', {scope: ['profile', 'email']}))

router.get('/failed', (req, res) => {
    // res.redirect('http://localhost:3000?auth=error')
    res.json({message: "Authorization failed"})
})

router.get('/successAuth', passport.authenticate('github', {failureRedirect: '/failed'}),
    (req, res) => {
        req.session.save((err) => {
            if (err) {
                throw err
            }
            res.json({id: req.user._id, email: req.user.email})

        })
        // const token = jwt.sign({id: req.user._id}, config.get('secretKey'), {expiresIn: '1m'})
        // res.redirect('http://localhost:3000/google/auth/' + token)
    }
)

// router.post('/token/checkout', async (req, res) => {
//     try {
//         const {token} = req.body
//         const decode = jwt.verify(token, config.get('secretKey'))
//         if (!decode) {
//             return res.status(400).json({message: 'Неверный токен'})
//         }
//         const user = await User.findOne({_id: decode.id})
//         const newToken = jwt.sign({id: user._id}, config.get('secretKey'), {expiresIn: '24h'})
//         return res.json({
//             message: "ОК",
//             newToken
//         })
//     } catch (error) {
//         return res.status(500).json({message: 'Server error', error})
//     }
//
// })

router.get('/logout', (req, res) => {
    req.session.destroy()
    req.logout();
    res.json({message: "You logged out"})

})


module.exports = router