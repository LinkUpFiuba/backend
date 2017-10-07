import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before } from 'mocha'
import { ChatService } from '../../src/services/chatService'
import Database from '../../src/services/gateway/database'
import { User } from './usersFactory'

chai.use(chaiAsPromised)

describe('ChatService', () => {
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
          [user2.Uid]: newMessage(user2.Uid, 'Starting message')
        }
      }
      messagesRef.set(messages)

      ChatService().detectNewMessages()
    })

    it('should send push notification when a new user starts chating', () => {
      console.log('-------------------------------------------------------------------------------')
      messagesRef.child(`${user3.Uid}/${user1.Uid}`).set(newMessage(user1.Uid, '1 - New user'))

      // messagesRef.once('value').then(messages => console.log(JSON.stringify(messages, null, 2)))
    })

    it('should send push notification when a new chat starts in a new user', () => {
      console.log('-------------------------------------------------------------------------------')
      messagesRef.child(`${user3.Uid}/${user2.Uid}`).set(newMessage(user2.Uid, '2 - New chat'))

      // messagesRef.once('value').then(messages => console.log(JSON.stringify(messages, null, 2)))
    })

    it('should send push notification when a new chat starts in an old user', () => {
      console.log('-------------------------------------------------------------------------------')
      messagesRef.child(`${user1.Uid}/${user3.Uid}`).set(newMessage(user3.Uid, '3 - New chat'))

      // messagesRef.once('value').then(messages => console.log(JSON.stringify(messages, null, 2)))
    })

    it('should send push notification when a new message arrives for a new user', () => {
      console.log('-------------------------------------------------------------------------------')
      let message = newMessage(user2.Uid, '4 - New message')
      let key = Object.keys(message)[0]
      messagesRef.child(`${user3.Uid}/${user2.Uid}/${key}`).set(message[key])

      message = newMessage(user1.Uid, '4 - New message (2)')
      key = Object.keys(message)[0]
      messagesRef.child(`${user3.Uid}/${user1.Uid}/${key}`).set(message[key])

      // messagesRef.once('value').then(messages => console.log(JSON.stringify(messages, null, 2)))
    })

    it('should send push notification when a new message arrives in a new chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(user3.Uid, '5 - New message')
      const key = Object.keys(message)[0]
      messagesRef.child(`${user1.Uid}/${user3.Uid}/${key}`).set(message[key])

      // messagesRef.once('value').then(messages => console.log(JSON.stringify(messages, null, 2)))
    })

    it('should send push notification when a new message arrives in an old chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(user3.Uid, '6 - New message')
      const key = Object.keys(message)[0]
      messagesRef.child(`${user1.Uid}/${user2.Uid}/${key}`).set(message[key])

      // messagesRef.once('value').then(messages => console.log(JSON.stringify(messages, null, 2)))
    })

    it('should send push notification when a second message arrives for a new user', () => {
      console.log('-------------------------------------------------------------------------------')
      let message = newMessage(user2.Uid, '7 - New message')
      let key = Object.keys(message)[0]
      messagesRef.child(`${user3.Uid}/${user2.Uid}/${key}`).set(message[key])

      message = newMessage(user1.Uid, '7 - New message (2)')
      key = Object.keys(message)[0]
      messagesRef.child(`${user3.Uid}/${user1.Uid}/${key}`).set(message[key])

      // messagesRef.once('value').then(messages => console.log(JSON.stringify(messages, null, 2)))
    })

    it('should send push notification when a second message arrives in a new chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(user3.Uid, '8 - New message')
      const key = Object.keys(message)[0]
      messagesRef.child(`${user1.Uid}/${user3.Uid}/${key}`).set(message[key])

      // messagesRef.once('value').then(messages => console.log(JSON.stringify(messages, null, 2)))
    })

    it('should send push notification when a second message arrives in an old chat of old user', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(user3.Uid, '9 - New message')
      const key = Object.keys(message)[0]
      messagesRef.child(`${user1.Uid}/${user2.Uid}/${key}`).set(message[key])

      // messagesRef.once('value').then(messages => console.log(JSON.stringify(messages, null, 2)))
    })

    it('should not send push notification when the sending user is himself', () => {
      console.log('-------------------------------------------------------------------------------')
      const message = newMessage(user1.Uid, '10 - New message with no push')
      const key = Object.keys(message)[0]
      messagesRef.child(`${user1.Uid}/${user2.Uid}/${key}`).set(message[key])
    })
  })
})

let uniqueId = 0
function newMessage(sendingUser, message) {
  uniqueId += 1
  return {
    [uniqueId.toString()]: {
      liked: false,
      read: false,
      message,
      userId: sendingUser
    }
  }
}
