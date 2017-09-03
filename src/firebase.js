// Correr como npm run build && node dist/firebase.js

import * as admin from 'firebase-admin'
import serviceAccount from '../config/firebase-adminsdk.json'

export const Firebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://linkup-7739d.firebaseio.com'
  })

  console.log(admin.app().name)

  const db = admin.database()
  const ref = db.ref('/')
  // Escribo en la db
  ref.set({
    username: 'test',
    email: 'test@mail.com'
  }).then(() => {
    console.log('Synchronization succeeded')
  }).catch(() => {
    console.log('Synchronization failed')
  })

  // Leo de la db
  ref.on('value').then(snapshot => {
    console.log(snapshot.val())
  })
}

Firebase()
