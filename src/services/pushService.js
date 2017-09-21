// import Database from './gateway/database'
import { Messaging } from './gateway/messaging'

export const PushNotificationService = () => {
  return {
    sendMatchPush: () => {
      const payload = {
        notification: {
          title: 'Nuevo match!',
          body: 'Esta es una push notification creada desde el servidor',
          icon: 'myicon'
        }
      }
      const registrationToken = 'cNgfu6nRls0:APA91bGaNy7PJ8xfYPQCUvvEOtSelBzTb6cpx9JvX0woGsm19-pwUC5jrMtCsIwjYOM-sMhDaRI_bNHVUCEP2Svyp0u3eLJ9POz-PZJymh7JKHIgZjYdilo2SB1XfiFAbxKCXjg92Uic'
      Messaging().sendToDevice(registrationToken, payload)
        .then(response => {
          console.log('Successfully sent message:', response)
        })
        .catch(error => {
          console.log('Error sending message:', error)
        })
    }
  }
}
