const User = require('../user/user.model')
const { decodedJwt } = require('../utils/helpers/jwt')
const boom = require('@hapi/boom')
const Chat = require('../chat/chat')

const chat = new Chat()

const socketHandler = async (socket, io) => {
  const token = socket.handshake.headers.authorization
  const { uid } = await decodedJwt(token)
  // Buscar usuario
  const user = await User.findById(uid)
  // Verificar si usuari existe
  if (!user) {
    socket.disconnect()
    return boom.unauthorized('User not found')
  }
  // Verificar si usuario esta activo
  if (!user.status) {
    socket.disconnect()
    return boom.unauthorized('User is not active')
  }
  chat.connectUser(user)
  io.emit('usuarios-activos', chat.userArray)

  // Limpiar usuario que se desconecta
  socket.on('disconnect', () => {
    chat.disconnectUser(user._id)
    io.emit('usuarios-activos', chat.userArray)
  })
}

module.exports = { socketHandler }
