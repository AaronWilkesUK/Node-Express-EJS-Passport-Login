const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const initialise = (passport, getUserByEmail, getUserById) => {
    const authenticateUser = (email, password, done) => {
        const user = getUserByEmail(email)
        if(user == null) {
            return done(null, false, { message: 'Invalid Email or Password'})
        }
        bcrypt.compare(password, user.password)
        .then((result) => {
            if(result) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Invalid Email or Password'})
            }
        })
        .catch((err) => {
            return done(err)
        })
    }

    passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => done(null, getUserById(id)))
}

module.exports = initialise