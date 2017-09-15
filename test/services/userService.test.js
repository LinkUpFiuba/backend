import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before, after } from 'mocha'
import UserService from '../../src/services/userService'
// import Database from '../../src/services/gateway/database'
import FirebaseServer from 'firebase-server'
import {
  anotherSolariFemaleSearchForFemaleInPosition3,
  femaleSearchForFemale, femaleSearchForFemaleAndMale, femaleSearchForFemaleInvisibleMode,
  femaleSearchForFriends, femaleSearchForFriendsFarFromOthers, femaleSearchForFriendsInvisibleMode,
  femaleSearchForMale, femaleSearchForMaleInAgeRange, maleSearchForFemale,
  maleSearchForFemaleAndMale, maleSearchForFemaleInAgeRange, maleSearchForFemaleInImposibleAgeRange,
  maleSearchForFriends,
  maleSearchForMale, solariFemaleSearchForFemaleInPosition3, solariFemaleSearchForFriends
} from './usersFactory'

chai.use(chaiAsPromised)
const expect = chai.expect

// De 50 para arriba no importa el rango, los tests sobre la edad son por debajo de 50
describe('UserService', () => {
  describe('#getPosibleLinks(uid)', () => {
    let server
    const id1 = '1'
    const id2 = '2'
    const id3 = '3'
    const id4 = '4'
    const id5 = '5'
    const id6 = '6'
    const id7 = '7'
    const id8 = '8'
    const id9 = '9'
    const id10 = '10'
    const id11 = '11'
    const id12 = '12'
    const id13 = '13'
    const id14 = '14'
    const id15 = '15'
    const id16 = '16'
    const id17 = '17'
    const id18 = '18'
    const id19 = '19'
    const id20 = '20'
    const maleForFriends = maleSearchForFriends(id1)
    const maleForFriends2 = maleSearchForFriends(id4)
    const femaleForFriends = femaleSearchForFriends(id2)
    const maleForFemale = maleSearchForFemale(id3)
    const femaleForMale = femaleSearchForMale(id5)
    const maleForMale = maleSearchForMale(id6)
    const maleForMale2 = maleSearchForMale(id7)
    const maleForMaleAndFemale = maleSearchForFemaleAndMale(id8)
    const femaleForFemale = femaleSearchForFemale(id9)
    const femaleForMaleAndFemale = femaleSearchForFemaleAndMale(id10)
    const femaleForMaleInAgeRange = femaleSearchForMaleInAgeRange(id11)
    const maleForFemaleInAgeRange = maleSearchForFemaleInAgeRange(id12)
    const maleForFemaleInImposibleAgeRange = maleSearchForFemaleInImposibleAgeRange(id13)
    const femaleForFemaleInvisibleMode = femaleSearchForFemaleInvisibleMode(id14)
    const femaleForFriendsInvisibleMode = femaleSearchForFriendsInvisibleMode(id15)
    const femaleForFriendsFarFromOthers = femaleSearchForFriendsFarFromOthers(id16)
    const solariFemaleForFriends = solariFemaleSearchForFriends(id17)
    const solariFemaleForFriends2 = solariFemaleSearchForFriends(id18)
    const solariFemaleForFemaleInPosition3 = solariFemaleSearchForFemaleInPosition3(id19)
    const anotherSolariFemaleForFemaleInPosition3 = anotherSolariFemaleSearchForFemaleInPosition3(id20)

    const searchForUser = (users, userForSearch) => {
      return users.map(user => user.Uid).includes(userForSearch.Uid)
    }

    before(() => {
      const users = {
        users: {
          [id1]: maleForFriends,
          [id2]: femaleForFriends,
          [id3]: maleForFemale,
          [id4]: maleForFriends2,
          [id5]: femaleForMale,
          [id6]: maleForMale,
          [id7]: maleForMale2,
          [id8]: maleForMaleAndFemale,
          [id9]: femaleForFemale,
          [id10]: femaleForMaleAndFemale,
          [id11]: femaleForMaleInAgeRange,
          [id12]: maleForFemaleInAgeRange,
          [id13]: maleForFemaleInImposibleAgeRange,
          [id14]: femaleForFemaleInvisibleMode,
          [id15]: femaleForFriendsInvisibleMode,
          [id16]: femaleForFriendsFarFromOthers,
          [id17]: solariFemaleForFriends,
          [id18]: solariFemaleForFriends2,
          [id19]: solariFemaleForFemaleInPosition3,
          [id20]: anotherSolariFemaleForFemaleInPosition3
        }
      }
      server = new FirebaseServer(5000, 'localhost.firebaseio.test', users)
    })

    describe('Search for friends', () => {
      // before(() => {
      //   const users = {
      //     [maleForFriends.Uid]: maleForFriends,
      //     [femaleForFriends.Uid]: femaleForFriends,
      //     [maleForFriends2.Uid]: maleForFriends2
      //   }
      //   const ref = Database('users')
      //   ref.set(users)
      // })

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
      it('male search for female', () => {
        return UserService().getPosibleLinks(maleForFemale.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(searchForUser(users, femaleForMale)).to.be.true
        })
      })

      it('male search for male', () => {
        return UserService().getPosibleLinks(maleForMale.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(searchForUser(users, maleForMale2)).to.be.true
        })
      })

      it('male search for male inverse', () => {
        return UserService().getPosibleLinks(maleForMale2.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(searchForUser(users, maleForMale)).to.be.true
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
          expect(searchForUser(users, maleForFemale)).to.be.true
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

    // No se prueba que a los otros no les aparezcan, por que ya esta testeado arriba
    describe('Test for invisible mode', () => {
      it('Female for female can search like always', () => {
        return UserService().getPosibleLinks(femaleForFemaleInvisibleMode.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(searchForUser(users, femaleForMaleAndFemale)).to.be.true
        })
      })

      it('Female for friends can search like always', () => {
        return UserService().getPosibleLinks(femaleForFriendsInvisibleMode.Uid).then(users => {
          expect(users.length).to.equal(3)
          expect(searchForUser(users, femaleForFriends)).to.be.true
          expect(searchForUser(users, maleForFriends)).to.be.true
          expect(searchForUser(users, maleForFriends2)).to.be.true
        })
      })
    })

    // No se prueba que a los otros no les aparezcan, por que ya esta testeado arriba
    describe('Test for distance filter', () => {
      it('Female for friends too far from others gets nothing', () => {
        return UserService().getPosibleLinks(femaleForFriendsFarFromOthers.Uid).then(users => {
          expect(users.length).to.equal(0)
        })
      })

      it('Female for female search only one within the range (different locations)', () => {
        return UserService().getPosibleLinks(solariFemaleForFemaleInPosition3.Uid).then(users => {
          expect(users.length).to.equal(1)
          expect(searchForUser(users, anotherSolariFemaleForFemaleInPosition3)).to.be.true
        })
      })

      it('Solari female for friends only find one friend in same spot', () => {
        return UserService().getPosibleLinks(solariFemaleForFriends.Uid).then(users => {
          expect(users.length).to.equal(1)
          expect(searchForUser(users, solariFemaleForFriends2)).to.be.true
        })
      })
    })

    after(() => {
      server.close(console.log('— firebase server closed -'))
    })
  })
})
