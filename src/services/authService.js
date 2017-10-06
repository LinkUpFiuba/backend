import Administrator from './gateway/administrator'

export default function DisableUserService() {
  const TEST_URL = process.env.MOCKFIREBASE_DB_URL

  return {
    disableUser: userUid => {
      if (!TEST_URL) {
        return Administrator().auth().updateUser(userUid, { disabled: true })
      }
      return new Promise(resolve => resolve())
    },
    enableUser: userUid => {
      if (!TEST_URL) {
        return Administrator().auth().updateUser(userUid, { disabled: false })
      }
      return new Promise(resolve => resolve())
    }
  }
}
