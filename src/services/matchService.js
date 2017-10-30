import Database from './gateway/database'

// TODO: Here we should also include the matches creation that is actually in the LinkService
export const MatchService = () => {
  return {
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
