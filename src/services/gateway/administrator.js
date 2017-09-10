import * as admin from 'firebase-admin'

export default () => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: 'linkup-7739d',
        clientEmail: 'firebase-adminsdk-7txkj@linkup-7739d.iam.gserviceaccount.com',
        privateKey: process.env.FIREBASE_PRIVATE_KEY
      }),
      databaseURL: 'https://linkup-7739d.firebaseio.com'
    })
  }
  return admin
}
