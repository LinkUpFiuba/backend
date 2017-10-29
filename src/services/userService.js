import Database from './gateway/database'
import Validator from 'jsonschema'
import userSchema from './schemas/userSchema'
import Promise from 'bluebird'
import geolib from 'geolib'
import LinkService from './linkService'
import InterestsService from './interestsService'
import DisableUserService from './disableUserService'
import Administrator from './gateway/administrator'
import { MatchService } from './matchService'

// Available superlinks
export const PREMIUM_SUPERLINKS = 10
export const FREE_SUPERLINKS = 5

// Matching algorithm weights
export const DISTANCE_WEIGHT = 0.48
export const INTERESTS_WEIGHT = 0.32
export const LINK_UP_PLUS_WEIGHT = 0.1
export const LINK_SITUATION_WEIGHT = 0.1

export default function UserService() {
  const FRIENDS = 'friends'
  const MALE = 'male'
  const FEMALE = 'female'
  const USERS_PER_REQUEST = 5
  const A = 1406.25
  const B = 1
  const C = 12.5
  const D = -12.5

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

  const isBlocked = (blockingUser, blockedUser) => {
    const blocksRef = Database('blocks')
    return blocksRef.child(`${blockingUser.Uid}/${blockedUser.Uid}`).once('value')
      .then(block => {
        return block.exists()
      })
  }

  const validateBlocking = (user1, user2) => {
    return isBlocked(user1, user2).then(block1 => {
      return isBlocked(user2, user1).then(block2 => {
        return !block1 && !block2
      })
    })
  }

  const validateFilters = (posibleUserForLink, actualUser, links, unlinks) => {
    // Exclude the user who made the request and also by age, distance and if the user has invisible mode on,
    // or if they already linked or unlinked
    return validateBlocking(posibleUserForLink, actualUser).then(validateBlocking => {
      return DisableUserService().isUserDisabled(posibleUserForLink.Uid).then(isDisabled => {
        return posibleUserForLink.Uid !== actualUser.Uid &&
          validateAges(posibleUserForLink, actualUser) &&
          validateDistance(posibleUserForLink, actualUser) &&
          validateBlocking &&
          !isDisabled &&
          !posibleUserForLink.invisibleMode &&
          !unlinks.includes(posibleUserForLink.Uid) &&
          !links.includes(posibleUserForLink.Uid)
      })
    })
  }

  const calculateMatchingScore = (user, actualUser) => {
    return LinkService().getLinkTypeBetween(actualUser, user).then(linkSituationScore => {
      const commonInterests = InterestsService().getCommonInterests(user.likesList, actualUser.likesList)
      // We include common interests in the user in order to show it in the frontend
      user.commonInterests = commonInterests
      // The idea of the algorithm is to have a maximum of 100 and a minimum of 0. The distance behaves like
      // a 1/x function, so that less distance goes with a better score. All the constants are given to have
      // an smoother function with the corresponding max and min. On the other hand, we care about the
      // interests as a linear function, with a max of 10 interests in common. In addition, we prioritize
      // candidates that have LinkUp Plus. Finally, we also give some prioritization when there's a superlink,
      // a link or an unlink (or even if they haven't link at all). After that, we weight the scores with a
      // defined value.
      // See more in: https://docs.google.com/document/d/1N0W029of2x8JeM8JIxyO0bAZbtZqgAAB5I9FQVF01v8
      const distanceScore = (A / ((user.distance / B) + C)) + D
      const interestsScore = Math.min(commonInterests.length * 10, 100)
      const linkUpPlusScore = +user.linkUpPlus * 100 // The + is to convert bool to 0 or 1
      return DISTANCE_WEIGHT * distanceScore +
             INTERESTS_WEIGHT * interestsScore +
             LINK_UP_PLUS_WEIGHT * linkUpPlusScore +
             LINK_SITUATION_WEIGHT * linkSituationScore
    })
  }

  const addMatchingScoreTo = (users, actualUser) => {
    const usersArray = []
    const promisesArray = []
    users.forEach(user => {
      promisesArray.push(
        calculateMatchingScore(user, actualUser).then(matchingScore => {
          user.matchingScore = matchingScore
          usersArray.push(user)
        })
      )
    })
    return Promise.all(promisesArray).then(() => usersArray)
  }

  const orderByMatchingAlgorithm = (users, actualUser) => {
    return addMatchingScoreTo(users, actualUser).then(usersWithMatchingScore => {
      // Descending order
      usersWithMatchingScore.sort((user1, user2) => user2.matchingScore - user1.matchingScore)
      return usersWithMatchingScore
    })
  }

  const getSexualPosibleMatches = (ref, actualUser, search) => {
    return ref.orderByChild(`interests/${actualUser.gender}`).equalTo(true).once('value')
      .then(users => {
        return LinkService().getLinks(actualUser).then(links => {
          return LinkService().getUnlinks(actualUser).then(unlinks => {
            const usersArray = []
            const promisesArray = []
            users.forEach(queryUser => {
              const user = queryUser.val()
              promisesArray.push(
                validateFilters(user, actualUser, links, unlinks).then(validateFilters => {
                  if (validateFilters && search.includes(user.gender)) {
                    usersArray.push(user)
                  }
                })
              )
            })
            return Promise.all(promisesArray).then(() => usersArray)
          })
        })
      })
  }

  const getFriendPosibleMatches = (ref, actualUser) => {
    return ref.orderByChild(`interests/${FRIENDS}`).equalTo(true).once('value')
      .then(users => {
        return LinkService().getLinks(actualUser).then(links => {
          return LinkService().getUnlinks(actualUser).then(unlinks => {
            const usersArray = []
            const promisesArray = []
            users.forEach(queryUser => {
              const user = queryUser.val()
              promisesArray.push(
                validateFilters(user, actualUser, links, unlinks).then(validateFilters => {
                  if (validateFilters) {
                    usersArray.push(user)
                  }
                })
              )
            })
            return Promise.all(promisesArray).then(() => usersArray)
          })
        })
      })
  }

  function getSearchInterests(actualUser) {
    const search = []
    if (actualUser.interests.male) {
      search.push(MALE)
    }
    if (actualUser.interests.female) {
      search.push(FEMALE)
    }
    if (actualUser.interests.friends) {
      search.push(FRIENDS)
    }
    return search
  }

  const translateCondition = isDisabled => {
    return isDisabled ? 'Disabled' : 'Active'
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
    getUser: uid => {
      const usersRef = Database('users')
      return usersRef.child(uid).once('value').then(user => {
        return DisableUserService().isUserDisabled(uid).then(isDisabled => {
          return {
            ...user.val(),
            condition: translateCondition(isDisabled)
          }
        })
      })
    },
    hasLinkUpPlus: uid => {
      const usersRef = Database('users')
      return usersRef.child(uid).once('value').then(user => {
        return user.val().linkUpPlus
      })
    },
    getPosibleLinks: actualUserUid => {
      const ref = Database('users')
      let actualUser
      let userSearch
      // Busca usuario actual
      return ref.child(actualUserUid).once('value')
        .then(user => {
          actualUser = user.val()
          return getSearchInterests(actualUser)
        })
        .then(search => {
          userSearch = search
          if (!search.includes(FRIENDS)) {
            return getSexualPosibleMatches(ref, actualUser, search)
          }
          return getFriendPosibleMatches(ref, actualUser)
        })
        .then(users => {
          if (users.length > 0) {
            return users
          }
          LinkService().deleteUnlinks(actualUserUid)
          if (!userSearch.includes(FRIENDS)) {
            return getSexualPosibleMatches(ref, actualUser, userSearch)
          }
          return getFriendPosibleMatches(ref, actualUser)
        })
        .then(users => {
          return orderByMatchingAlgorithm(users, actualUser)
        })
        .then(orderedUsers => {
          return orderedUsers.slice(0, USERS_PER_REQUEST)
        })
    },
    updateAvailableSuperlinks: () => {
      console.log('Updating available superlinks')
      const usersRef = Database('users')
      return usersRef.once('value').then(users => {
        users.forEach(user => {
          const superlinks = user.val().linkUpPlus ? PREMIUM_SUPERLINKS : FREE_SUPERLINKS
          usersRef.child(`${user.key}/availableSuperlinks`).set(superlinks)
        })
      })
    },
    deleteUser: uid => {
      // Delete his session
      return Administrator().auth().deleteUser(uid)
        .then(() => {
          // Set as disabled user both in Firebase and the app
          return DisableUserService().disableUser(uid)
        })
        .then(() => {
          // Delete unlinks (Although it's not necessary, it's for keeping the DB clean)
          return LinkService().deleteUnlinks(uid)
        })
        .then(() => {
          // Delete links from and with that user
          return LinkService().deleteLinks(uid)
        })
        .then(() => {
          // Delete matches and add 'block' for the other user
          return MatchService().deleteMatches(uid)
        })
    }
  }
}
