import Database from './gateway/database'
// import { PushNotificationService } from './pushNotificationService'

export const ChatService = () => {
  const onNewMessage = messagesRef => {
    messagesRef.on('child_changed', newMessage => {
      console.log('A new message has been added!')
      const user1 = newMessage.key
      console.log(`User1: ${user1}`)
    })
  }

  const onNewFirstMessage = messagesRef => {
    let newMessages = false
    messagesRef.on('child_added', newMessage => {
      if (!newMessages) return
      console.log('A new message has been added!')
      const user1 = newMessage.key
      console.log(`User1: ${user1}`)
      let user2 = ''
      let messageInfo = { message: undefined }
      // Although we know there should be only one user here, we must do a forEach
      newMessage.forEach(child => {
        user2 = child.key
        console.log(`\tUser2: ${user2}`)
        // Although we know there should be only one message here, we must do a forEach
        child.forEach(message => {
          messageInfo = message.val()
          console.log(`\t\tMessage info: ${JSON.stringify(messageInfo, null, 4)}`)
        })
      })
      if (messageInfo.userId !== user1) {
        console.log(`Sending new message push notification to ${user1}`)
        // PushNotificationService().sendNewMessagePush(user1, user2, messageInfo)
      }
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
      onNewFirstMessage(messagesRef)
    }
  }
}
