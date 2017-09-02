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
  // Escribo en la db
  db.ref('/').set({
    username: 'test',
    email: 'test@mail.com'
  })

  // Leo de la db
  db.ref('/').once('value', snapshot => {
    console.log(snapshot.val())
  })
}

Firebase()
