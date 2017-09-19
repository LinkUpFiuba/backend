import Database from './gateway/database'

export default function LinkService() {
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
    }
  }
}
