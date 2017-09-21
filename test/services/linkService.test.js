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

  describe('#detectLinks()', () => {
    const user1 = new User().get()
    const user2 = new User().get()

    describe('when only one user has linked', () => {
      before(() => {
        const links = {
          [user1.Uid]: {
            [user2.Uid]: true
          }
        }
        const linksRef = Database('links')
        linksRef.set(links)
      })

      it('does not create the match', () => {
        const possibleMatch = {
          aUniqueId: {
            linkingUser: user1.Uid,
            linkedUser: user2.Uid
          }
        }
        const possibleMatchesRef = Database('possibleMatches')
        const matchesRef = Database('matches')
        possibleMatchesRef.set(possibleMatch)
        return matchesRef.child(`aUniqueId/${user1.Uid}`).once('value').then(match => {
          expect(match.exists()).to.be.false
          expect(match.val()).to.be.null
        })
      })

      // // This test should be also use when both users have linked
      // it('removes the possible match', () => {
      //   const possibleMatch = {
      //     aUniqueId: {
      //       linkingUser: user1.Uid,
      //       linkedUser: user2.Uid
      //     }
      //   }
      //   const possibleMatchesRef = Database('possibleMatches')
      //   possibleMatchesRef.set(possibleMatch)
      //   //   .then(() => {
      //   //     return possibleMatchesRef.once('child_removed').then(possibleMatch => {
      //   //       console.log('Child removed!')
      //   //       expect(true).to.be.false
      //   //       // expect(possibleMatch.key).to.equal('aUniqueId')
      //   //     })
      //   //   })
      //
      //   // Not working
      //   // return possibleMatchesRef.once('child_removed').then(possibleMatch => {
      //   //   console.log('Child removed!')
      //   //   expect(possibleMatch.key).to.equal('aUniqueId')
      //   // })
      //
      //   // Not working
      //   // return setTimeout(() => {
      //   //   console.log('In timeout')
      //   //   return possibleMatchesRef.once('value').then(possibleMatches => {
      //   //     expect(possibleMatches.val()).to.be.null
      //   //   })
      //   // }, 5000)
      //
      //   // Working but needs to wait until it's removed to pass the expect
      //   // return possibleMatchesRef.once('value').then(possibleMatches => {
      //   //   expect(possibleMatches.val()).to.be.null
      //   // })
      // })
    })

    describe('when both users have linked each other', () => {
      before(() => {
        const links = {
          [user1.Uid]: {
            [user2.Uid]: true
          },
          [user2.Uid]: {
            [user1.Uid]: true
          }
        }
        const linksRef = Database('links')
        linksRef.set(links)
      })

      // it('creates the match', () => {
      //   const possibleMatch = {
      //     aUniqueId: {
      //       linkingUser: user1.Uid,
      //       linkedUser: user2.Uid
      //     }
      //   }
      //   const possibleMatchesRef = Database('possibleMatches')
      //   const matchesRef = Database('matches')
      //   return possibleMatchesRef.set(possibleMatch).then(() => {
      //     return matchesRef.once('child_added').then(matches => {
      //       expect(matches.val()).not.to.be.null
      //     })
      //   })
      // })
    })
  })
})
