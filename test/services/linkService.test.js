import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before } from 'mocha'
import LinkService from '../../src/services/linkService'
import { User } from './usersFactory'
import Database from '../../src/services/gateway/database'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('LinkService', () => {
  describe('#deleteUnlinks(uid)', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const maleForFriends2 = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()

    describe('when the user has one unlink', () => {
      before(() => {
        const unlinks = {
          [maleForFriends.Uid]: {
            [femaleForFriends.Uid]: true
          }
        }
        const ref = Database('unlinks')
        ref.set(unlinks)
      })

      it('Delete the unlink', () => {
        return LinkService().deleteUnlinks(maleForFriends).then(() => {
          return LinkService().getUnlinks(maleForFriends).then(unlinks => {
            expect(unlinks.length).to.equal(0)
          })
        })
      })
    })

    describe('when the user has more than one unlink', () => {
      before(() => {
        const unlinks = {
          [maleForFriends.Uid]: {
            [femaleForFriends.Uid]: true,
            [maleForFriends2.Uid]: true
          }
        }
        const ref = Database('unlinks')
        ref.set(unlinks)
      })

      it('Delete two unlinks', () => {
        return LinkService().deleteUnlinks(maleForFriends).then(() => {
          return LinkService().getUnlinks(maleForFriends).then(unlinks => {
            expect(unlinks.length).to.equal(0)
          })
        })
      })
    })

    describe('when the user has not any unlink', () => {
      before(() => {
        const unlinks = {
          [maleForFriends.Uid]: {
          }
        }
        const ref = Database('unlinks')
        ref.set(unlinks)
      })

      it('Deletes nothing', () => {
        return LinkService().deleteUnlinks(maleForFriends).then(() => {
          return LinkService().getUnlinks(maleForFriends).then(unlinks => {
            expect(unlinks.length).to.equal(0)
          })
        })
      })
    })

    describe('when the user has never put any unlink', () => {
      before(() => {
        const unlinks = {
        }
        const ref = Database('unlinks')
        ref.set(unlinks)
      })

      it('Deletes nothing', () => {
        return LinkService().deleteUnlinks(maleForFriends).then(() => {
          return LinkService().getUnlinks(maleForFriends).then(unlinks => {
            expect(unlinks.length).to.equal(0)
          })
        })
      })
    })
  })
})
