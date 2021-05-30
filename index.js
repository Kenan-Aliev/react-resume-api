const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const MongoStore = require('connect-mongodb-session')(session)
const server = express()
const authRoutes = require('./routes/auth')
const resumeRoutes = require('./routes/resume')
const userMiddleware = require('./middlewares/user')
const githubAuth = require('./githubOauth/githubAuth')
const keys = require('./keys/index')


const store = new MongoStore({
    collection: 'sessions',
    uri: keys.DB_URL
})


server.use(session({
        secret: keys.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store
    }
))


server.use(cors())
server.use(helmet())
server.use(compression())
server.use(express.json())
server.use(passport.initialize())
server.use(passport.session())


// server.use(userMiddleware)
server.use('/auth', authRoutes)
server.use('/resume', resumeRoutes)
server.use('/github', githubAuth)

const PORT = process.env.PORT || 5000


const start = async () => {
    try {
        await mongoose.connect(keys.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })
        server.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }

}

start()