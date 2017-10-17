import { describe, it, before } from 'mocha'
import { ChatService } from '../../src/services/chatService'
import Database from '../../src/services/gateway/database'
import { User } from '../Factories/usersFactory'

// This suite of test is not a real one. It's only for seeing in console if push notifications are sent
// when they should, but it will no fail if it doesn't. Furthermore, they are more like integration tests,
// as the tests are cumulative, since they all complete the same database. The way it is done (with events
// on child_added), there's no simple way of testing this but with console.log, as it's everything triggered
// asynchronously when the database changes ¯\_(ツ)_/¯

describe('ChatService', () => {
  let uniqueId = 0
  const newMessage = (sendingUser, text) => {
    uniqueId += 1
    const message = {
      liked: false,
      read: false,
      message: text,
      userId: sendingUser
    }
    return [uniqueId.toString(), message]
  }

  const newMessageWithUniqueId = (sendingUser, text) => {
    const message = newMessage(sendingUser, text)
    return {
      [message[0]]: message[1]
    }
  }

  describe('#detectNewMessages', () => {
    const oldUser = new User().male().get()
    const userToChat = new User().female().get()
    const newUser = new User().female().get()
    const messagesRef = Database('messages')

    before(() => {
      const users = {
        [oldUser.Uid]: oldUser,
        [userToChat.Uid]: userToChat,
        [newUser.Uid]: newUser
      }
      Database('users').set(users)

      const messages = {
        [oldUser.Uid]: {
          [userToChat.Uid]: newMessageWithUniqueId(userToChat.Uid, 'Starting message')
        }
      }
      messagesRef.set(messages)

      ChatService().detectNewMessages()
    })

    it('should send push notification when a new user starts chating', () => {
      console.log('-------------------------------------------------------------------------------')
      messagesRef.child(`${newUser.Uid}/${oldUser.Uid}`)
        .set(newMessageWithUniqueId(oldUser.Uid, '1 - New user'))
    })

    it('should send push notification when a new chat starts in a new user', () => {
      console.log('-------------------------------------------------------------------------------')
      messagesRef.child(`${newUser.Uid}/${userToChat.Uid}`)
        .set(newMessageWithUniqueId(userToChat.Uid, '2 - New chat'))
    })

    it('should send push notification when a new chat starts in an old user', () => {
      console.log('-------------------------------------------------------------------------------')
      messagesRef.child(`${oldUser.Uid}/${newUser.Uid}`)
        .set(newMessageWithUniqueId(newUser.Uid, '3 - New chat'))
    })

    it('should send push notification when a new message arrives for a new user', () => {
      console.log('-------------------------------------------------------------------------------')
      let message = newMessage(userToChat.Uid, '4 - New message')
      messagesRef.child(`${newUser.Uid}/${userToChat.Uid}/${message[0]}`).set(message[1])

      message = newMessage(oldUser.Uid, '4 - New message (2)')
      messagesRef.child(`${newUser.Uid}/${oldUser.Uid}/${message[0]}`).set(message[1])
    })

    it('should send push notification when a new message arrives in a new chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(newUser.Uid, '5 - New message')
      messagesRef.child(`${oldUser.Uid}/${newUser.Uid}/${message[0]}`).set(message[1])
    })

    it('should send push notification when a new message arrives in an old chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(userToChat.Uid, '6 - New message')
      messagesRef.child(`${oldUser.Uid}/${userToChat.Uid}/${message[0]}`).set(message[1])
    })

    it('should send push notification when a second message arrives for a new user', () => {
      console.log('-------------------------------------------------------------------------------')
      let message = newMessage(userToChat.Uid, '7 - New message')
      messagesRef.child(`${newUser.Uid}/${userToChat.Uid}/${message[0]}`).set(message[1])

      message = newMessage(oldUser.Uid, '7 - New message (2)')
      messagesRef.child(`${newUser.Uid}/${oldUser.Uid}/${message[0]}`).set(message[1])
    })

    it('should send push notification when a second message arrives in a new chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(newUser.Uid, '8 - New message')
      messagesRef.child(`${oldUser.Uid}/${newUser.Uid}/${message[0]}`).set(message[1])
    })

    it('should send push notification when a second message arrives in an old chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(userToChat.Uid, '9 - New message')
      messagesRef.child(`${oldUser.Uid}/${userToChat.Uid}/${message[0]}`).set(message[1])
    })

    it('should not send push notification when the sending user is himself', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(oldUser.Uid, '10 - New message with no push')
      messagesRef.child(`${oldUser.Uid}/${userToChat.Uid}/${message[0]}`).set(message[1])
    })
  })
})
