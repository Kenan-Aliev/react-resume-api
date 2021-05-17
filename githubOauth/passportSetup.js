const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user')
const config = require('config')

passport.serializeUser(function (user, done) {
    done(null, user._id)
});


passport.deserializeUser(async function (id, done) {
    const findUser = await User.findOne({_id: id})
    done(null, findUser);
});


passport.use(new GitHubStrategy({
        clientID: config.get("CLIENT_ID"),
        clientSecret: config.get("CLIENT_SECRET"),
        callbackURL: "http://localhost:5000/github/successAuth"
    },
    async function (accessToken, refreshToken, profile, done) {
        const user = await User.findOne({githubId: profile.id})
        if (!user) {
            const newUser = await new User({
                email: profile._json.html_url,
                githubId: profile._json.id,
                username: profile._json.login
            }).save()
            return done(null, newUser)
        }
        return done(null, user);
    }
));