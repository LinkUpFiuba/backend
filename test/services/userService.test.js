import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before, after } from 'mocha'
import UserService from '../../src/services/userService'
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

// De 50 para arriba no importa el ragno, los tests sobre la edad son por debjo de 50
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
    const anotherSolariFemaleForFemaleInPosition3 = anotherSolariFemaleSearchForFemaleInPosition3(id19)
    const serchForUser = (users, userForSearch) => {
      let find = false
      users.forEach(user => {
        if (user.Uid === userForSearch.Uid) {
          find = true
        }
      })
      return find
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
      it('returns all who search for friends, whatever sex', () => {
        return UserService().getPosibleLinks(maleForFriends.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(serchForUser(users, femaleForFriends)).to.equal(true)
          expect(serchForUser(users, maleForFriends2)).to.equal(true)
        })
      })

      it('male who search for female, does not find a female who search for friends', () => {
        return UserService().getPosibleLinks(maleForFemale.Uid).then(users => {
          expect(serchForUser(users, femaleForFriends)).to.equal(false)
        })
      })
    })

    describe('Search for people of one gender', () => {
      it('male search for female', () => {
        return UserService().getPosibleLinks(maleForFemale.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(serchForUser(users, femaleForMale)).to.equal(true)
        })
      })

      it('male search for male', () => {
        return UserService().getPosibleLinks(maleForMale.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(serchForUser(users, maleForMale2)).to.equal(true)
        })
      })

      it('male search for male inverse', () => {
        return UserService().getPosibleLinks(maleForMale2.Uid).then(users => {
          expect(users.length).to.equal(2)
          expect(serchForUser(users, maleForMale)).to.equal(true)
        })
      })

      it('male search for male and female', () => {
        return UserService().getPosibleLinks(maleForMaleAndFemale.Uid).then(users => {
          expect(users.length).to.equal(4)
          expect(serchForUser(users, maleForMale2)).to.equal(true)
          expect(serchForUser(users, maleForMale)).to.equal(true)
          expect(serchForUser(users, femaleForMale)).to.equal(true)
          expect(serchForUser(users, femaleForMaleAndFemale)).to.equal(true)
        })
      })

      it('female search for male', () => {
        return UserService().getPosibleLinks(femaleForMale.Uid).then(users => {
          expect(serchForUser(users, maleForFemale)).to.equal(true)
        })
      })

      it('female search for female', () => {
        return UserService().getPosibleLinks(femaleForFemale.Uid).then(users => {
          expect(users.length).to.equal(1)
          expect(serchForUser(users, femaleForMaleAndFemale)).to.equal(true)
        })
      })

      it('female search for male and female', () => {
        return UserService().getPosibleLinks(femaleForMaleAndFemale.Uid).then(users => {
          expect(users.length).to.equal(3)
          expect(serchForUser(users, femaleForFemale)).to.equal(true)
          expect(serchForUser(users, maleForFemale)).to.equal(true)
          expect(serchForUser(users, maleForMaleAndFemale)).to.equal(true)
        })
      })
    })

    describe('Test age range', () => {
      it('male search for female within range', () => {
        return UserService().getPosibleLinks(maleForFemaleInAgeRange.Uid).then(users => {
          expect(users.length).to.equal(1)
          expect(serchForUser(users, femaleForMaleInAgeRange)).to.equal(true)
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
          expect(serchForUser(users, femaleForMaleAndFemale)).to.equal(true)
        })
      })

      it('Female for friends can search like always', () => {
        return UserService().getPosibleLinks(femaleForFriendsInvisibleMode.Uid).then(users => {
          expect(users.length).to.equal(3)
          expect(serchForUser(users, femaleForFriends)).to.equal(true)
          expect(serchForUser(users, maleForFriends)).to.equal(true)
          expect(serchForUser(users, maleForFriends2)).to.equal(true)
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
          expect(serchForUser(users, anotherSolariFemaleForFemaleInPosition3)).to.equal(true)
        })
      })

      it('Solari female for friends only find one friend in same spot', () => {
        return UserService().getPosibleLinks(solariFemaleForFriends.Uid).then(users => {
          expect(users.length).to.equal(1)
          expect(serchForUser(users, solariFemaleForFriends2)).to.equal(true)
        })
      })
    })

    after(() => {
      server.close(console.log('— firebase server closed -'))
    })
  })
})
