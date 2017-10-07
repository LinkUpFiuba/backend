import { describe, it, before } from 'mocha'
import { ChatService } from '../../src/services/chatService'
import Database from '../../src/services/gateway/database'
import { User } from './usersFactory'

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
    const user1 = new User().male().get()
    const user2 = new User().female().get()
    const user3 = new User().female().get()
    const messagesRef = Database('messages')

    before(() => {
      const users = {
        [user1.Uid]: user1,
        [user2.Uid]: user2,
        [user3.Uid]: user3
      }
      Database('users').set(users)

      const messages = {
        [user1.Uid]: {
          [user2.Uid]: newMessageWithUniqueId(user2.Uid, 'Starting message')
        }
      }
      messagesRef.set(messages)

      ChatService().detectNewMessages()
    })

    it('should send push notification when a new user starts chating', () => {
      console.log('-------------------------------------------------------------------------------')
      messagesRef.child(`${user3.Uid}/${user1.Uid}`).set(newMessageWithUniqueId(user1.Uid, '1 - New user'))
    })

    it('should send push notification when a new chat starts in a new user', () => {
      console.log('-------------------------------------------------------------------------------')
      messagesRef.child(`${user3.Uid}/${user2.Uid}`).set(newMessageWithUniqueId(user2.Uid, '2 - New chat'))
    })

    it('should send push notification when a new chat starts in an old user', () => {
      console.log('-------------------------------------------------------------------------------')
      messagesRef.child(`${user1.Uid}/${user3.Uid}`).set(newMessageWithUniqueId(user3.Uid, '3 - New chat'))
    })

    it('should send push notification when a new message arrives for a new user', () => {
      console.log('-------------------------------------------------------------------------------')
      let message = newMessage(user2.Uid, '4 - New message')
      messagesRef.child(`${user3.Uid}/${user2.Uid}/${message[0]}`).set(message[1])

      message = newMessage(user1.Uid, '4 - New message (2)')
      messagesRef.child(`${user3.Uid}/${user1.Uid}/${message[0]}`).set(message[1])
    })

    it('should send push notification when a new message arrives in a new chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(user3.Uid, '5 - New message')
      messagesRef.child(`${user1.Uid}/${user3.Uid}/${message[0]}`).set(message[1])
    })

    it('should send push notification when a new message arrives in an old chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(user2.Uid, '6 - New message')
      messagesRef.child(`${user1.Uid}/${user2.Uid}/${message[0]}`).set(message[1])
    })

    it('should send push notification when a second message arrives for a new user', () => {
      console.log('-------------------------------------------------------------------------------')
      let message = newMessage(user2.Uid, '7 - New message')
      messagesRef.child(`${user3.Uid}/${user2.Uid}/${message[0]}`).set(message[1])

      message = newMessage(user1.Uid, '7 - New message (2)')
      messagesRef.child(`${user3.Uid}/${user1.Uid}/${message[0]}`).set(message[1])
    })

    it('should send push notification when a second message arrives in a new chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(user3.Uid, '8 - New message')
      messagesRef.child(`${user1.Uid}/${user3.Uid}/${message[0]}`).set(message[1])
    })

    it('should send push notification when a second message arrives in an old chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(user2.Uid, '9 - New message')
      messagesRef.child(`${user1.Uid}/${user2.Uid}/${message[0]}`).set(message[1])
    })

    it('should not send push notification when the sending user is himself', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(user1.Uid, '10 - New message with no push')
      messagesRef.child(`${user1.Uid}/${user2.Uid}/${message[0]}`).set(message[1])
    })
  })
})
