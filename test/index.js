import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before, after } from 'mocha'
import UserService from '../src/services/userService'
import FirebaseServer from 'firebase-server'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('UserService', () => {
  describe('#getAllUsers(uid)', () => {
    let server
    before(() => {
      const users = {
        users: {
          'aUid': {
            id: 'aUid'
          },
          'anotherUid': {
            id: 'anotherUid'
          }
        }
      }
      server = new FirebaseServer(5000, 'localhost.firebaseio.test', users)
    })

    it('returns all users from database', () => {
      return UserService().getAllUsers('someUid').then(users => {
        expect(users.length).to.equal(2)
      })
    })

    it('returns all users from database, except the one who is making the request', () => {
      return UserService().getAllUsers('anotherUid').then(users => {
        expect(users.length).to.equal(1)
        expect(users[0].id).to.equal('aUid')
      })
    })

    after(() => {
      server.close(console.log('— firebase server closed -'))
    })
  })
})
