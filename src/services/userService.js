import Database from './gateway/database'
import Validator from 'jsonschema'
import userSchema from './schemas/userSchema'
import Promise from 'bluebird'
import geolib from 'geolib'

export default function UserService() {
  const FRIENDS = 'friends'
  const MALE = 'male'
  const FEMALE = 'female'
  const USERS_PER_REQUEST = 5

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
          const user = queryUser.val()
          if (user.Uid !== actualUser.Uid &&
              validateAges(user, actualUser) &&
              validateDistance(user, actualUser) &&
              !user.invisibleMode &&
              search.includes(user.gender)) {
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
          if (user.Uid !== actualUser.Uid &&
              !user.invisibleMode &&
              validateDistance(user, actualUser) &&
              validateAges(user, actualUser)) {
            usersArray.push(user)
          }
        })
        return usersArray
      })
  }

  const validateDistance = (user1, user2) => {
    const distance = geolib.getDistance(user1.location, user2.location) / 1000
    return distance <= user1.maxDistance && distance <= user2.maxDistance
  }

  const validateAges = (user1, user2) => {
    return user2.range.minAge <= user1.age &&
      user1.range.minAge <= user2.age &&
      user2.range.maxAge >= user1.age &&
      user1.range.maxAge >= user2.age
  }

  const getSearchInterests = actualUser => {
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

  const orderByMatchingAlgorithm = users => {
    return users
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
      // Busca usuario actual
      return ref.child(actualUserUid).once('value')
        .then(user => {
          actualUser = user.val()
          return getSearchInterests(user)
        })
        .then(search => {
          if (!search.includes(FRIENDS)) {
            return getSexualPosibleMatches(ref, actualUser, search)
          }
          return getFriendPosibleMatches(ref, actualUser)
        })
        .then(users => {
          const orderedUsers = orderByMatchingAlgorithm(users)
          return orderedUsers.slice(0, USERS_PER_REQUEST - 1)
        })
    }
  }
}
