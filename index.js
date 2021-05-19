const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const MongoStore = require('connect-mongodb-session')(session)
const server = express()
const authRoutes = require('./routes/auth')
const resumeRoutes = require('./routes/resume')
const userMiddleware = require('./middlewares/user')
const githubAuth = require('./githubOauth/githubAuth')

const store = new MongoStore({
    collection: 'sessions',
    uri: config.get("DB_URL")
})


server.use(session({
        secret: config.get("SESSION_SECRET"),
        resave: false,
        saveUninitialized: false,
        store
    }
))


server.use(cors())
server.use(express.json())
server.use(passport.initialize())
server.use(passport.session())


// server.use(userMiddleware)
server.use('/auth', authRoutes)
server.use('/resume', resumeRoutes)
server.use('/github', githubAuth)

const start = async () => {
    try {
        await mongoose.connect(config.get("DB_URL"), {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })
        server.listen(config.get("PORT"), () => {
            console.log(`Server started on port ${config.get("PORT")}`)
        })
    } catch (e) {
        console.log(e)
    }

}

start()