import * as admin from 'firebase-admin'
import * as firebase from 'firebase'

export default () => {
  const TEST_URL = process.env.MOCKFIREBASE_DB_URL
  if (!TEST_URL) {
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
  } else {
    if (firebase.apps.length === 0) {
      const config = {
        apiKey: 'fake-api-key-for-testing-purposes-only',
        databaseURL: TEST_URL
      }
      firebase.initializeApp(config, 'TestingEnvironment')
    }
    return firebase.app('TestingEnvironment')
  }
}
