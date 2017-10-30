import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before } from 'mocha'
import Database from '../../src/services/gateway/database'
import { User } from '../factories/usersFactory'
import UserController from '../../src/controllers/userController'
import { Ad } from '../factories/adsFactory'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('UserController', () => {
  const maleForFriends = new User().male().likesFriends().get()
  const maleForFriends2 = new User().male().likesFriends().get()
  const femaleForFriends = new User().female().likesFriends().get()
  const premiumForFriends = new User().male().premium().likesFriends().get()
  const googleAd = new Ad('Google', 'Google image').active().get()

  describe('getUsersForUser', () => {
    before(() => {
      Database('unlinks').set({})
      Database('links').set({})
      Database('users').set({})
      Database('ads').set({})
    })

    describe('when there is no user to return and no ad', () => {
      before(() => {
        Database('users').set({ [maleForFriends.Uid]: maleForFriends })
        Database('ads').set({})
      })

      it('should return empty array', () => {
        return UserController().getUsersForUser(maleForFriends.Uid).then(response => {
          expect(response.length).to.equal(0)
        })
      })
    })

    describe('when there is a user to return and no ad', () => {
      before(() => {
        const users = {
          [maleForFriends.Uid]: maleForFriends,
          [femaleForFriends.Uid]: femaleForFriends
        }
        Database('users').set(users)
        Database('ads').set({})
      })

      it('should return the user without an ad', () => {
        return UserController().getUsersForUser(maleForFriends.Uid).then(response => {
          expect(response.length).to.equal(1)
          expect(response[0].Uid).to.equal(femaleForFriends.Uid)
        })
      })
    })

    describe('when there is no user to return and an ad', () => {
      before(() => {
        const users = {
          [maleForFriends.Uid]: maleForFriends
        }
        Database('users').set(users)
        const ads = {
          [googleAd.id]: googleAd
        }
        Database('ads').set(ads)
      })

      it('should return empty array', () => {
        return UserController().getUsersForUser(maleForFriends.Uid).then(response => {
          expect(response.length).to.equal(0)
        })
      })
    })

    describe('when there is a user to return and an ad', () => {
      before(() => {
        const users = {
          [maleForFriends.Uid]: maleForFriends,
          [femaleForFriends.Uid]: femaleForFriends
        }
        Database('users').set(users)
        const ads = {
          [googleAd.id]: googleAd
        }
        Database('ads').set(ads)
      })

      it('should return the user and the ad', () => {
        return UserController().getUsersForUser(maleForFriends.Uid).then(response => {
          expect(response.length).to.equal(2)
        })
      })
    })

    describe('when there is more than a user to return and an ad', () => {
      before(() => {
        const users = {
          [maleForFriends.Uid]: maleForFriends,
          [femaleForFriends.Uid]: femaleForFriends,
          [maleForFriends2.Uid]: maleForFriends2
        }
        Database('users').set(users)
        const ads = {
          [googleAd.id]: googleAd
        }
        Database('ads').set(ads)
      })

      it('should return both users and ad', () => {
        return UserController().getUsersForUser(maleForFriends.Uid).then(response => {
          expect(response.length).to.equal(3)
        })
      })
    })

    describe('when it is a premium user', () => {
      before(() => {
        const users = {
          [maleForFriends.Uid]: maleForFriends,
          [femaleForFriends.Uid]: femaleForFriends,
          [maleForFriends2.Uid]: maleForFriends2,
          [premiumForFriends.Uid]: premiumForFriends
        }
        Database('users').set(users)
        const ads = {
          [googleAd.id]: googleAd
        }
        Database('ads').set(ads)
      })

      it('should return only users (no ad)', () => {
        return UserController().getUsersForUser(premiumForFriends.Uid).then(response => {
          expect(response.length).to.equal(3)
          response.forEach(user => {
            expect(user.type).to.equal('user')
          })
        })
      })
    })
  })
})
