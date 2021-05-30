const keys = require('../keys/index')

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.FROM_EMAIL,
        subject: 'Подтверждение регистрации',
        html: `
        <h1>Добро пожаловать на наш сайт</h1>
         <p>Чтобы подтвердить регистрацию,перейдите по ссылке ниже</p>
        <hr/>
        <a href="http://localhost:3000/auth/verification/${token}">Перейти на сайт</a>
                `
    }
}