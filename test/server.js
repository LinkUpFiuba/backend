import FirebaseServer from 'firebase-server'

export class Server {
  static server = undefined

  constructor() {
    if (Server.server === undefined) {
      Server.server = new FirebaseServer(5000, 'localhost.firebaseio.test', {})
    }
  }

  get = () => {
    return Server.server
  }
}
