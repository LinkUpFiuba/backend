import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before, beforeEach } from 'mocha'
import { MatchService } from '../../src/services/matchService'
import { User } from '../factories/usersFactory'
import Database from '../../src/services/gateway/database'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('MatchService', () => {
  const matchesRef = Database('matches')
  const maleForFriends = new User().male().likesFriends().get()
  const femaleForFriends = new User().female().likesFriends().get()

  describe('#createMatch(linkingUser, linkedUser)', () => {
    before(() => {
      const users = {
        [maleForFriends.Uid]: maleForFriends,
        [femaleForFriends.Uid]: femaleForFriends
      }
      Database('users').set(users)
      matchesRef.set({})
    })

    it('creates the match for the linkingUser', () => {
      return MatchService().createMatch(maleForFriends.Uid, femaleForFriends.Uid).then(() => {
        return matchesRef.child(`${maleForFriends.Uid}/${femaleForFriends.Uid}`).once('value').then(match => {
          console.log(match.val())
          expect(match.exists()).to.be.true
          expect(match.val().read).to.be.false
        })
      })
    })

    it('creates the match for the linkedUser', () => {
      return MatchService().createMatch(maleForFriends.Uid, femaleForFriends.Uid).then(() => {
        return matchesRef.child(`${femaleForFriends.Uid}/${maleForFriends.Uid}`).once('value').then(match => {
          expect(match.exists()).to.be.true
          expect(match.val().read).to.be.false
        })
      })
    })
  })

  describe('#deleteMatches(uid)', () => {
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
