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
  const maleForFemale = new User().male().likesFemale().get()
  const femaleForMale = new User().female().likesMale().get()

  describe('#createMatch(linkingUser, linkedUser)', () => {
    before(() => {
      const users = {
        [maleForFriends.Uid]: maleForFriends,
        [femaleForFriends.Uid]: femaleForFriends,
        [maleForFemale.Uid]: maleForFemale,
        [femaleForMale.Uid]: femaleForMale
      }
      Database('users').set(users)
      matchesRef.set({})
    })

    it('creates the match for the linkingUser', () => {
      return MatchService().createMatch(maleForFriends.Uid, femaleForFriends.Uid).then(() => {
        return matchesRef.child(`${maleForFriends.Uid}/${femaleForFriends.Uid}`).once('value').then(match => {
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

    describe('when two friends match', () => {
      before(() => {
        matchesRef.set({})
      })

      it('creates an startable match for the linkingUser', () => {
        return MatchService().createMatch(maleForFriends.Uid, femaleForFriends.Uid).then(() => {
          return matchesRef.child(`${maleForFriends.Uid}/${femaleForFriends.Uid}`).once('value')
            .then(match => {
              expect(match.val().startable).to.be.true
            })
        })
      })

      it('creates an startable match for the linkedUser', () => {
        return MatchService().createMatch(maleForFriends.Uid, femaleForFriends.Uid).then(() => {
          return matchesRef.child(`${femaleForFriends.Uid}/${maleForFriends.Uid}`).once('value')
            .then(match => {
              expect(match.val().startable).to.be.true
            })
        })
      })
    })

    describe('when a couple match', () => {
      before(() => {
        matchesRef.set({})
      })

      it('creates an startable match for the female', () => {
        return MatchService().createMatch(maleForFemale.Uid, femaleForMale.Uid).then(() => {
          return matchesRef.child(`${femaleForMale.Uid}/${maleForFemale.Uid}`).once('value').then(match => {
            expect(match.val().startable).to.be.true
          })
        })
      })

      it('creates a non-startable match for the male', () => {
        return MatchService().createMatch(maleForFemale.Uid, femaleForMale.Uid).then(() => {
          return matchesRef.child(`${maleForFemale.Uid}/${femaleForMale.Uid}`).once('value').then(match => {
            expect(match.val().startable).to.be.false
          })
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
