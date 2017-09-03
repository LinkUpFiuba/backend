import Database from '../database'

export default function UserService() {
  return {
    create: username => {
      const usersRef = Database('users')

      usersRef.push({
        name: username,
        age: 23
      })
    },
    get: username => {
      const usersRef = Database('users')

      return usersRef.orderByChild('name').equalTo(username).once('value')
    }
  }
}
