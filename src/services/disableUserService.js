import Database from './gateway/database'
import AuthService from './authService'
import { PushNotificationService } from './pushNotificationService'

export default function DisableUserService() {
  const isUserDisabled = userUid => {
    const ref = Database('disabledUsers')
    return ref.child(userUid).once('value').then(user => {
      return user.exists()
    })
  }

  const disableUser = userUid => {
    return Database('users').child(userUid).once('value').then(user => {
      if (!user.exists()) {
        return Promise.reject(new Error('That userUid does not exist'))
      }
      return AuthService().disableUser(userUid).then(() => {
        return Database('disabledUsers').child(userUid).set(true)
      })
    })
  }

  return {
    isUserDisabled: isUserDisabled,

    disableUser: disableUser,

    blockUser: userUid => {
      return disableUser(userUid).then(() => {
        return PushNotificationService().sendDisablePush(userUid)
      })
    },

    unblockUser: userUid => {
      return isUserDisabled(userUid).then(exists => {
        if (!exists) {
          return Promise.reject(new Error('That userUid is not disabled'))
        }
        return AuthService().enableUser(userUid)
          .then(() => {
            return Database('disabledUsers').child(userUid).remove()
          })
      })
    }
  }
}
