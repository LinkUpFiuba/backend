import Database from './gateway/database'
import Validator from 'jsonschema'
import userSchema from './schemas/userSchema'
import Promise from 'bluebird'

export default function UserService() {
  const validateUser = user => {
    if (user === undefined) {
      return 'Invalid Schema'
    }
    const v = new Validator.Validator()
    const result = v.validate(user, userSchema)
    if (result.errors.length > 0) {
      return result.errors
    }
    return true
  }

  return {
    createUser: user => {
      const usersRef = Database('users')
      const result = validateUser(user)
      if (result !== true) {
        return Promise.reject(result)
      }
      return usersRef.push({
        name: user.name,
        age: user.age
      })
    },
    getUser: id => {
      const usersRef = Database('users')
      return usersRef.orderByKey().equalTo(id).once('value', snap => {
        snap.forEach(childSnap => childSnap.val().name)
      })
    },
    getAllUsers: () => {
      return Database('users').once('value').then(snap => {
        const usersArray = []
        snap.forEach(childSnap => {
          const user = childSnap.val()
          user.id = childSnap.key
          usersArray.push(user)
        })
        return usersArray
      })
    }
  }
}
