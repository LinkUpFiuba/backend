import Database from './gateway/database'
import { Messaging } from './gateway/messaging'

export const PushNotificationService = () => {
  const getTokenFCM = user => {
    const usersRef = Database('users')
    return usersRef.child(`${user}/tokenFCM`).once('value').then(token => {
      return token.val()
    })
  }

  return {
    sendMatchPush: (user1, user2) => {
      const payload = {
        notification: {
          title: 'Nuevo match!',
          body: 'Esta es una push notification creada desde el servidor'
        }
      }
      let token1
      let token2
      return getTokenFCM(user1).then(token => {
        token1 = token
        return getTokenFCM(user2)
      }).then(token => {
        token2 = token
        const tokens = [token1, token2]
        return Messaging().sendToDevice(tokens, payload)
          .then(response => {
            console.log('Successfully sent message:', response)
          })
          .catch(error => {
            console.log('Error sending message:', error)
          })
      })
    }
  }
}
