/* eslint-disable max-len */
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before } from 'mocha'
import UserService, {
  DISTANCE_WEIGHT,
  INTERESTS_WEIGHT,
  LINK_SITUATION_WEIGHT,
  LINK_UP_PLUS_WEIGHT,
  FREE_SUPERLINKS,
  PREMIUM_SUPERLINKS
} from '../../src/services/userService'
import Database from '../../src/services/gateway/database'
import { User, Interests } from '../factories/usersFactory'
import { SUPERLINK, LINK, UNLINK, NO_LINK } from '../../src/services/linkService'
import { getActualDate } from '../../src/services/dateService'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('UserService', () => {
  describe('#getPosibleLinks(uid)', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const maleForFriends2 = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()
    const femaleForFriends2 = new User().female().likesFriends().get()

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

    // The 'withLocation(20.90326, 20)' is in order to the distanceScore to be 0 (i.e. to be at 100km far)
    const maleForFriendsAt100km = new User().male().likesFriends().withLocation(20.90326, 20).get()
    const freeUserForFriends = new User().female().likesFriends().get()
    const premiumForFriends = new User().male().likesFriends().premium().get()
    const anotherFreeUserForFriends = new User().male().likesFriends().get()
    const lastFreeUserForFriends = new User().female().likesFriends().get()
    const yetAnotherFreeUserForFriends = new User().male().likesFriends().get()

    const searchForUser = (users, userForSearch) => {
      return users.map(user => user.Uid).includes(userForSearch.Uid)
    }

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
            [femaleForFriends.Uid]: femaleForFriends,
            [femaleForFriends2.Uid]: femaleForFriends2
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
            expect(users.length).to.equal(1)
            expect(searchForUser(users, femaleForFriends2)).to.be.true
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

          it('Male for friends finds female for friends because the unlikes were deleted because there were no more users to show', () => {
            return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
              expect(users.length).to.equal(1)
              expect(searchForUser(users, femaleForFriends)).to.be.true
            })
          })
        })
      })

      describe('when they have all unliked with each other (and there is a new one)', () => {
        before(() => {
          const users = {
            [maleForFriends.Uid]: maleForFriends,
            [femaleForFriends.Uid]: femaleForFriends,
            [maleForFriends2.Uid]: maleForFriends2,
            [femaleForFriends2.Uid]: femaleForFriends2
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

        it('Male for friends does find only the new one', () => {
          return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
            expect(users.length).to.equal(1)
            expect(searchForUser(users, femaleForFriends2)).to.be.true
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
              [femaleForFriends.Uid]: 'normal'
            },
            [femaleForFriends.Uid]: {
              [maleForFriends.Uid]: 'normal'
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
              [femaleForFriends.Uid]: 'normal'
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
              [femaleForFriends.Uid]: 'normal'
            },
            [femaleForFriends.Uid]: {
              [maleForFriends.Uid]: 'normal'
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
              [femaleForFriends.Uid]: 'normal',
              [maleForFriends2.Uid]: 'normal'
            },
            [femaleForFriends.Uid]: {
              [maleForFriends.Uid]: 'normal',
              [maleForFriends2.Uid]: 'normal'
            },
            [maleForFriends2.Uid]: {
              [maleForFriends.Uid]: 'normal',
              [femaleForFriends.Uid]: 'normal'
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

    describe('Test for response fields', () => {
      describe('Test for commonInterests field', () => {
        before(() => {
          Database('unlinks').set({})
          Database('links').set({})
        })

        describe('when they have nothing in common', () => {
          before(() => {
            const users = {
              [maleForFemaleInSomePosition.Uid]: maleForFemaleInSomePosition,
              [femaleForMaleNearMale.Uid]: femaleForMaleNearMale
            }
            const ref = Database('users')
            ref.set(users)
          })

          it('commonInterests is empty', () => {
            return UserService().getPosibleLinks(maleForFemaleInSomePosition.Uid).then(users => {
              expect(users.length).to.equal(1)
              expect(users[0].commonInterests).to.be.an('array').that.is.empty
            })
          })
        })

        describe('when they have one thing in common', () => {
          before(() => {
            const users = {
              [maleForFemaleWithManyInterests.Uid]: maleForFemaleWithManyInterests,
              [femaleForMaleWithOneInterest.Uid]: femaleForMaleWithOneInterest
            }
            const ref = Database('users')
            ref.set(users)
          })

          it('commonInterests has one interest', () => {
            return UserService().getPosibleLinks(maleForFemaleWithManyInterests.Uid).then(users => {
              expect(users.length).to.equal(1)
              expect(users[0].commonInterests).to.be.an('array')
              expect(users[0].commonInterests[0].id).to.be.equal(femaleForMaleWithOneInterest.likesList[0].id)
            })
          })
        })
      })
    })

    describe('Test for disabled user', () => {
      describe('when the only user is disabled', () => {
        before(() => {
          const users = {
            [maleForFemaleWithManyInterests.Uid]: maleForFemaleWithManyInterests,
            [femaleForMaleWithOneInterest.Uid]: femaleForMaleWithOneInterest
          }
          const disabledUsers = {
            [maleForFemaleWithManyInterests.Uid]: 'blocked'
          }
          const ref = Database('users')
          ref.set(users)
          Database('unlinks').set({})
          Database('links').set({})
          Database('disabledUsers').set(disabledUsers)
        })

        it('should return no user', () => {
          return UserService().getPosibleLinks(femaleForMaleWithOneInterest.Uid).then(users => {
            expect(users.length).to.equal(0)
          })
        })
      })

      describe('when one user is disabled and other not', () => {
        before(() => {
          const users = {
            [maleForFemaleWithManyInterests.Uid]: maleForFemaleWithManyInterests,
            [maleForMaleAndFemale.Uid]: maleForMaleAndFemale,
            [femaleForMaleWithOneInterest.Uid]: femaleForMaleWithOneInterest
          }
          const disabledUsers = {
            [maleForFemaleWithManyInterests.Uid]: 'blocked'
          }
          const ref = Database('users')
          ref.set(users)
          Database('unlinks').set({})
          Database('links').set({})
          Database('disabledUsers').set(disabledUsers)
        })

        it('should return the enabled user', () => {
          return UserService().getPosibleLinks(femaleForMaleWithOneInterest.Uid).then(users => {
            expect(users.length).to.equal(1)
            expect(users[0].Uid).to.equal(maleForMaleAndFemale.Uid)
          })
        })
      })

      describe('when two users are disabled', () => {
        before(() => {
          const users = {
            [maleForFemaleWithManyInterests.Uid]: maleForFemaleWithManyInterests,
            [maleForMaleAndFemale.Uid]: maleForMaleAndFemale,
            [femaleForMaleWithOneInterest.Uid]: femaleForMaleWithOneInterest
          }
          const disabledUsers = {
            [maleForFemaleWithManyInterests.Uid]: 'blocked',
            [maleForMaleAndFemale.Uid]: 'blocked'
          }
          const ref = Database('users')
          ref.set(users)
          Database('unlinks').set({})
          Database('links').set({})
          Database('disabledUsers').set(disabledUsers)
        })

        it('should return no users', () => {
          return UserService().getPosibleLinks(femaleForMaleWithOneInterest.Uid).then(users => {
            expect(users.length).to.equal(0)
          })
        })
      })
    })

    describe('Test for blocking filter', () => {
      before(() => {
        Database('unlinks').set({})
        Database('links').set({})
        const users = {
          [maleForFriends.Uid]: maleForFriends,
          [femaleForFriends.Uid]: femaleForFriends
        }
        const usersRef = Database('users')
        usersRef.set(users)
      })

      describe('when they have not blocked each other', () => {
        before(() => {
          const blocksRef = Database('blocks')
          blocksRef.set({})
        })

        it('they can be found each other', () => {
          return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
            expect(users.length).to.equal(1)
            expect(users[0].Uid).to.equal(femaleForFriends.Uid)
          })
        })
      })

      describe('when one of them blocked the other', () => {
        before(() => {
          const blocksRef = Database('blocks')
          blocksRef.set({
            [maleForFriends.Uid]: {
              [femaleForFriends.Uid]: true
            }
          })
        })

        it('the blocking user cannot find the blocked user', () => {
          return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
            expect(users.length).to.equal(0)
          })
        })

        it('the blocked user cannot find the blocking user', () => {
          return UserService().getPosibleLinks(femaleForFriends.Uid).then(users => {
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
          const usersRef = Database('users')
          usersRef.set(users)
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
            expect(users[0].matchingScore).to.equal(DISTANCE_WEIGHT * 100 + LINK_SITUATION_WEIGHT * NO_LINK)
          })
        })

        it('the furthest user has the worst score', () => {
          return UserService().getPosibleLinks(maleForFemaleInSomePosition.Uid).then(users => {
            expect(users[4].matchingScore).to.equal(DISTANCE_WEIGHT * 0 + LINK_SITUATION_WEIGHT * NO_LINK)
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
            expect(users[0].matchingScore).to.equal(INTERESTS_WEIGHT * 10 * 10 + LINK_SITUATION_WEIGHT * NO_LINK)
          })
        })

        it('user with four interests in common has the correct score', () => {
          return UserService().getPosibleLinks(maleForFemaleWithManyInterests.Uid).then(users => {
            expect(users[2].matchingScore).to.equal(INTERESTS_WEIGHT * 4 * 10 + LINK_SITUATION_WEIGHT * NO_LINK)
          })
        })

        it('users have the commonInterests property', () => {
          return UserService().getPosibleLinks(maleForFemaleWithManyInterests.Uid).then(users => {
            expect(users[0]).to.have.property('commonInterests')
          })
        })
      })

      describe('when some of them have LinkUp Plus', () => {
        before(() => {
          // In the database they are not ordered by premium user or not
          const users = {
            [maleForFriendsAt100km.Uid]: maleForFriendsAt100km,
            [freeUserForFriends.Uid]: freeUserForFriends,
            [premiumForFriends.Uid]: premiumForFriends,
            [anotherFreeUserForFriends.Uid]: anotherFreeUserForFriends
          }
          const ref = Database('users')
          ref.set(users)
        })

        it('orders by premium users', () => {
          return UserService().getPosibleLinks(maleForFriendsAt100km.Uid).then(users => {
            expect(users.length).to.equal(3)
            expect(users[0].Uid).to.equal(premiumForFriends.Uid)
          })
        })

        it('premium user has the correct score', () => {
          return UserService().getPosibleLinks(maleForFriendsAt100km.Uid).then(users => {
            expect(users[0].matchingScore).to.equal(LINK_UP_PLUS_WEIGHT * 100 + LINK_SITUATION_WEIGHT * NO_LINK)
          })
        })
      })

      describe('when they have some link situation', () => {
        before(() => {
          const users = {
            [maleForFriendsAt100km.Uid]: maleForFriendsAt100km,
            [freeUserForFriends.Uid]: freeUserForFriends,
            [anotherFreeUserForFriends.Uid]: anotherFreeUserForFriends,
            [lastFreeUserForFriends.Uid]: lastFreeUserForFriends,
            [yetAnotherFreeUserForFriends.Uid]: yetAnotherFreeUserForFriends
          }
          const usersRef = Database('users')
          usersRef.set(users)

          const links = {
            [lastFreeUserForFriends.Uid]: {
              [maleForFriendsAt100km.Uid]: 'normal'
            },
            [anotherFreeUserForFriends.Uid]: {
              [maleForFriendsAt100km.Uid]: 'superlink'
            }
          }
          const linksRef = Database('links')
          linksRef.set(links)

          const unlinks = {
            [freeUserForFriends.Uid]: {
              [maleForFriendsAt100km.Uid]: true
            }
          }
          const unlinksRef = Database('unlinks')
          unlinksRef.set(unlinks)
        })

        it('orders by links situations', () => {
          return UserService().getPosibleLinks(maleForFriendsAt100km.Uid).then(users => {
            expect(users.length).to.equal(4)
            expect(users[0].Uid).to.equal(anotherFreeUserForFriends.Uid)
            expect(users[1].Uid).to.equal(lastFreeUserForFriends.Uid)
            expect(users[2].Uid).to.equal(yetAnotherFreeUserForFriends.Uid)
            expect(users[3].Uid).to.equal(freeUserForFriends.Uid)
          })
        })

        it('user that has superlinked has the correct score', () => {
          return UserService().getPosibleLinks(maleForFriendsAt100km.Uid).then(users => {
            expect(users[0].matchingScore).to.equal(LINK_SITUATION_WEIGHT * SUPERLINK)
          })
        })

        it('user that has linked has the correct score', () => {
          return UserService().getPosibleLinks(maleForFriendsAt100km.Uid).then(users => {
            expect(users[1].matchingScore).to.equal(LINK_SITUATION_WEIGHT * LINK)
          })
        })

        it('user that has not linked nor unlinked has the correct score', () => {
          return UserService().getPosibleLinks(maleForFriendsAt100km.Uid).then(users => {
            expect(users[2].matchingScore).to.equal(LINK_SITUATION_WEIGHT * NO_LINK)
          })
        })

        it('user that has unlinked has the correct score', () => {
          return UserService().getPosibleLinks(maleForFriendsAt100km.Uid).then(users => {
            expect(users[3].matchingScore).to.equal(LINK_SITUATION_WEIGHT * UNLINK)
          })
        })
      })
    })
  })

  describe('#updateAvailableSuperlinks()', () => {
    describe('when there are users that have consumed some superlinks', () => {
      const usersRef = Database('users')
      before(() => {
        const freeUser = new User().male().withAvailableSuperlinks(4).get()
        const premiumUser = new User().male().premium().withAvailableSuperlinks(2).get()

        const users = {
          [freeUser.Uid]: freeUser,
          [premiumUser.Uid]: premiumUser
        }
        usersRef.set(users)
      })

      it('updates the users availableSuperlinks property', () => {
        return UserService().updateAvailableSuperlinks().then(() => {
          return usersRef.once('value').then(users => {
            users.forEach(user => {
              const userJson = user.val()
              const superlinks = userJson.linkUpPlus ? PREMIUM_SUPERLINKS : FREE_SUPERLINKS
              expect(userJson.availableSuperlinks).to.equal(superlinks)
            })
          })
        })
      })
    })
  })

  describe('#updateUserActivity(uid)', () => {
    const activeUsersRef = Database('activeUsers')
    const usersRef = Database('users')
    const freeUser = new User().male().get()
    const premiumUser = new User().male().premium().get()
    const users = {
      [freeUser.Uid]: freeUser,
      [premiumUser.Uid]: premiumUser
    }
    const currentDate = getActualDate()

    before(() => {
      usersRef.set(users)
    })

    describe('when an inactive user makes an activity', () => {
      before(() => {
        activeUsersRef.set({})
      })

      it('updates the activeUsers for the freeUser', () => {
        return UserService().updateUserActivity(freeUser.Uid).then(() => {
          return activeUsersRef.child(`${currentDate}/users/${freeUser.Uid}`).once('value').then(snapshot => {
            expect(snapshot.exists()).to.be.true
          })
        })
      })

      it('updates the activeUsers for the premiumUser', () => {
        return UserService().updateUserActivity(premiumUser.Uid).then(() => {
          return activeUsersRef.child(`${currentDate}/users/${premiumUser.Uid}`).once('value')
            .then(snapshot => {
              expect(snapshot.exists()).to.be.true
            })
        })
      })

      it('does not update the activeUsers in premiumUsers for the freeUser', () => {
        return UserService().updateUserActivity(freeUser.Uid).then(() => {
          return activeUsersRef.child(`${currentDate}/premiumUsers/${freeUser.Uid}`).once('value')
            .then(snapshot => {
              expect(snapshot.exists()).to.be.false
            })
        })
      })

      it('updates the activeUsers in premiumUsers for the premiumUser', () => {
        return UserService().updateUserActivity(premiumUser.Uid).then(() => {
          return activeUsersRef.child(`${currentDate}/premiumUsers/${premiumUser.Uid}`).once('value')
            .then(snapshot => {
              expect(snapshot.exists()).to.be.true
            })
        })
      })
    })

    describe('when an already active user makes an activity', () => {
      describe('when user have not changed his premium status', () => {
        before(() => {
          const activeUsers = {
            users: {
              [freeUser.Uid]: true,
              [premiumUser.Uid]: true
            },
            premiumUsers: {
              [premiumUser.Uid]: true
            }
          }
          activeUsersRef.set(activeUsers)
          usersRef.set(users)
        })

        it('updates the activeUsers for the freeUser', () => {
          return UserService().updateUserActivity(freeUser.Uid).then(() => {
            return activeUsersRef.child(`${currentDate}/users/${freeUser.Uid}`).once('value')
              .then(snapshot => {
                expect(snapshot.exists()).to.be.true
              })
          })
        })

        it('updates the activeUsers for the premiumUser', () => {
          return UserService().updateUserActivity(premiumUser.Uid).then(() => {
            return activeUsersRef.child(`${currentDate}/users/${premiumUser.Uid}`).once('value')
              .then(snapshot => {
                expect(snapshot.exists()).to.be.true
              })
          })
        })

        it('does not update the activeUsers in premiumUsers for the freeUser', () => {
          return UserService().updateUserActivity(freeUser.Uid).then(() => {
            return activeUsersRef.child(`${currentDate}/premiumUsers/${freeUser.Uid}`).once('value')
              .then(snapshot => {
                expect(snapshot.exists()).to.be.false
              })
          })
        })

        it('updates the activeUsers in premiumUsers for the premiumUser', () => {
          return UserService().updateUserActivity(premiumUser.Uid).then(() => {
            return activeUsersRef.child(`${currentDate}/premiumUsers/${premiumUser.Uid}`).once('value')
              .then(snapshot => {
                expect(snapshot.exists()).to.be.true
              })
          })
        })
      })

      describe('when user have changed his premium status', () => {
        before(() => {
          const activeUsers = {
            users: {
              [freeUser.Uid]: true,
              [premiumUser.Uid]: true
            },
            premiumUsers: {
              [premiumUser.Uid]: true
            }
          }
          activeUsersRef.set(activeUsers)

          // They change their premium status
          const newUsers = {
            [freeUser.Uid]: { ...freeUser, linkUpPlus: true },
            [premiumUser.Uid]: { ...premiumUser, linkUpPlus: false }
          }
          usersRef.set(newUsers)
        })

        it('updates the activeUsers for the freeUser', () => {
          return UserService().updateUserActivity(freeUser.Uid).then(() => {
            return activeUsersRef.child(`${currentDate}/users/${freeUser.Uid}`).once('value')
              .then(snapshot => {
                expect(snapshot.exists()).to.be.true
              })
          })
        })

        it('updates the activeUsers for the premiumUser', () => {
          return UserService().updateUserActivity(premiumUser.Uid).then(() => {
            return activeUsersRef.child(`${currentDate}/users/${premiumUser.Uid}`).once('value')
              .then(snapshot => {
                expect(snapshot.exists()).to.be.true
              })
          })
        })

        it('updates the activeUsers in premiumUsers for the freeUser (now premium)', () => {
          return UserService().updateUserActivity(freeUser.Uid).then(() => {
            return activeUsersRef.child(`${currentDate}/premiumUsers/${freeUser.Uid}`).once('value')
              .then(snapshot => {
                expect(snapshot.exists()).to.be.true
              })
          })
        })

        it('updates the activeUsers in premiumUsers for the premiumUser (now free)', () => {
          return UserService().updateUserActivity(premiumUser.Uid).then(() => {
            return activeUsersRef.child(`${currentDate}/premiumUsers/${premiumUser.Uid}`).once('value')
              .then(snapshot => {
                expect(snapshot.exists()).to.be.false
              })
          })
        })
      })
    })
  })

  describe('#getActiveUsers(startDate, endDate)', () => {
    const activeUsersRef = Database('activeUsers')
    const allActiveUsers = {
      '2017-09': {
        'users': 2,
        'premiumUsers': 1
      },
      '2017-10': {
        'users': 4,
        'premiumUsers': 2
      },
      '2017-11': {
        'users': 1,
        'premiumUsers': 0
      }
    }

    describe('when there are no activeUsers', () => {
      before(() => {
        activeUsersRef.set({})
      })

      describe('when calling without dates', () => {
        it('returns an empty hash', () => {
          return UserService().getActiveUsers().then(users => {
            expect(users).to.be.empty
          })
        })
      })

      describe('when calling with dates', () => {
        it('returns an empty hash', () => {
          return UserService().getActiveUsers('2017-09', '2017-11').then(users => {
            expect(users).to.be.empty
          })
        })
      })
    })

    describe('when there are activeUsers', () => {
      before(() => {
        const activeUsers = {
          '2017-09': {
            'users': {
              'user1': true,
              'user2': true
            },
            'premiumUsers': {
              'user2': true
            }
          },
          '2017-10': {
            'users': {
              'user1': true,
              'user2': true,
              'user3': true,
              'user4': true
            },
            'premiumUsers': {
              'user1': true,
              'user3': true
            }
          },
          '2017-11': {
            'users': {
              'user1': true
            }
          }
        }
        activeUsersRef.set(activeUsers)
      })

      describe('when calling without dates', () => {
        it('returns all active users', () => {
          return UserService().getActiveUsers().then(users => {
            expect(users).to.deep.equal(allActiveUsers)
          })
        })

        it('returns all active users', () => {
          return UserService().getActiveUsers('undefined', 'undefined').then(users => {
            expect(users).to.deep.equal(allActiveUsers)
          })
        })
      })

      describe('when calling only with startDate', () => {
        it('returns data since then until today', () => {
          return UserService().getActiveUsers('2017-08').then(users => {
            expect(users).to.deep.equal({
              ...allActiveUsers,
              '2017-08': {
                'users': 0,
                'premiumUsers': 0
              }
            })
          })
        })
      })

      describe('when calling only with endDate', () => {
        it('returns data since the first day of data until endDate', () => {
          return UserService().getActiveUsers(undefined, '2017-10').then(users => {
            expect(users).to.deep.equal({
              '2017-09': {
                'users': 2,
                'premiumUsers': 1
              },
              '2017-10': {
                'users': 4,
                'premiumUsers': 2
              }
            })
          })
        })

        it('returns data since the first day of data until endDate', () => {
          return UserService().getActiveUsers(undefined, '2017-12').then(users => {
            expect(users).to.deep.equal({
              ...allActiveUsers,
              '2017-12': {
                'users': 0,
                'premiumUsers': 0
              }
            })
          })
        })
      })

      describe('when calling with dates', () => {
        describe('when calling with all available dates', () => {
          it('returns data between those dates', () => {
            return UserService().getActiveUsers('2017-09', '2017-11').then(users => {
              expect(users).to.deep.equal(allActiveUsers)
            })
          })
        })

        describe('when calling with more dates than available', () => {
          it('returns data between those dates', () => {
            return UserService().getActiveUsers('2017-08', '2017-12').then(users => {
              expect(users).to.deep.equal({
                ...allActiveUsers,
                '2017-08': {
                  'users': 0,
                  'premiumUsers': 0
                },
                '2017-12': {
                  'users': 0,
                  'premiumUsers': 0
                }
              })
            })
          })
        })

        describe('when calling with a subset of the available dates', () => {
          it('returns data between those dates', () => {
            return UserService().getActiveUsers('2017-10', '2017-11').then(users => {
              expect(users).to.deep.equal({
                '2017-10': {
                  'users': 4,
                  'premiumUsers': 2
                },
                '2017-11': {
                  'users': 1,
                  'premiumUsers': 0
                }
              })
            })
          })
        })

        describe('when calling with dates without data', () => {
          it('returns an empty hash', () => {
            return UserService().getActiveUsers('2017-12', '2018-02').then(users => {
              expect(users).to.deep.equal({
                '2017-12': {
                  'users': 0,
                  'premiumUsers': 0
                },
                '2018-01': {
                  'users': 0,
                  'premiumUsers': 0
                },
                '2018-02': {
                  'users': 0,
                  'premiumUsers': 0
                }
              })
            })
          })
        })
      })
    })
  })
})
