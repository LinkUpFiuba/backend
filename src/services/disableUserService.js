import Database from './gateway/database'

export default function DisableUserService() {
  const isUserDisabled = userUid => {
    const ref = Database('disabledUsers')
    return ref.child(userUid).once('value').then(user => {
      return user.exists()
    })
  }

  return {
    isUserDisabled: isUserDisabled,

    blockUser: userUid => {
      return Database('disabledUsers').child(userUid).set(true)
    },

    unblockUser: userUid => {
      return isUserDisabled(userUid).then(exists => {
        if (!exists) {
          return Promise.reject(new Error('That userUid is not disabled'))
        }
        return Database('disabledUsers').child(userUid).remove()
      })
    }
  }
}
