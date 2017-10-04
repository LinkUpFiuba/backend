import Database from './gateway/database'
// import { PushNotificationService } from './pushNotificationService'

export const ChatService = () => {
  const sendPush = (user1, user2, message) => {
    if (message.userId !== user1) {
      console.log(`\t\tSending new message "${message.message}" push notification to ${user1} from ${user2}`)
      // PushNotificationService().sendNewMessagePush(user1, user2, messageInfo)
    }
  }

  // This method is called when the server starts, in order to set all listeners. There are 3 possibilities:
  //   1 - The user has never chatted before (It's his first chat)
  //   2 - The user has another chats, but with another users
  //   3 - The user has already a chat with that user
  const onNewFirstMessage = messagesRef => {
    let newMessages = false
    // Set the listener on first chat of a user (1)
    messagesRef.on('child_added', newMessage => {
      console.log('A new message has been added!')
      const user1 = newMessage.key
      console.log(`User1: ${user1}`)
      let user2 = ''
      // TODO: Set the listener on first with that user, having others before (2)
      newMessage.forEach(child => {
        user2 = child.key
        console.log(`\tUser2: ${user2}`)

        // Set the listener on already existing chat (3)
        const ref = Database('messages')
        const childRef = ref.child(`${user1}/${user2}`)
        childRef.on('child_added', realMessage => {
          const message = realMessage.val()
          if (realMessage.key !== 'blocked') {
            // Este console se puede mover adentro del if
            console.log(`\t\tNew message "${message.message}" from ${message.userId} to ${message.userId !== user1 ? user1 : user2}`)
            if (newMessages) {
              sendPush(user1, user2, message)
            }
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
      onNewFirstMessage(messagesRef)
    }
  }
}
