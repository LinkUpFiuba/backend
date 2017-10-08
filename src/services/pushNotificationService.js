import Database from './gateway/database'
import { Messaging } from './gateway/messaging'

export const PushNotificationService = () => {
  const getUser = user => {
    const usersRef = Database('users')
    return usersRef.child(`${user}`).once('value').then(user => {
      return user.val()
    })
  }

  const sendMatchPush = (user1, user2) => {
    const payload = {
      notification: {
        title: 'Nuevo link!',
        body: `${user2.name} también quiere linkear con vos! Sé el primero en iniciar la conversación! 😉`
      },
      data: {
        Uid: user2.Uid,
        name: user2.name,
        photo: user2.photoUrl,
        type: 'match'
      }
    }
    return Messaging().sendToDevice(user1.tokenFCM, payload)
  }

  const sendNewMessagePush = (user1, user2, message) => {
    const payload = {
      notification: {
        title: user2.name,
        body: message.message
        // clickAction: 'com.google.firebase.MESSAGING_EVENT'
      },
      data: {
        type: 'message'
      }
    }
    return Messaging().sendToDevice(user1.tokenFCM, payload)
  }

  const sendDisableUserPush = user => {
    const payload = {
      notification: {
        title: 'Has sido bloqueado!',
        body: 'El administrador ha decidido bloquearte debido a las denuncias que ha recibido sobre ti.'
      },
      data: {
        type: 'disable'
      }
    }
    return Messaging().sendToDevice(user.tokenFCM, payload)
  }

  const onError = (user, error) => {
    console.log(`Error sending push notification to user ${user.Uid}: ${error}`)
    return error
  }

  const onSuccess = (user, response) => {
    console.log(`Successfully sent push notification to user ${user.Uid}`)
    return response
  }

  return {
    sendMatchPush: (user1, user2) => {
      let firstUser
      return getUser(user1).then(user => {
        firstUser = user
        return getUser(user2).then(secondUser => {
          // Here we send the match push notification personalized for each user
          return sendMatchPush(firstUser, secondUser)
            .then(response => {
              onSuccess(firstUser, response)
              return sendMatchPush(secondUser, firstUser)
                .then(response => {
                  return onSuccess(secondUser, response)
                })
                .catch(error => {
                  return onError(secondUser, error)
                })
            })
            .catch(error => {
              return onError(firstUser, error)
            })
        })
      })
    },

    sendDisablePush: userId => {
      return getUser(userId).then(user => {
        return sendDisableUserPush(user)
          .then(response => {
            return onSuccess(user, response)
          })
          .catch(error => {
            return onError(user, error)
          })
      })
    },

    sendNewMessagePush: (user1, user2, message) => {
      let firstUser
      return getUser(user1).then(user => {
        firstUser = user
        return getUser(user2).then(secondUser => {
          // Here we send the new message push notification to the user who didn't send the message
          return sendNewMessagePush(firstUser, secondUser, message)
            .then(response => {
              return onSuccess(firstUser, response)
            })
            .catch(error => {
              return onError(firstUser, error)
            })
        })
      })
    }
  }
}
