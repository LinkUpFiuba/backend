import firebase from 'firebase'

export default function firebaseService() {
  return {
    initiazeFirebase() {
      if (firebase.apps.length !== 0) {
        return
      }
      const config = {
        apiKey: 'AIzaSyDZ6HKdLdcXD6aZfIh-ZXO_QlLKNYNWqtE',
        authDomain: 'linkup-7739d.firebaseapp.com',
        databaseURL: 'https://linkup-7739d.firebaseio.com'
      }
      firebase.initializeApp(config)
    }
  }
}
