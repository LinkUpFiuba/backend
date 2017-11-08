import Database from './gateway/database'
import { PushNotificationService } from './pushNotificationService'

export const MatchService = () => {
  const getUser = user => {
    const usersRef = Database('users')
    return usersRef.child(`${user}`).once('value').then(user => {
      return user.val()
    })
  }

  const heterosexualCouple = (user1, user2) => {
    const isHeterosexual = user1.gender !== user2.gender
    // If user1 is a female, we use her interests (and user2 if user1 is not a female. If there's no female
    // user or both are female, isHeterosexual will be false so we don't care about which we used for
    // checking in areCouple
    const femaleUser = user1.gender === 'female' ? user1 : user2
    // Use the female interests to determine whether it's a link between friends or not.
    const areCouple = !femaleUser.interests.friends
    return isHeterosexual && areCouple
  }

  const canStartChat = (user, isHeterosexualCouple) => {
    return (!isHeterosexualCouple || user.gender !== 'male')
  }

  return {
    createMatch: (linkingUser, linkedUser) => {
      return getUser(linkingUser).then(user1 => {
        return getUser(linkedUser).then(user2 => {
          const isHeterosexualCouple = heterosexualCouple(user1, user2)
          const matchesRef = Database('matches')
          const matchesToCreate = {}
          matchesToCreate[`${linkingUser}/${linkedUser}/read`] = false
          matchesToCreate[`${linkingUser}/${linkedUser}/startable`] = canStartChat(user1, isHeterosexualCouple)
          matchesToCreate[`${linkedUser}/${linkingUser}/read`] = false
          matchesToCreate[`${linkedUser}/${linkingUser}/startable`] = canStartChat(user2, isHeterosexualCouple)
          return matchesRef.update(matchesToCreate).then(() => {
            console.log('\tMatch successfully created!')
            return PushNotificationService().sendMatchPush(linkingUser, linkedUser)
          }).catch(() => {
            console.log('\tMatch could not be created :(')
          })
        })
      })
    },

    deleteMatches: uid => {
      const matchesRef = Database('matches')
      return matchesRef.child(uid).once('value').then(matches => {
        // Delete links with that user
        return matches.forEach(match => {
          const matchedUser = match.key
          matchesRef.child(`${matchedUser}/${uid}/block`).set({
            by: uid,
            read: false,
            type: 'DELETE'
          })
        })
      }).then(() => {
        // Delete user's matches
        return matchesRef.child(uid).remove()
      })
    },

    getMatches: uid => {
      const matchesRef = Database('matches')
      return matchesRef.child(uid).once('value')
        .then(matches => {
          const uidMatches = []
          matches.forEach(child => {
            uidMatches.push(child.key)
          })
          return uidMatches
        })
    }
  }
}
