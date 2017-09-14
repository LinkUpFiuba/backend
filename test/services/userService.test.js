import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before, after } from 'mocha'
import UserService from '../../src/services/userService'
import FirebaseServer from 'firebase-server'
import {
  femaleSearchForFemale, femaleSearchForFemaleAndMale,
  femaleSearchForFriends, femaleSearchForMale, maleSearchForFemale,
  maleSearchForFemaleAndMale, maleSearchForFriends,
  maleSearchForMale
} from './usersFactory'

chai.use(chaiAsPromised)
const expect = chai.expect

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

    const serchForUser = (users, userForSearch) => {
      let find = false
      users.forEach(user => {
        if (user.id === userForSearch.id) {
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
          [id10]: femaleForMaleAndFemale
        }
      }
      server = new FirebaseServer(5000, 'localhost.firebaseio.test', users)
    })

    describe('Search for friends', () => {
      it('returns all who search for friends, whatever sex', () => {
        return UserService().getPosibleLinks(maleForFriends.id).then(users => {
          expect(users.length).to.equal(2)
          expect(serchForUser(users, femaleForFriends)).to.equal(true)
          expect(serchForUser(users, maleForFriends2)).to.equal(true)
        })
      })

      it('male who search for female, does not find a female who search for friends', () => {
        return UserService().getPosibleLinks(maleForFemale.id).then(users => {
          expect(serchForUser(users, femaleForFriends)).to.equal(false)
        })
      })
    })

    describe('Search for people of one gender', () => {
      it('male search for female', () => {
        return UserService().getPosibleLinks(maleForFemale.id).then(users => {
          expect(users.length).to.equal(2)
          expect(serchForUser(users, femaleForMale)).to.equal(true)
        })
      })

      it('male search for male', () => {
        return UserService().getPosibleLinks(maleForMale.id).then(users => {
          expect(users.length).to.equal(2)
          expect(serchForUser(users, maleForMale2)).to.equal(true)
        })
      })

      it('male search for male inverse', () => {
        return UserService().getPosibleLinks(maleForMale2.id).then(users => {
          expect(users.length).to.equal(2)
          expect(serchForUser(users, maleForMale)).to.equal(true)
        })
      })

      it('male search for male and female', () => {
        return UserService().getPosibleLinks(maleForMaleAndFemale.id).then(users => {
          expect(users.length).to.equal(4)
          expect(serchForUser(users, maleForMale2)).to.equal(true)
          expect(serchForUser(users, maleForMale)).to.equal(true)
          expect(serchForUser(users, femaleForMale)).to.equal(true)
          expect(serchForUser(users, femaleForMaleAndFemale)).to.equal(true)
        })
      })

      it('female search for male', () => {
        return UserService().getPosibleLinks(femaleForMale.id).then(users => {
          expect(serchForUser(users, maleForFemale)).to.equal(true)
        })
      })

      it('female search for female', () => {
        return UserService().getPosibleLinks(femaleForFemale.id).then(users => {
          expect(users.length).to.equal(1)
          expect(serchForUser(users, femaleForMaleAndFemale)).to.equal(true)
        })
      })

      it('female search for male and female', () => {
        return UserService().getPosibleLinks(femaleForMaleAndFemale.id).then(users => {
          expect(users.length).to.equal(3)
          expect(serchForUser(users, femaleForFemale)).to.equal(true)
          expect(serchForUser(users, maleForFemale)).to.equal(true)
          expect(serchForUser(users, maleForMaleAndFemale)).to.equal(true)
        })
      })
    })

    after(() => {
      server.close(console.log('— firebase server closed -'))
    })
  })
})
