import Database from './gateway/database'
import { PushNotificationService } from './pushNotificationService'

export const ChatService = () => {
  const sendPush = (user1, user2, message) => {
    if (message.userId !== user1) {
      console.log(`\t\tSending new message "${message.message}" push notification to ${user1} from ${user2}`)
      PushNotificationService().sendNewMessagePush(user1, user2, message)
    }
  }

  // This method is called when the server starts, in order to set all listeners. When it's starting, it
  // should not send push notifications. There are 3 possibilities:
  //   1 - The user has never chatted before (It's his first chat)
  //   2 - The user has another chats, but with another users
  //   3 - The user has already a chat with that user
  const onNewMessage = messagesRef => {
    let newMessages = false
    // Set the listener on first chat of a user (1)
    messagesRef.on('child_added', newChatingUser => {
      const user1 = newChatingUser.key
      console.log(`1 - ${user1} has started chating!`)

      // Set the listener on new chats for user1 (2)
      messagesRef.child(user1).on('child_added', newChat => {
        const user2 = newChat.key
        console.log(`\t2 - ${user1} has a new chat with ${user2}!`)

        const childRef = messagesRef.child(`${user1}/${user2}`)
        // Set the listener on new messages between user1 and user2 (3)
        childRef.on('child_added', newMessage => {
          const message = newMessage.val()
          if (newMessage.key !== 'blocked') {
            console.log(`\t\t3 - New message "${message.message}" from ${message.userId} to ${message.userId !== user1 ? user1 : user2}`)
            if (newMessages) sendPush(user1, user2, message)
          }
        })
      })
    })

    // This is in order not to trigger events when the server starts
    // See: https://stackoverflow.com/questions/18270995/how-to-retrieve-only-new-data
    messagesRef.once('value', () => {
      newMessages = true
    })
  }

  return {
    detectNewMessages: () => {
      console.log('Starting to detect new chat messages')
      const messagesRef = Database('messages')
      onNewMessage(messagesRef)
    }
  }
}
