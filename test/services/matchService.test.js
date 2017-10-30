import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, beforeEach } from 'mocha'
import { MatchService } from '../../src/services/matchService'
import { User } from '../factories/usersFactory'
import Database from '../../src/services/gateway/database'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('MatchService', () => {
  describe('#deleteMatches(uid)', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()
    const matchesRef = Database('matches')

    beforeEach(() => {
      const matches = {
        [maleForFriends.Uid]: {
          [femaleForFriends.Uid]: {
            read: true
          }
        },
        [femaleForFriends.Uid]: {
          [maleForFriends.Uid]: {
            read: true
          }
        }
      }
      matchesRef.set(matches)
    })

    it('deletes the user matches', () => {
      return MatchService().deleteMatches(maleForFriends.Uid).then(() => {
        return MatchService().getMatches(maleForFriends.Uid).then(links => {
          expect(links.length).to.equal(0)
        })
      })
    })

    it('adds block to the other user', () => {
      return MatchService().deleteMatches(maleForFriends.Uid).then(() => {
        return matchesRef.child(`${femaleForFriends.Uid}/${maleForFriends.Uid}/block`).once('value')
          .then(result => {
            const block = result.val()
            expect(result.exists()).to.be.true
            expect(block.read).to.be.false
            expect(block.by).to.equal(maleForFriends.Uid)
            expect(block.type).to.equal('DELETE')
          })
      })
    })
  })
})
