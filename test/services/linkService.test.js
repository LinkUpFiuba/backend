import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before, beforeEach } from 'mocha'
import LinkService, { SUPERLINK, LINK, NO_LINK, UNLINK } from '../../src/services/linkService'
import { User } from '../factories/usersFactory'
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

  describe('#onChildAdded()', () => {
    const linkingUser = new User().male().get()
    const linkedUser = new User().female().get()

    before(() => {
      const users = {
        [linkingUser.Uid]: linkingUser,
        [linkedUser.Uid]: linkedUser
      }
      Database('users').set(users)
    })

    describe('when only one user has linked', () => {
      before(() => {
        const links = {
          [linkingUser.Uid]: {
            [linkedUser.Uid]: true
          }
        }
        const linksRef = Database('links')
        linksRef.set(links)
      })

      beforeEach(() => {
        const possibleMatch = {
          aUniqueId: {
            linkingUser: linkingUser.Uid,
            linkedUser: linkedUser.Uid
          }
        }
        const possibleMatchesRef = Database('possibleMatches')
        possibleMatchesRef.set(possibleMatch)
      })

      it('does not create the match', () => {
        const possibleMatchesRef = Database('possibleMatches')

        return possibleMatchesRef.child('aUniqueId').once('value').then(possibleMatch => {
          return LinkService().onChildAdded(possibleMatch).then(() => {
            const matchesRef = Database('matches')
            return matchesRef.child(`${linkingUser.Uid}/${linkedUser.Uid}`).once('value').then(match => {
              expect(match.exists()).to.be.false
              expect(match.val()).to.be.null
            })
          })
        })
      })

      it('removes the possible match', () => {
        const possibleMatchesRef = Database('possibleMatches')

        return possibleMatchesRef.child('aUniqueId').once('value').then(possibleMatch => {
          return LinkService().onChildAdded(possibleMatch).then(() => {
            return possibleMatchesRef.once('value').then(possibleMatches => {
              expect(possibleMatches.exists()).to.be.false
              expect(possibleMatches.val()).to.be.null
            })
          })
        })
      })
    })

    describe('when both users have linked each other', () => {
      before(() => {
        const links = {
          [linkingUser.Uid]: {
            [linkedUser.Uid]: true
          },
          [linkedUser.Uid]: {
            [linkingUser.Uid]: true
          }
        }
        const linksRef = Database('links')
        linksRef.set(links)
      })

      beforeEach(() => {
        const possibleMatch = {
          aUniqueId: {
            linkingUser: linkingUser.Uid,
            linkedUser: linkedUser.Uid
          }
        }
        const possibleMatchesRef = Database('possibleMatches')
        possibleMatchesRef.set(possibleMatch)
      })

      it('creates the match', () => {
        const possibleMatchesRef = Database('possibleMatches')

        return possibleMatchesRef.child('aUniqueId').once('value').then(possibleMatch => {
          return LinkService().onChildAdded(possibleMatch).then(() => {
            const matchesRef = Database('matches')
            return matchesRef.child(`${linkingUser.Uid}/${linkedUser.Uid}`).once('value').then(match => {
              expect(match.exists()).to.be.true
              expect(match.val()).not.to.be.null
              expect(match.val().read).to.be.false
            })
          })
        })
      })

      it('removes the possible match', () => {
        const possibleMatchesRef = Database('possibleMatches')

        return possibleMatchesRef.child('aUniqueId').once('value').then(possibleMatch => {
          return LinkService().onChildAdded(possibleMatch).then(() => {
            return possibleMatchesRef.once('value').then(possibleMatches => {
              expect(possibleMatches.exists()).to.be.false
              expect(possibleMatches.val()).to.be.null
            })
          })
        })
      })
    })
  })

  describe('#getLinkBetween', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()
    const linksRef = Database('links')
    const unlinksRef = Database('unlinks')

    describe('when one user has unlinked the other', () => {
      before(() => {
        const unlinks = {
          [maleForFriends.Uid]: {
            [femaleForFriends.Uid]: true
          }
        }
        unlinksRef.set(unlinks)
        linksRef.set({})
      })

      it('it returns UNLINK', () => {
        return LinkService().getLinkBetween(femaleForFriends, maleForFriends).then(linkSituation => {
          expect(linkSituation).to.equal(UNLINK)
        })
      })
    })

    describe('when one user has linked the other', () => {
      before(() => {
        const links = {
          [maleForFriends.Uid]: {
            [femaleForFriends.Uid]: false
          }
        }
        unlinksRef.set({})
        linksRef.set(links)
      })

      it('it returns LINK', () => {
        return LinkService().getLinkBetween(femaleForFriends, maleForFriends).then(linkSituation => {
          expect(linkSituation).to.equal(LINK)
        })
      })
    })

    describe('when one user has superlinked the other', () => {
      before(() => {
        const links = {
          [maleForFriends.Uid]: {
            [femaleForFriends.Uid]: true
          }
        }
        unlinksRef.set({})
        linksRef.set(links)
      })

      it('it returns SUPERLINK', () => {
        return LinkService().getLinkBetween(femaleForFriends, maleForFriends).then(linkSituation => {
          expect(linkSituation).to.equal(SUPERLINK)
        })
      })
    })

    describe('when one user has not linked nor unlinked the other', () => {
      before(() => {
        unlinksRef.set({})
        linksRef.set({})
      })

      it('it returns NO_LINK', () => {
        return LinkService().getLinkBetween(femaleForFriends, maleForFriends).then(linkSituation => {
          expect(linkSituation).to.equal(NO_LINK)
        })
      })
    })
  })
})
