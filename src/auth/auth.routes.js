const { Router } = require('express')
const { authSchema, authGoogleSchema } = require('../utils/schemas')
const { validationHandler, validateJwt } = require('../utils/middlewares')

const {
  authSigInUser, GoogleSigInUser, refreshToken
} = require('./auth.controller')

const router = Router()
router.post('/login', [validationHandler(authSchema, 'body')], authSigInUser)
router.post('/google', [validationHandler(authGoogleSchema, 'body')], GoogleSigInUser)
router.get('/', [validateJwt], refreshToken)
module.exports = router
