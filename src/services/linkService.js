import Database from './gateway/database'

export default function LinkService() {
  const checkLink = (linkingUser, linkedUser) => {
    const linksRef = Database('links')
    return linksRef.child(`${linkedUser}/${linkingUser}`).once('value')
      .then(snapshot => {
        const newMatch = snapshot.exists()
        // Create push notification!
        console.log(`${newMatch ? '\tThere is a new match!' : '\tNo new match :('}`)
        if (newMatch) {
          const matchesRef = Database('matches')
          const matchesToCreate = {}
          matchesToCreate[`${linkedUser}/${linkingUser}/read`] = false
          matchesToCreate[`${linkingUser}/${linkedUser}/read`] = false
          return matchesRef.update(matchesToCreate).then(() => {
            console.log('\tMatch successfully created!')
          }).catch(() => {
            console.log('\tMatch could not be created :(')
          })
        }
      })
  }

  return {
    getLinks: actualUser => {
      const linksRef = Database('links')
      return linksRef.child(actualUser.Uid).once('value')
        .then(links => {
          const uidLinks = []
          links.forEach(child => {
            uidLinks.push(child.key)
          })
          return uidLinks
        })
    },

    getUnlinks: actualUser => {
      const unlinksRef = Database('unlinks')
      return unlinksRef.child(actualUser.Uid).once('value')
        .then(unLinks => {
          const uidUnLinks = []
          unLinks.forEach(child => {
            uidUnLinks.push(child.key)
          })
          return uidUnLinks
        })
    },

    deleteUnlinks: actualUser => {
      const unlinksRef = Database('unlinks')
      return unlinksRef.child(actualUser.Uid).remove()
    },

    detectLinks: () => {
      console.log('Starting to detect links')
      const possibleMatchesRef = Database('possibleMatches')

      possibleMatchesRef.on('child_added', possibleMatch => {
        console.log('A possible match was detected!')
        const linkingUser = possibleMatch.child('linkingUser').val()
        console.log(`\tLinking user: ${linkingUser}`)
        const linkedUser = possibleMatch.child('linkedUser').val()
        console.log(`\tLinked user: ${linkedUser}`)
        checkLink(linkingUser, linkedUser)
          .then(() => possibleMatchesRef.child(possibleMatch.key).remove())
          .then(() => {
            console.log('Possible match removed!')
          })
      })
    }
  }
}
