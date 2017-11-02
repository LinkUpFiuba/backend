import Database from './gateway/database'
import AuthService from './authService'
import { PushNotificationService } from './pushNotificationService'

export default function DisableUserService() {
  const isUserDisabled = (userUid, type = undefined) => {
    const ref = Database('disabledUsers')
    return ref.child(userUid).once('value').then(user => {
      return user.exists() && (!type || user.val() === type)
    })
  }

  const disableUser = (userUid, type) => {
    return Database('users').child(userUid).once('value').then(user => {
      if (!user.exists()) {
        return Promise.reject(new Error('That userUid does not exist'))
      }
      return AuthService().disableUser(userUid).then(() => {
        return Database('disabledUsers').child(userUid).set(type)
      })
    })
  }

  return {
    isUserDisabled: isUserDisabled,

    isUserBlocked: userUid => {
      return isUserDisabled(userUid, 'blocked')
    },

    disableDeletedUser: userUid => {
      return disableUser(userUid, 'deleted')
    },

    blockUser: userUid => {
      return disableUser(userUid, 'blocked').then(() => {
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
