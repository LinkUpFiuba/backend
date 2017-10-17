import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, before, it } from 'mocha'
import { Interest } from '../factories/interestsFactory'
import InterestsService from '../../src/services/interestsService'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('interestsService', () => {
  describe('getCommonInterests', () => {
    let pabloInterest
    let bocaInterest
    let adminInterest

    before(() => {
      pabloInterest = new Interest('pablo').get()
      bocaInterest = new Interest('boca').get()
      adminInterest = new Interest('admin').get()
    })

    describe('when do not have any interests in common', () => {
      let interests1
      let interests2

      before(() => {
        interests1 = {
          [pabloInterest.id]: pabloInterest
        }
        interests2 = {
          [bocaInterest.id]: bocaInterest
        }
      })

      it('Should not get any interest', () => {
        const result = InterestsService().getCommonInterests(interests1, interests2)
        expect(result.length).to.be.equal(0)
      })
    })

    describe('when they have the same interest', () => {
      let interests1
      let interests2

      before(() => {
        interests1 = {
          [pabloInterest.id]: pabloInterest
        }
        interests2 = {
          [pabloInterest.id]: pabloInterest
        }
      })

      it('Should get the interest', () => {
        const result = InterestsService().getCommonInterests(interests1, interests2)
        expect(result.length).to.be.equal(1)
        expect(result[0]).to.be.equal(pabloInterest)
      })
    })

    describe('when they have the same interests', () => {
      let interests1
      let interests2

      before(() => {
        interests1 = {
          [pabloInterest.id]: pabloInterest,
          [bocaInterest.id]: bocaInterest
        }
        interests2 = {
          [pabloInterest.id]: pabloInterest,
          [bocaInterest.id]: bocaInterest
        }
      })

      it('Should get two interests', () => {
        const result = InterestsService().getCommonInterests(interests1, interests2)
        expect(result.length).to.be.equal(2)
      })

      it('Should get the two interests', () => {
        const result = InterestsService().getCommonInterests(interests1, interests2)
        expect(result.includes(pabloInterest)).to.be.true
        expect(result.includes(bocaInterest)).to.be.true
      })
    })
    describe('when they have one interet in common (and each has others)', () => {
      let interests1
      let interests2

      before(() => {
        interests1 = {
          [pabloInterest.id]: pabloInterest,
          [adminInterest.id]: adminInterest
        }
        interests2 = {
          [pabloInterest.id]: pabloInterest,
          [bocaInterest.id]: bocaInterest
        }
      })

      it('Should get one interest', () => {
        const result = InterestsService().getCommonInterests(interests1, interests2)
        expect(result.length).to.be.equal(1)
      })

      it('Should get pabloInterets', () => {
        const result = InterestsService().getCommonInterests(interests1, interests2)
        expect(result.includes(pabloInterest)).to.be.true
      })
    })
  })
})
