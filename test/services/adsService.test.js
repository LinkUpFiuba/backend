import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {describe, before, it} from 'mocha'
import Database from '../../src/services/gateway/database'
import AdsService from '../../src/services/adsService'
import {Ad} from './adsFactory'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('complaintService', () => {
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

  describe('deleteAd', () => {
    const googleAd = new Ad('Google', 'Google image').get()
    const facebookAd = new Ad('Facebook', 'Facebook image').get()

    before(() => {
      Database('ads').set({})
    })

    describe('when there is zero ads', () => {
      it('should return non ad', () => {
        return AdsService().deleteAd(googleAd.id).then(() => {
          return true
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

      it('should delete the ad', () => {
        return AdsService().deleteAd(googleAd.id).then(() => {
          return AdsService().getAllAds().then(ads => {
            expect(ads.length).to.equal(0)
          })
        })
      })
    })

    describe('when there are two ad', () => {
      before(() => {
        const ads = {
          [googleAd.id]: googleAd,
          [facebookAd.id]: facebookAd
        }
        Database('ads').set(ads)
      })

      it('should delete the ad and it should be still one ad', () => {
        return AdsService().deleteAd(googleAd.id).then(() => {
          return AdsService().getAllAds().then(ads => {
            expect(ads.length).to.equal(1)
            expect(ads[0].id).to.equal(facebookAd.id)
          })
        })
      })
    })
  })
})
