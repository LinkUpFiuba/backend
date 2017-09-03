import * as admin from 'firebase-admin'
import serviceAccount from '../config/firebase-adminsdk.json'

export default function Database(table) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://linkup-7739d.firebaseio.com'
  })

  const db = admin.database()
  return db.ref(`/${table}`)
}
