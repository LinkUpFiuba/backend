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
  const A = 1406.25
  const B = 1
  const C = 12.5
  const D = -12.5
  const DISTANCE_WEIGHT = 0.6
  const INTERESTS_WEIGHT = 0.6

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

  const validateDistance = (user1, user2) => {
    const distance = geolib.getDistance(user1.location, user2.location) / 1000
    // We include the distance in the user in order to show it in the frontend
    user1.distance = distance
    return distance <= user1.maxDistance && distance <= user2.maxDistance
  }

  const validateAges = (user1, user2) => {
    return user2.range.minAge <= user1.age &&
      user1.range.minAge <= user2.age &&
      user2.range.maxAge >= user1.age &&
      user1.range.maxAge >= user2.age
  }

  const validateExclusion = (user, actualUser) => (
    // Exclude the user who made the request and also by age, distance and if the user has invisible mode on
    user.Uid !== actualUser.Uid &&
      validateAges(user, actualUser) &&
      validateDistance(user, actualUser) &&
      !user.invisibleMode
  )

  const getCommonInterests = (user, actualUser) => {
    // Esta boludez es simplemente para que no se queje el linter de que no los uso
    return (user === actualUser) ? [] : []
  }

  const calculateMatchingScore = (user, actualUser) => {
    // Here we should use @fede's service to find commonInterests
    const commonInterests = getCommonInterests(user, actualUser).length
    // We include the amount of common interests in the user in order to show it in the frontend
    user.commonInterests = commonInterests
    const distanceScore = (A / ((user.distance / B) + C)) + D
    const interestsScore = Math.min(commonInterests * 10, 100)
    return DISTANCE_WEIGHT * distanceScore + INTERESTS_WEIGHT * interestsScore
  }

  const orderByMatchingAlgorithm = (users, actualUser) => {
    users.map(user => {
      user.matchingScore = calculateMatchingScore(user, actualUser)
    })
    // Descending order
    users.sort((user1, user2) => user2.matchingScore - user1.matchingScore)
    return users
  }

  const getSexualPosibleMatches = (ref, actualUser, search) => {
    return ref.orderByChild(`interests/${actualUser.gender}`).equalTo(true).once('value')
      .then(users => {
        const usersArray = []
        users.forEach(queryUser => {
          const user = queryUser.val()
          if (validateExclusion(user, actualUser) && search.includes(user.gender)) {
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
          if (validateExclusion(user, actualUser)) {
            usersArray.push(user)
          }
        })
        return usersArray
      })
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
          const orderedUsers = orderByMatchingAlgorithm(users, actualUser)
          return orderedUsers.slice(0, USERS_PER_REQUEST - 1)
        })
    }
  }
}
