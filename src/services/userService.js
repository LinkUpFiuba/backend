import Database from './gateway/database'
import Validator from 'jsonschema'
import userSchema from './schemas/userSchema'
import Promise from 'bluebird'

export default function UserService() {
  const FRIENDS = 'friends'
  const MALE = 'male'
  const FEMALE = 'female'

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

  const getSexualPosibleMatches = (ref, actualUser, search) => {
    return ref.orderByChild(`interests/${actualUser.gender}`).equalTo(true).once('value')
      .then(users => {
        const usersArray = []
        users.forEach(queryUser => {
          if (queryUser.key !== actualUser.Uid &&
              validateAges(queryUser.val(), actualUser) &&
              search.includes(queryUser.val().gender)) {
            const user = queryUser.val()
            user.id = queryUser.key
            usersArray.push(user)
          }
        })
        return usersArray
      })
  }

  const getFriendPosibleMatches = (ref, actualUser) => {
    return ref.orderByChild(`interests/${FRIENDS}`).equalTo(true).once('value')
      .then(users => {
        const usersArray = []
        users.forEach(queryUser => {
          const user = queryUser.val()
          if (queryUser.key !== actualUser.Uid && validateAges(queryUser.val(), actualUser)) {
            user.id = queryUser.key
            usersArray.push(user)
          }
        })
        return usersArray
      })
  }

  const validateAges = (user1, user2) => {
    return user2.range.minAge <= user1.age &&
      user1.range.minAge <= user2.age &&
      user2.range.maxAge >= user1.age &&
      user1.range.maxAge >= user2.age
  }

  function getSearchInterests(actualUser) {
    const search = []
    if (actualUser.val().interests.male) {
      search.push(MALE)
    }
    if (actualUser.val().interests.female) {
      search.push(FEMALE)
    }
    if (actualUser.val().interests.friends) {
      search.push(FRIENDS)
    }
    return search
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
    getPosibleLinks: actualUserUid => {
      const ref = Database('users')
      let actualUser
      let search
      // Busca usuario actual
      return ref.child(actualUserUid).once('value')
        .then(user => {
          actualUser = user.val()
          search = getSearchInterests(user)
        })
        .then(() => {
          if (!search.includes(FRIENDS)) {
            return getSexualPosibleMatches(ref, actualUser, search)
          }
          return getFriendPosibleMatches(ref, actualUser)
        })
    }
  }
}
