import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, before, it } from 'mocha'
import Database from '../../src/services/gateway/database'
import DisableUserService from '../../src/services/disableUserService'
import { User } from './usersFactory'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('disableUserService', () => {
  describe('blockUser', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()

    before(() => {
      const users = {
        [maleForFriends.Uid]: maleForFriends,
        [femaleForFriends.Uid]: femaleForFriends
      }
      Database('users').set(users)
    })

    describe('No disabled users', () => {
      before(() => {
        Database('disabledUsers').set({})
      })

      it('should save the user', () => {
        return DisableUserService().blockUser(maleForFriends.Uid).then(() => {
          return Database('disabledUsers').child(maleForFriends.Uid.toString()).once('value').then(result => {
            expect(result.exists()).to.be.true
          })
        })
      })
    })

    describe('There is a user disabled', () => {
      before(() => {
        const disabledUsers = {
          [femaleForFriends.Uid]: true
        }
        Database('disabledUsers').set(disabledUsers)
        DisableUserService().blockUser(maleForFriends.Uid)
      })

      it('should save the user', () => {
        return Database('disabledUsers').child(maleForFriends.Uid.toString()).once('value').then(result => {
          expect(result.exists()).to.be.true
        })
      })

      it('femaleUser should still be disabled', () => {
        return Database('disabledUsers').child(femaleForFriends.Uid.toString()).once('value').then(result => {
          expect(result.exists()).to.be.true
        })
      })
    })
  })

  describe('unblockUser', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()

    describe('No disabled users', () => {
      before(() => {
        Database('disabledUsers').set({})
      })

      it('should reject promise', () => {
        return DisableUserService().unblockUser(maleForFriends.Uid)
          .then(() => {
            return Promise.reject(new Error('Expected method to reject.'))
          })
          .catch(() => {
            return true
          })
      })
    })

    describe('There is a user disabled', () => {
      before(() => {
        const disabledUsers = {
          [femaleForFriends.Uid]: true
        }
        Database('disabledUsers').set(disabledUsers)
      })

      it('should delete the user from disabledUsers', () => {
        return DisableUserService().unblockUser(femaleForFriends.Uid).then(() => {
          return Database('disabledUsers').child(femaleForFriends.Uid).once('value').then(result => {
            expect(result.exists()).to.be.false
          })
        })
      })
    })

    describe('Both users are disabled', () => {
      before(() => {
        const disabledUsers = {
          [femaleForFriends.Uid]: true,
          [maleForFriends.Uid]: true
        }
        Database('disabledUsers').set(disabledUsers)
        return DisableUserService().unblockUser(maleForFriends.Uid)
      })

      it('should delete the user', () => {
        return DisableUserService().isUserDisabled(maleForFriends.Uid).then(result => {
          expect(result).to.be.false
        })
      })

      it('should still be disabled true', () => {
        return DisableUserService().isUserDisabled(femaleForFriends.Uid).then(result => {
          expect(result).to.be.true
        })
      })
    })
  })

  describe('isUserDisabled', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()

    describe('No disabled users', () => {
      before(() => {
        Database('disabledUsers').set({})
      })

      it('should return false', () => {
        return DisableUserService().isUserDisabled(maleForFriends.Uid).then(result => {
          expect(result).to.be.false
        })
      })
    })

    describe('One disabled user', () => {
      before(() => {
        const disabledUsers = {
          [femaleForFriends.Uid]: true
        }
        Database('disabledUsers').set(disabledUsers)
      })

      it('should return false', () => {
        return DisableUserService().isUserDisabled(maleForFriends.Uid).then(result => {
          expect(result).to.be.false
        })
      })

      it('should return true', () => {
        return DisableUserService().isUserDisabled(femaleForFriends.Uid).then(result => {
          expect(result).to.be.true
        })
      })
    })

    describe('Both users are disabled', () => {
      before(() => {
        const disabledUsers = {
          [femaleForFriends.Uid]: true,
          [maleForFriends.Uid]: true
        }
        Database('disabledUsers').set(disabledUsers)
      })

      it('should return false', () => {
        return DisableUserService().isUserDisabled(maleForFriends.Uid).then(result => {
          expect(result).to.be.true
        })
      })

      it('should return true', () => {
        return DisableUserService().isUserDisabled(femaleForFriends.Uid).then(result => {
          expect(result).to.be.true
        })
      })
    })
  })
})
