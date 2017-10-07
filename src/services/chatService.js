import Database from './gateway/database'
// import { PushNotificationService } from './pushNotificationService'

export const ChatService = () => {
  const sendPush = (user1, user2, message) => {
    if (message.userId !== user1) {
      console.log(`\t\tSending new message "${message.message}" push notification to ${user1} from ${user2}`)
      console.log("PUSH!\n\n")
      // PushNotificationService().sendNewMessagePush(user1, user2, message)
    }
  }

  // This method is called when the server starts, in order to set all listeners. There are 3 possibilities:
  //   1 - The user has never chatted before (It's his first chat)
  //   2 - The user has another chats, but with another users
  //   3 - The user has already a chat with that user
  const onNewFirstMessage = messagesRef => {
    let newMessages = false
    // Set the listener on first chat of a user (1)
    messagesRef.on('child_added', chat => {
      const user1 = chat.key
      console.log(`1 - A user (${user1}) that had never chated before has a new chat!`)

      // Set the listener on first chat with that user, having others before (2)
      messagesRef.child(user1).on('child_added', asd => {
        const user2 = asd.key
        console.log(`\t2 - A user (${user1}) that had already chated (with other users) has a new chat with ${user2}!`)

        const childRef = messagesRef.child(`${user1}/${user2}`)
        childRef.on('child_added', message => {
          // if (messages.numChildren() === 1) {
          // Although we know there's only one child, we must do a for each as we don't know the keys
          // messages.forEach(message => {
            const realMessage = message.val()
            if (message.key !== 'blocked') {
              console.log(`\t\t2 - New message "${realMessage.message}" on new chat from ${realMessage.userId} to ${realMessage.userId !== user1 ? user1 : user2}`)
              if (newMessages) sendPush(user1, user2, realMessage)
            }
          // })
          // }
        })
      })

      // Esto no se debería hacer sólo cuando arranca?
      // if (!newMessages) {
      //   chat.forEach(message => {
      //     const user2 = message.key
      //     const childRef = messagesRef.child(`${user1}/${user2}`)
      //
      //     // Set the listener on already existing chat (3)
      //     childRef.on('child_added', realMessage => {
      //       const message = realMessage.val()
      //       if (realMessage.key !== 'blocked') {
      //         // Este console se puede mover adentro del if
      //         console.log(`\t\t3 - A new message has arrive from two users (${user1} and ${user2}) that were chating: "${message.message}" from ${message.userId} to ${message.userId !== user1 ? user1 : user2}`)
      //         // Acá no se deberían mandar pushes
      //         if (newMessages) sendPush(user1, user2, message)
      //       }
      //     })
      //   })
      // }
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
