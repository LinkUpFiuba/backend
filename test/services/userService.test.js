/* eslint-disable max-len */
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before, after } from 'mocha'
import UserService from '../../src/services/userService'
import Database from '../../src/services/gateway/database'
import FirebaseServer from 'firebase-server'
import { User, Interests } from './usersFactory'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('UserService', () => {
  describe('#getPosibleLinks(uid)', () => {
    let server
    const maleForFriends = new User().male().likesFriends().get()
    const maleForFriends2 = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()

    const maleForFemale = new User().male().likesFemale().get()
    const femaleForMale = new User().female().likesMale().get()
    const maleForMale = new User().male().likesMale().get()
    const maleForMale2 = new User().male().likesMale().get()
    const maleForMaleAndFemale = new User().male().likesMale().likesFemale().get()
    const femaleForFemale = new User().female().likesFemale().get()
    const femaleForMaleAndFemale = new User().female().likesMale().likesFemale().get()

    const femaleForMaleInAgeRange = new User().female().likesMale().age(30).ageRange(35, 45).get()
    const maleForFemaleInAgeRange = new User().male().likesFemale().age(35).ageRange(25, 35).get()
    const maleForFemaleInImposibleAgeRange = new User().female().likesMale().age(35).ageRange(60, 70).get()

    const femaleForMaleInvisibleMode = new User().female().likesMale().invisibleModeOn().get()

    const femaleForFriendsFarFromOthers = new User().female().likesFriends().withLocation(0, 0).maxDistance(50).get()
    const femaleForFriendsCloseToAnother = new User().female().likesFriends().withLocation(0.2, 0.2).maxDistance(50).get()
    const maleForFriendsCloseButNotEnoughToTheOthers = new User().male().likesFriends().withLocation(0.4, 0.4).maxDistance(50).get()
    const solariFemaleForFriends = new User().female().likesFemale().withLocation(1, 1).get()
    const solariFemaleForFriends2 = new User().female().likesFemale().withLocation(1, 1).get()
    const solariFemaleForFemaleInPosition3 = new User().female().likesFemale().withLocation(3, 3).get()
    const anotherSolariFemaleForFemaleInPosition3 = new User().female().likesFemale().withLocation(3.1, 3.4).get()

    const maleForFemaleInSomePosition = new User().male().likesFemale().withLocation(0, 0).get()
    const femaleForMaleInSamePosition = new User().female().likesMale().withLocation(0, 0).get()
    const femaleForMaleNearMale = new User().female().likesMale().withLocation(0.1, 0.1).get()
    const femaleForMaleNearMaleButNotMuch = new User().female().likesMale().withLocation(0.2, 0.2).get()
    const femaleForMaleNearMaleButNotSoMuch = new User().female().likesMale().withLocation(0.3, 0.3).get()
    const femaleForMaleNearMaleButFar = new User().female().likesMale().withLocation(0.67308, 0.6).get() // 100km far

    // The 'withLocation(20.90326, 20)' is in order to the distanceScore to be 0
    const maleForFemaleWithManyInterests = new User().male().likesFemale().withManyInterests().withLocation(20.90326, 20).get()
    const femaleForMaleWithManyInterests = new User().female().likesMale().withManyInterests().get()
    const femaleForMaleWithSomeInterests = new User().female().likesMale().withSomeInterests().get()
    const femaleForMaleWithOneInterest = new User().female().likesMale().withInterest(Interests.sanLorenzoInterest).get()
    const femaleForMaleWithTwoInterests = new User().female().likesMale().withInterest(Interests.sanLorenzoInterest).withInterest(Interests.adminInterest).get()
    const femaleForMaleWithThreeInterests = new User().female().likesMale().withInterest(Interests.sanLorenzoInterest).withInterest(Interests.adminInterest).withInterest(Interests.fiubaInterest).get()
    const femaleForMaleWithFourInterests = new User().female().likesMale().withInterest(Interests.sanLorenzoInterest).withInterest(Interests.adminInterest).withInterest(Interests.fiubaInterest).withInterest(Interests.lopilatoInterest).get()

    const searchForUser = (users, userForSearch) => {
      return users.map(user => user.Uid).includes(userForSearch.Uid)
    }

    before(() => {
      server = new FirebaseServer(5000, 'localhost.firebaseio.test', {})
    })

    describe('Search for friends', () => {
      before(() => {
        const users = {
          [maleForFriends.Uid]: maleForFriends,
          [femaleForFriends.Uid]: femaleForFriends,
          [maleForFriends2.Uid]: maleForFriends2,
          [maleForFemale.Uid]: maleForFemale
        }
        Database('unlinks').set({})
        Database('links').set({})
        const ref = Database('users')
        ref.set(users)
      })

      it('returns all who search for friends, whatever sex', () => {
        return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(searchForUser(users, femaleForFriends)).to.be.true
          expect(searchForUser(users, maleForFriends2)).to.be.true
        })
      })

      it('male who search for female, does not find a female who search for friends', () => {
        return UserService().getPosibleLinks(maleForFemale.Uid).then(users => {
          expect(searchForUser(users, femaleForFriends)).to.be.false
        })
      })
    })

    describe('Search for people of one gender', () => {
      before(() => {
        const users = {
          [maleForFemale.Uid]: maleForFemale,
          [femaleForMale.Uid]: femaleForMale,
          [maleForMale.Uid]: maleForMale,
          [maleForMale2.Uid]: maleForMale2,
          [femaleForFemale.Uid]: femaleForFemale,
          [femaleForMaleAndFemale.Uid]: femaleForMaleAndFemale,
          [maleForMaleAndFemale.Uid]: maleForMaleAndFemale
        }
        const ref = Database('users')
        Database('unlinks').set({})
        Database('links').set({})
        ref.set(users)
      })

      it('male search for female', () => {
        return UserService().getPosibleLinks(maleForFemale.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(searchForUser(users, femaleForMale)).to.be.true
          expect(searchForUser(users, femaleForMaleAndFemale)).to.be.true
        })
      })

      it('male search for male', () => {
        return UserService().getPosibleLinks(maleForMale.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(searchForUser(users, maleForMale2)).to.be.true
          expect(searchForUser(users, maleForMaleAndFemale)).to.be.true
        })
      })

      it('male search for male inverse', () => {
        return UserService().getPosibleLinks(maleForMale2.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(searchForUser(users, maleForMale)).to.be.true
          expect(searchForUser(users, maleForMaleAndFemale)).to.be.true
        })
      })

      it('male search for male and female', () => {
        return UserService().getPosibleLinks(maleForMaleAndFemale.Uid).then(users => {
          expect(users.length).to.equal(4)
          expect(searchForUser(users, maleForMale2)).to.be.true
          expect(searchForUser(users, maleForMale)).to.be.true
          expect(searchForUser(users, femaleForMale)).to.be.true
          expect(searchForUser(users, femaleForMaleAndFemale)).to.be.true
        })
      })

      it('female search for male', () => {
        return UserService().getPosibleLinks(femaleForMale.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(searchForUser(users, maleForFemale)).to.be.true
          expect(searchForUser(users, maleForMaleAndFemale)).to.be.true
        })
      })

      it('female search for female', () => {
        return UserService().getPosibleLinks(femaleForFemale.Uid).then(users => {
          expect(users.length).to.equal(1)
          expect(searchForUser(users, femaleForMaleAndFemale)).to.be.true
        })
      })

      it('female search for male and female', () => {
        return UserService().getPosibleLinks(femaleForMaleAndFemale.Uid).then(users => {
          expect(users.length).to.equal(3)
          expect(searchForUser(users, femaleForFemale)).to.be.true
          expect(searchForUser(users, maleForFemale)).to.be.true
          expect(searchForUser(users, maleForMaleAndFemale)).to.be.true
        })
      })
    })

    describe('Test age range', () => {
      before(() => {
        Database('unlinks').set({})
        Database('links').set({})
      })

      before(() => {
        const users = {
          [maleForFemaleInAgeRange.Uid]: maleForFemaleInAgeRange,
          [femaleForMaleInAgeRange.Uid]: femaleForMaleInAgeRange,
          [maleForFemaleInImposibleAgeRange.Uid]: maleForFemaleInImposibleAgeRange
        }
        const ref = Database('users')
        ref.set(users)
      })

      it('male search for female within range', () => {
        return UserService().getPosibleLinks(maleForFemaleInAgeRange.Uid).then(users => {
          expect(users.length).to.equal(1)
          expect(searchForUser(users, femaleForMaleInAgeRange)).to.be.true
        })
      })

      it('male search for female in an imposible range gets nothing', () => {
        return UserService().getPosibleLinks(maleForFemaleInImposibleAgeRange.Uid).then(users => {
          expect(users.length).to.equal(0)
        })
      })
    })

    describe('Test for invisible mode', () => {
      before(() => {
        Database('unlinks').set({})
        Database('links').set({})
      })

      before(() => {
        const users = {
          [femaleForMaleInvisibleMode.Uid]: femaleForMaleInvisibleMode,
          [maleForFemale.Uid]: maleForFemale
        }
        const ref = Database('users')
        ref.set(users)
      })

      it('Female for male can search like always', () => {
        return UserService().getPosibleLinks(femaleForMaleInvisibleMode.Uid).then(users => {
          expect(users.length).to.equal(1)
          expect(searchForUser(users, maleForFemale)).to.be.true
        })
      })

      it('Male for female cannot find female', () => {
        return UserService().getPosibleLinks(maleForFemale.Uid).then(users => {
          expect(users.length).to.equal(0)
        })
      })
    })

    describe('Test for distance filter', () => {
      before(() => {
        Database('unlinks').set({})
        Database('links').set({})
      })

      describe('when users are far from each other', () => {
        before(() => {
          const users = {
            [maleForFriends.Uid]: maleForFriends,
            [femaleForFriendsFarFromOthers.Uid]: femaleForFriendsFarFromOthers,
            [femaleForFriendsCloseToAnother.Uid]: femaleForFriendsCloseToAnother,
            [maleForFriendsCloseButNotEnoughToTheOthers.Uid]: maleForFriendsCloseButNotEnoughToTheOthers
          }
          const ref = Database('users')
          ref.set(users)
        })

        it('Female for friends too far from others gets only the ones included in maxDistance', () => {
          return UserService().getPosibleLinks(femaleForFriendsFarFromOthers.Uid).then(users => {
            expect(users.length).to.equal(1)
            expect(searchForUser(users, femaleForFriendsCloseToAnother)).to.be.true
          })
        })

        it('Male for friends gets nothing', () => {
          return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
            expect(users.length).to.equal(0)
          })
        })
      })

      describe('when users are close', () => {
        before(() => {
          const users = {
            [solariFemaleForFemaleInPosition3.Uid]: solariFemaleForFemaleInPosition3,
            [anotherSolariFemaleForFemaleInPosition3.Uid]: anotherSolariFemaleForFemaleInPosition3
          }
          const ref = Database('users')
          ref.set(users)
        })

        it('Female for female search only one within the range (different locations)', () => {
          return UserService().getPosibleLinks(solariFemaleForFemaleInPosition3.Uid).then(users => {
            expect(users.length).to.equal(1)
            expect(searchForUser(users, anotherSolariFemaleForFemaleInPosition3)).to.be.true
          })
        })
      })

      describe('when they are in the same spot', () => {
        before(() => {
          const users = {
            [solariFemaleForFriends.Uid]: solariFemaleForFriends,
            [solariFemaleForFriends2.Uid]: solariFemaleForFriends2
          }
          const ref = Database('users')
          ref.set(users)
        })

        it('Solari female for friends only find one friend', () => {
          return UserService().getPosibleLinks(solariFemaleForFriends.Uid).then(users => {
            expect(users.length).to.equal(1)
            expect(searchForUser(users, solariFemaleForFriends2)).to.be.true
          })
        })
      })
    })

    describe('Test for unlink filter', () => {
      before(() => {
        Database('links').set({})
      })

      describe('when they have already unliked', () => {
        before(() => {
          const users = {
            [maleForFriends.Uid]: maleForFriends,
            [femaleForFriends.Uid]: femaleForFriends
          }
          const unlinks = {
            [maleForFriends.Uid]: {
              [femaleForFriends.Uid]: true
            },
            [femaleForFriends.Uid]: {
              [maleForFriends.Uid]: true
            }
          }
          Database('users').set(users)
          Database('unlinks').set(unlinks)
        })

        it('Male for friends does not find female for friends because they have already unliked', () => {
          return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
            expect(users.length).to.equal(0)
          })
        })
      })

      describe('when they have already unliked and there is another', () => {
        before(() => {
          const users = {
            [maleForFriends.Uid]: maleForFriends,
            [femaleForFriends.Uid]: femaleForFriends,
            [maleForFriends2.Uid]: maleForFriends2
          }
          const unlinks = {
            [maleForFriends.Uid]: {
              [femaleForFriends.Uid]: true
            },
            [femaleForFriends.Uid]: {
              [maleForFriends.Uid]: true
            }
          }
          Database('users').set(users)
          Database('unlinks').set(unlinks)
        })

        it('Male for friends does not find female for friends because they have already unliked but finds male with whom he has not liked', () => {
          return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
            expect(users.length).to.equal(1)
            expect(searchForUser(users, maleForFriends2)).to.be.true
          })
        })
      })

      describe('when they have all unliked with each other', () => {
        before(() => {
          const users = {
            [maleForFriends.Uid]: maleForFriends,
            [femaleForFriends.Uid]: femaleForFriends,
            [maleForFriends2.Uid]: maleForFriends2
          }
          const unlinks = {
            [maleForFriends.Uid]: {
              [femaleForFriends.Uid]: true,
              [maleForFriends2.Uid]: true
            },
            [femaleForFriends.Uid]: {
              [maleForFriends.Uid]: true,
              [maleForFriends2.Uid]: true
            },
            [maleForFriends2.Uid]: {
              [maleForFriends.Uid]: true,
              [femaleForFriends.Uid]: true
            }
          }
          Database('users').set(users)
          Database('unlinks').set(unlinks)
        })

        it('Male for friends does find nobody', () => {
          return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
            expect(users.length).to.equal(0)
          })
        })
      })
    })

    describe('Test for link filter', () => {
      before(() => {
        Database('unlinks').set({})
      })

      describe('when they have already liked', () => {
        before(() => {
          const users = {
            [maleForFriends.Uid]: maleForFriends,
            [femaleForFriends.Uid]: femaleForFriends
          }
          const links = {
            [maleForFriends.Uid]: {
              [femaleForFriends.Uid]: true
            },
            [femaleForFriends.Uid]: {
              [maleForFriends.Uid]: true
            }
          }
          Database('users').set(users)
          Database('links').set(links)
        })

        it('Male for friends does not find female for friends because they have already liked', () => {
          return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
            expect(users.length).to.equal(0)
          })
        })
      })
      describe('when one like me but I have not liked him yet', () => {
        before(() => {
          const users = {
            [maleForFriends.Uid]: maleForFriends,
            [femaleForFriends.Uid]: femaleForFriends
          }
          const links = {
            [maleForFriends.Uid]: {
              [femaleForFriends.Uid]: true
            }
          }
          Database('users').set(users)
          Database('links').set(links)
        })

        it('Female for friends finds male for friends ', () => {
          return UserService().getPosibleLinks(femaleForFriends.Uid).then(users => {
            expect(users.length).to.equal(1)
          })
        })
      })
      describe('when they have already liked and there is another', () => {
        before(() => {
          const users = {
            [maleForFriends.Uid]: maleForFriends,
            [femaleForFriends.Uid]: femaleForFriends,
            [maleForFriends2.Uid]: maleForFriends2
          }
          const links = {
            [maleForFriends.Uid]: {
              [femaleForFriends.Uid]: true
            },
            [femaleForFriends.Uid]: {
              [maleForFriends.Uid]: true
            }
          }
          Database('users').set(users)
          Database('links').set(links)
        })

        it('Male for friends does not find female for friends because they have already liked but finds male with whom he has not liked', () => {
          return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
            expect(users.length).to.equal(1)
            expect(searchForUser(users, maleForFriends2)).to.be.true
          })
        })
      })

      describe('when they have all liked with each other', () => {
        before(() => {
          const users = {
            [maleForFriends.Uid]: maleForFriends,
            [femaleForFriends.Uid]: femaleForFriends,
            [maleForFriends2.Uid]: maleForFriends2
          }
          const links = {
            [maleForFriends.Uid]: {
              [femaleForFriends.Uid]: true,
              [maleForFriends2.Uid]: true
            },
            [femaleForFriends.Uid]: {
              [maleForFriends.Uid]: true,
              [maleForFriends2.Uid]: true
            },
            [maleForFriends2.Uid]: {
              [maleForFriends.Uid]: true,
              [femaleForFriends.Uid]: true
            }
          }
          Database('users').set(users)
          Database('links').set(links)
        })

        it('Male for friends does find nobody', () => {
          return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
            expect(users.length).to.equal(0)
          })
        })
      })
    })

    describe('Test for matching algorithm', () => {
      before(() => {
        Database('unlinks').set({})
        Database('links').set({})
      })

      describe('when they have nothing in common', () => {
        before(() => {
          // In the database they are not ordered by distance
          const users = {
            [maleForFemaleInSomePosition.Uid]: maleForFemaleInSomePosition,
            [femaleForMaleNearMaleButNotSoMuch.Uid]: femaleForMaleNearMaleButNotSoMuch,
            [femaleForMaleInSamePosition.Uid]: femaleForMaleInSamePosition,
            [femaleForMaleNearMaleButNotMuch.Uid]: femaleForMaleNearMaleButNotMuch,
            [femaleForMaleNearMale.Uid]: femaleForMaleNearMale,
            [femaleForMaleNearMaleButFar.Uid]: femaleForMaleNearMaleButFar
          }
          const ref = Database('users')
          ref.set(users)
        })

        it('orders by distance', () => {
          return UserService().getPosibleLinks(maleForFemaleInSomePosition.Uid).then(users => {
            expect(users.length).to.equal(5)
            expect(users[0].Uid).to.equal(femaleForMaleInSamePosition.Uid)
            expect(users[1].Uid).to.equal(femaleForMaleNearMale.Uid)
            expect(users[2].Uid).to.equal(femaleForMaleNearMaleButNotMuch.Uid)
            expect(users[3].Uid).to.equal(femaleForMaleNearMaleButNotSoMuch.Uid)
            expect(users[4].Uid).to.equal(femaleForMaleNearMaleButFar.Uid)
          })
        })

        it('the user in the same spot has the best score', () => {
          return UserService().getPosibleLinks(maleForFemaleInSomePosition.Uid).then(users => {
            expect(users[0].matchingScore).to.equal(60)
          })
        })

        it('the furthest user has the worst score', () => {
          return UserService().getPosibleLinks(maleForFemaleInSomePosition.Uid).then(users => {
            expect(users[4].matchingScore).to.equal(0)
          })
        })

        it('users have the distance property', () => {
          return UserService().getPosibleLinks(maleForFemaleInSomePosition.Uid).then(users => {
            expect(users[0]).to.have.property('distance')
          })
        })
      })

      describe('when they are in the same place', () => {
        before(() => {
          // In the database they are not ordered by interests count
          const users = {
            [maleForFemaleWithManyInterests.Uid]: maleForFemaleWithManyInterests,
            [femaleForMaleWithSomeInterests.Uid]: femaleForMaleWithSomeInterests,
            [femaleForMaleWithThreeInterests.Uid]: femaleForMaleWithThreeInterests,
            [femaleForMaleWithOneInterest.Uid]: femaleForMaleWithOneInterest,
            [femaleForMaleWithManyInterests.Uid]: femaleForMaleWithManyInterests,
            [femaleForMaleWithFourInterests.Uid]: femaleForMaleWithFourInterests,
            [femaleForMaleWithTwoInterests.Uid]: femaleForMaleWithTwoInterests
          }
          const ref = Database('users')
          ref.set(users)
        })

        it('orders by interests', () => {
          return UserService().getPosibleLinks(maleForFemaleWithManyInterests.Uid).then(users => {
            expect(users.length).to.equal(5)
            expect(users[0].Uid).to.equal(femaleForMaleWithManyInterests.Uid)
            expect(users[1].Uid).to.equal(femaleForMaleWithSomeInterests.Uid)
            expect(users[2].Uid).to.equal(femaleForMaleWithFourInterests.Uid)
            expect(users[3].Uid).to.equal(femaleForMaleWithThreeInterests.Uid)
            expect(users[4].Uid).to.equal(femaleForMaleWithTwoInterests.Uid)
          })
        })

        it('user with 11 interests in common has the best score', () => {
          return UserService().getPosibleLinks(maleForFemaleWithManyInterests.Uid).then(users => {
            expect(users[0].matchingScore).to.equal(0.4 * 10 * 10)
          })
        })

        it('user with four interests in common has the correct score', () => {
          return UserService().getPosibleLinks(maleForFemaleWithManyInterests.Uid).then(users => {
            expect(users[2].matchingScore).to.equal(0.4 * 4 * 10)
          })
        })

        it('users have the commonInterests property', () => {
          return UserService().getPosibleLinks(maleForFemaleWithManyInterests.Uid).then(users => {
            expect(users[0]).to.have.property('commonInterests')
          })
        })
      })
    })

    after(() => {
      server.close(console.log('- Firebase server closed -'))
    })
  })
})
