const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req,res,next){
    const token = req.headers.authorization.split(' ')[1]
    if(!token){
        return res.status(400).json({message:"Отсутствует токен"})
    }
    const decode = jwt.verify(token,config.get("SECRET_KEY"))
    console.log(decode)
    if(!decode){
        return res.status(400).json({message:"Неверный токен"})
    }

    req.user = decode
    next()
}