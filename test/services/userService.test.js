import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before, after } from 'mocha'
import UserService from '../../src/services/userService'
import Database from '../../src/services/gateway/database'
import FirebaseServer from 'firebase-server'
import { User } from './usersFactory'

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

    const femaleForFriendsFarFromOthers = new User().female().likesFriends().withLocation(0, 0).get()
    const solariFemaleForFriends = new User().female().likesFemale().withLocation(1, 1).get()
    const solariFemaleForFriends2 = new User().female().likesFemale().withLocation(1, 1).get()
    const solariFemaleForFemaleInPosition3 = new User().female().likesFemale().withLocation(3, 3).get()
    // eslint-disable-next-line max-len
    const anotherSolariFemaleForFemaleInPosition3 = new User().female().likesFemale().withLocation(3.1, 3.4).get()

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
      describe('when users are far from each other', () => {
        before(() => {
          const users = {
            [maleForFriends.Uid]: maleForFriends,
            [femaleForFriendsFarFromOthers.Uid]: femaleForFriendsFarFromOthers
          }
          const ref = Database('users')
          ref.set(users)
        })

        it('Female for friends too far from others gets nothing', () => {
          return UserService().getPosibleLinks(femaleForFriendsFarFromOthers.Uid).then(users => {
            expect(users.length).to.equal(0)
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

    after(() => {
      server.close(console.log('- Firebase server closed -'))
    })
  })
})
