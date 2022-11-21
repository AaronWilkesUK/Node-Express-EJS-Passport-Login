const express = require('express')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const getRoot = require('../controllers/login.js').getRoot
const getRegister = require('../controllers/login.js').getRegister
const getLogin = require('../controllers/login.js').getLogin
const postRegister = require('../controllers/login.js').postRegister
const postLogout = require('../controllers/login.js').postLogout

const app = express()

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', checkIsAuthenticated, getRoot)
app.get('/register', checkIsNotAuthenticated, getRegister)
app.get('/login', checkIsNotAuthenticated, getLogin)

app.post('/register', checkIsNotAuthenticated, postRegister)
app.post('/login', checkIsNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
app.post('/logout', checkIsAuthenticated, postLogout)

function checkIsAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkIsNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = app;
