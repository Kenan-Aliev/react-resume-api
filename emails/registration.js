const config = require('config')

module.exports = function (email, token) {
    return {
        to: email,
        from: config.get("FROM_EMAIL"),
        subject: 'Подтверждение регистрации',
        html: `
        <h1>Добро пожаловать на наш сайт</h1>
         <p>Чтобы подтвердить регистрацию,перейдите по ссылке ниже</p>
        <hr/>
        <a href="${config.get("BASE_URL")}/auth/verification/${token}">Перейти на сайт</a>
                `
    }
}