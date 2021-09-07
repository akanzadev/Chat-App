const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const config = require('./config')
const connection = require('../database/connection')
const { socketHandler } = require('../sockets/socket')

const {
  logErrors,
  errorHandler,
  checkMulterError,
  wrapErrors
} = require('../utils/middlewares/errorHandler')
const notFoundHandler = require('../utils/middlewares/notFoundHandler')

class Server {
  constructor () {
    this.app = express()
    // Creando servidor basado en express
    this.server = require('http').createServer(this.app)
    // Creando variable de socket.io
    this.io = require('socket.io')(this.server)
    // Middlewares
    this.middlewares()
    // Routes
    this.routes()
    // Not found
    this.notFound()
    // Manejo de errores
    this.errorHandler()
    // Connect to DB
    this.connectDB()
    // SocketHandler
    this.sockets()
  }

  middlewares () {
    // CORS
    this.app.use(cors())
    // Morgan
    this.app.use(morgan('dev'))
    // Parsed JSON
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    // Directorio publico
    this.app.use(express.static('public'))
  }

  async connectDB () {
    await connection()
  }

  routes () {
    this.app.use('/api/auth', require('../auth/auth.routes'))
    this.app.use('/api/users', require('../user/user.routes'))
    this.app.use(
      '/api/categories',
      require('../product/categories/categories.routes')
    )
    this.app.use(
      '/api/products',
      require('../product/products/products.routes')
    )
    this.app.use('/api/search', require('../search/search.routes'))
  }

  errorHandler () {
    this.app.use(logErrors)
    this.app.use(checkMulterError)
    this.app.use(wrapErrors)
    this.app.use(errorHandler)
  }

  notFound () {
    this.app.use(notFoundHandler)
  }

  listen () {
    this.server.listen(config.SERVER.PORT, () => {
      console.log('Server on port ', config.SERVER.PORT)
    })
  }

  sockets () {
    this.io.on('connection', (socket) => socketHandler(socket, this.io))
  }
}

module.exports = Server
