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
    },

    detectLinks: () => {
      console.log('Starting to detect links')
      const linksRef = Database('links')
      // linksRef.on('child_changed', userSnapshot => {
      //   console.log(userSnapshot.key, userSnapshot.val())
      //   console.log(userSnapshot.toJSON())
      //   userSnapshot.on('child_added', itemSnapshot => {
      //     console.log(`${itemSnapshot.val()}`)
      //   })
      // })

      // Esto funciona, pero no se puede determinar cual fue el usuario al cual likeo (trae todos ¯\_(ツ)_/¯)
      linksRef.on('child_changed', link => {
        console.log('A child has changed!')
        console.log(`Liking user: ${link.key}`)
        link.forEach(child => {
          console.log(`\tPossible liked user: ${child.key}`)
        })
      })

      // No se por que esto se ejecuta cuando arranca el server tambien, pero mas alla de eso, funca
      linksRef.on('child_added', link => {
        console.log('A child has been added!')
        console.log(`Liking user: ${link.key}`)
        // Although we know there should be only one user here, we must do a forEach
        link.forEach(child => {
          console.log(`\tLiked user: ${child.key}`)
        })
      })
    }
  }
}
