import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, before, it } from 'mocha'
import Database from '../../src/services/gateway/database'
import AdsService from '../../src/services/adsService'
import { Ad } from './adsFactory'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('adsService', () => {
  describe('getAllAds', () => {
    const googleAd = new Ad('Google', 'Google image').get()
    const facebookAd = new Ad('Facebook', 'Facebook image').get()

    before(() => {
      Database('ads').set({})
    })

    describe('when there is zero ads', () => {
      it('should return non ad', () => {
        return AdsService().getAllAds().then(ads => {
          expect(ads.length).to.equal(0)
        })
      })
    })

    describe('when there is one ad', () => {
      before(() => {
        const ads = {
          [googleAd.id]: googleAd
        }
        Database('ads').set(ads)
      })

      it('should return one ad', () => {
        return AdsService().getAllAds().then(ads => {
          expect(ads.length).to.equal(1)
          expect(ads[0].id).to.equal(googleAd.id)
        })
      })

      describe('when there are two ads', () => {
        before(() => {
          const ads = {
            [googleAd.id]: googleAd,
            [facebookAd.id]: facebookAd
          }
          Database('ads').set(ads)
        })

        it('should return one ad', () => {
          return AdsService().getAllAds().then(ads => {
            expect(ads.length).to.equal(2)
            expect(ads[0].id).to.equal(googleAd.id)
            expect(ads[1].id).to.equal(facebookAd.id)
          })
        })
      })
    })
  })

  describe('createAd', () => {
    const googleAd = new Ad('Google', 'Google image').active().get()
    const facebookAd = new Ad('Facebook', 'Facebook image').active().get()

    before(() => {
      Database('ads').set({})
    })

    describe('bad schema', () => {
      it('should respond with error if ad is empty', () => {
        return AdsService().createAd({})
          .then(() => {
            return Promise.reject(new Error('Expected method to reject.'))
          })
          .catch(() => {
            return true
          })
      })

      it('should responde with error if title is undefined', () => {
        return AdsService().createAd({
          image: facebookAd.image,
          state: facebookAd.state
        })
          .then(() => {
            return Promise.reject(new Error('Expected method to reject.'))
          })
          .catch(() => {
            return true
          })
      })

      it('should responde with error if image undefined', () => {
        return AdsService().createAd({
          title: facebookAd.title,
          state: facebookAd.state
        })
          .then(() => {
            return Promise.reject(new Error('Expected method to reject.'))
          })
          .catch(() => {
            return true
          })
      })

      it('should responde with error if state is undefined', () => {
        return AdsService().createAd({
          title: facebookAd.title,
          image: facebookAd.image
        })
          .then(() => {
            return Promise.reject(new Error('Expected method to reject.'))
          })
          .catch(() => {
            return true
          })
      })
    })

    describe('when there is zero ads', () => {
      it('should add the ad', () => {
        return AdsService().createAd({
          title: facebookAd.title,
          image: facebookAd.image,
          state: facebookAd.state
        }).then(() => {
          return AdsService().getAllAds().then(ads => {
            expect(ads.length).to.equal(1)
            expect(ads[0].title).to.equal(facebookAd.title)
            expect(ads[0].image).to.equal(facebookAd.image)
            expect(ads[0].state).to.equal(facebookAd.state)
          })
        })
      })
    })

    describe('when there is one ad', () => {
      before(() => {
        const ads = {
          [googleAd.id]: googleAd
        }
        Database('ads').set(ads)
      })

      it('should add the ad', () => {
        return AdsService().createAd({
          title: facebookAd.title,
          image: facebookAd.image,
          state: facebookAd.state
        }).then(() => {
          return AdsService().getAllAds().then(ads => {
            expect(ads.length).to.equal(2)
            expect(ads[1].title).to.equal(facebookAd.title)
            expect(ads[1].image).to.equal(facebookAd.image)
            expect(ads[1].state).to.equal(facebookAd.state)
          })
        })
      })
    })
  })
})
