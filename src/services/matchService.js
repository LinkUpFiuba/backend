import Database from './gateway/database'
import { PushNotificationService } from './pushNotificationService'

export const MatchService = () => {
  return {
    createMatch: (linkingUser, linkedUser) => {
      const matchesRef = Database('matches')
      const matchesToCreate = {}
      matchesToCreate[`${linkedUser}/${linkingUser}/read`] = false
      matchesToCreate[`${linkingUser}/${linkedUser}/read`] = false
      return matchesRef.update(matchesToCreate).then(() => {
        console.log('\tMatch successfully created!')
        return PushNotificationService().sendMatchPush(linkingUser, linkedUser)
      }).catch(() => {
        console.log('\tMatch could not be created :(')
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
