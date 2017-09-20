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

      // This works if we put a timestamp instead of a true for the links table
      linksRef.on('child_changed', link => {
        console.log('A child has changed!')
        console.log(`Liking user: ${link.key}`)
        let likedUsers = link.val()
        // El problema que le veo a esto es que no se como se maneja firebase si entran varios changes.
        // O sea, si es posible que en el child_changed se genere cuando cambiaron 2 cosas casi simultaneas,
        // esto no funcionaria porque solo "atenderia" a la ultima. Si en cambio los eventos se "encolan"
        // haciendo que entren 2 eventos distintos con los cambios en la base hasta ese momento, esto si funca
        // De todas formas, sigo investigando a ver si hay algo mejor para hacer.
        // Otra forma de solucionar esto, es tener un valor dentro de cada user que indique el ultimo
        // timestamp que proceso, y filtrar los timestamps mayores a este para procesar (y actualizarlo)
        // Order them by timestamp
        likedUsers = Object.keys(likedUsers).sort((a, b) => likedUsers[b] - likedUsers[a])
        console.log(`\tLiked user: ${likedUsers[0]}`)
      })

      // Listen to users that has never made a link, so the first time they will create their key in the db
      let newItems = false
      linksRef.on('child_added', link => {
        if (!newItems) return
        console.log('A child has been added!')
        console.log(`Liking user: ${link.key}`)
        // Although we know there should be only one user here, we must do a forEach
        link.forEach(child => {
          console.log(`\tLiked user: ${child.key}`)
        })
      })
      // This is in order not to trigger events when the server starts
      // See: https://stackoverflow.com/questions/18270995/how-to-retrieve-only-new-data
      linksRef.once('value', () => {
        newItems = true
      })
    }
  }
}
