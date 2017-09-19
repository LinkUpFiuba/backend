import FirebaseServer from 'firebase-server'

export class TestServer {
  static server = undefined

  constructor() {
    if (TestServer.server === undefined) {
      TestServer.server = new FirebaseServer(5000, 'localhost.firebaseio.test', {})
    }
  }

  get = () => {
    return TestServer.server
  }
}
