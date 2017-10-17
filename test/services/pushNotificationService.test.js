import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before } from 'mocha'
import { PushNotificationService } from '../../src/services/pushNotificationService'
import { User } from '../Factories/usersFactory'
import Database from '../../src/services/gateway/database'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('PushNotificationService', () => {
  describe('#sendMatchPush(user1, user2)', () => {
    const user1 = new User().male().get()
    const user2 = new User().female().get()

    before(() => {
      const users = {
        [user1.Uid]: user1,
        [user2.Uid]: user2
      }
      const usersRef = Database('users')
      usersRef.set(users)
    })

    it('sends the match push notification', () => {
      return PushNotificationService().sendMatchPush(user1.Uid, user2.Uid).then(response => {
        expect(response.successCount).to.equal(1)
      })
    })
  })

  describe('#sendDisablePush(userId)', () => {
    const user = new User().male().get()

    before(() => {
      const users = {
        [user.Uid]: user
      }
      const usersRef = Database('users')
      usersRef.set(users)
    })

    it('sends the disable user push notification', () => {
      return PushNotificationService().sendDisablePush(user.Uid).then(response => {
        expect(response.successCount).to.equal(1)
      })
    })
  })

  describe('#sendNewMessagePush(user1, user2, message)', () => {
    const user1 = new User().male().get()
    const user2 = new User().female().get()

    before(() => {
      const users = {
        [user1.Uid]: user1,
        [user2.Uid]: user2
      }
      const usersRef = Database('users')
      usersRef.set(users)
    })

    it('sends the new message push notification', () => {
      return PushNotificationService().sendNewMessagePush(user1.Uid, user2.Uid, 'message').then(response => {
        expect(response.successCount).to.equal(1)
      })
    })
  })
})
