const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req,res,next){
    try {
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
    }catch (e) {
        return res.status(500).json({message:"Возможно,время жизни токена для доступа истекло. Пожалуйста,авторизуйтесь заново"})
    }

}