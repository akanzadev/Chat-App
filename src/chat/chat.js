const Message = require('./message')

class Chat {
  constructor () {
    this.messages = []
    this.users = {}
  }

  get last10 () {
    this.messages = this.messages.splice(0, 10)
    return this.messages
  }

  get userArray () {
    return Object.values(this.users)
  }

  sendMessage (uid, name, message) {
    this.messages.unshift(new Message(uid, name, message))
  }

  connectUser (user) {
    this.users[user._id] = user
  }

  disconnectUser (uid) {
    delete this.users[uid]
  }
}

module.exports = Chat
