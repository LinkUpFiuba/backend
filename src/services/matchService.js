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
    // Use the linkingUser interests to determine whether it's a link between friends or not
    // (As the linkedUser may have changed its interests after giving the link)
    const areCouple = !user1.interests.friends
    return isHeterosexual && areCouple
  }

  const isStartable = (user, isHeterosexualCouple) => {
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
          matchesToCreate[`${linkingUser}/${linkedUser}/startable`] = isStartable(user1, isHeterosexualCouple)
          matchesToCreate[`${linkedUser}/${linkingUser}/read`] = false
          matchesToCreate[`${linkedUser}/${linkingUser}/startable`] = isStartable(user2, isHeterosexualCouple)
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
