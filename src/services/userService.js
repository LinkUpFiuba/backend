import Database from './gateway/database'
import Validator from 'jsonschema'
import userSchema from './schemas/userSchema'
import Promise from 'bluebird'

export default function UserService() {
  const validateUser = user => {
    const correctness = {}
    const v = new Validator.Validator()
    const result = v.validate(user, userSchema)
    if (result.errors.length > 0) {
      correctness.result = false
      correctness.message = result.errors
      return correctness
    }
    correctness.result = true
    return correctness
  }

  return {
    createUser: user => {
      const usersRef = Database('users')
      const correctness = validateUser(user)
      if (!correctness.result) {
        return Promise.reject(correctness.message)
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
    getAllUsers: uid => {
      return Database('users').once('value').then(snap => {
        const usersArray = []
        snap.forEach(childSnap => {
          if (childSnap.key !== uid) {
            const user = childSnap.val()
            user.id = childSnap.key
            usersArray.push(user)
          }
        })
        return usersArray
      })
    }
  }
}
