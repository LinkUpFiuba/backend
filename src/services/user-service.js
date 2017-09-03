import * as admin from 'firebase-admin'
import serviceAccount from '../../config/firebase-adminsdk.json'

export default function UserService() {
  return {
    create: username => {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://linkup-7739d.firebaseio.com'
      })

      const db = admin.database()
      const usersRef = db.ref('/users')

      usersRef.push().set({
        name: username
      })
    }
  }
}
