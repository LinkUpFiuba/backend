import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, before, it } from 'mocha'
import Database from '../../src/services/gateway/database'
import AdsService from '../../src/services/adsService'
import { Ad } from '../Factories/adsFactory'

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
    })

    describe('when there are two ads', () => {
      before(() => {
        const ads = {
          [googleAd.id]: googleAd,
          [facebookAd.id]: facebookAd
        }
        Database('ads').set(ads)
      })

      it('should return two ads', () => {
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
      it('should return no ad', () => {
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

    describe('when there are two ads', () => {
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

  describe('getRandomActiveAd', () => {
    const googleActiveAd = new Ad('Google', 'Google image').active().get()
    const facebookDisableAd = new Ad('Facebook', 'Facebook image').disable().get()

    describe('when there is zero ads', () => {
      before(() => {
        Database('ads').set({})
      })

      it('should return undefined', () => {
        return AdsService().getRandomActiveAd().then(ad => {
          expect(ad).to.equal()
        })
      })
    })

    describe('when there is one active ad', () => {
      before(() => {
        const ads = {
          [googleActiveAd.id]: googleActiveAd
        }
        Database('ads').set(ads)
      })

      it('should return the ad', () => {
        return AdsService().getRandomActiveAd().then(ad => {
          expect(ad.uid).to.equal(googleActiveAd.id)
        })
      })
    })

    describe('when there is one disable ad', () => {
      before(() => {
        const ads = {
          [facebookDisableAd.id]: facebookDisableAd
        }
        Database('ads').set(ads)
      })

      it('should return undefined', () => {
        return AdsService().getRandomActiveAd().then(ad => {
          expect(ad).to.equal()
        })
      })
    })

    describe('when there is one disable and one enable', () => {
      before(() => {
        const ads = {
          [facebookDisableAd.id]: facebookDisableAd,
          [googleActiveAd.id]: googleActiveAd
        }
        Database('ads').set(ads)
      })

      it('should return the enable ad', () => {
        return AdsService().getRandomActiveAd().then(ad => {
          expect(ad.uid).to.equal(googleActiveAd.id)
        })
      })
    })
  })

  describe('enableAd', () => {
    const googleActiveAd = new Ad('Google', 'Google image').active().get()
    const facebookDisableAd = new Ad('Facebook', 'Facebook image').disabled().get()

    before(() => {
      Database('ads').set({})
    })

    describe('when the ad does not exists', () => {
      before(() => {
        Database('ads').set({})
      })

      it('should raise an error', () => {
        return AdsService().enableAd(googleActiveAd.id)
          .then(() => {
            return Promise.reject(new Error('Expected method to reject.'))
          })
          .catch(() => {
            return true
          })
      })
    })

    describe('when there is only one ad and it is enable', () => {
      before(() => {
        const ads = {
          [googleActiveAd.id]: googleActiveAd
        }
        Database('ads').set(ads)
      })

      it('should do nothing', () => {
        return AdsService().enableAd(googleActiveAd.id).then(() => {
          return AdsService().getAllAds().then(ads => {
            expect(ads[0].uid).to.equal(googleActiveAd.id)
            expect(ads[0].state).to.equal('Active')
          })
        })
      })
    })

    describe('when there is only one ad and it is disabled', () => {
      before(() => {
        const ads = {
          [facebookDisableAd.id]: facebookDisableAd
        }
        Database('ads').set(ads)
      })

      it('should enable the ad', () => {
        return AdsService().enableAd(facebookDisableAd.id).then(() => {
          return AdsService().getAllAds().then(ads => {
            expect(ads[0].uid).to.equal(facebookDisableAd.id)
            expect(ads[0].state).to.equal('Active')
          })
        })
      })
    })

    describe('when there are two ads: one enabled and one disabled', () => {
      before(() => {
        const ads = {
          [facebookDisableAd.id]: facebookDisableAd,
          [googleActiveAd.id]: googleActiveAd
        }
        Database('ads').set(ads)
      })

      it('should enable the disabled ad', () => {
        return AdsService().enableAd(facebookDisableAd.id).then(() => {
          return AdsService().getAllAds().then(ads => {
            expect(ads[1].uid).to.equal(facebookDisableAd.id)
            expect(ads[1].state).to.equal('Active')
            expect(ads[0].uid).to.equal(googleActiveAd.id)
            expect(ads[0].state).to.equal('Active')
          })
        })
      })
    })
  })

  describe('disable', () => {
    const googleActiveAd = new Ad('Google', 'Google image').active().get()
    const facebookDisableAd = new Ad('Facebook', 'Facebook image').disabled().get()

    before(() => {
      Database('ads').set({})
    })

    describe('when the ad does not exists', () => {
      before(() => {
        Database('ads').set({})
      })

      it('should raise an error', () => {
        return AdsService().disableAd(googleActiveAd.id)
          .then(() => {
            return Promise.reject(new Error('Expected method to reject.'))
          })
          .catch(() => {
            return true
          })
      })
    })

    describe('when there is only one ad and it is disabled', () => {
      before(() => {
        const ads = {
          [facebookDisableAd.id]: facebookDisableAd
        }
        Database('ads').set(ads)
      })

      it('should do nothing', () => {
        return AdsService().disableAd(facebookDisableAd.id).then(() => {
          return AdsService().getAllAds().then(ads => {
            expect(ads[0].uid).to.equal(facebookDisableAd.id)
            expect(ads[0].state).to.equal('Disabled')
          })
        })
      })
    })

    describe('when there is only one ad and it is enabled', () => {
      before(() => {
        const ads = {
          [googleActiveAd.id]: googleActiveAd
        }
        Database('ads').set(ads)
      })

      it('should disable the ad', () => {
        return AdsService().disableAd(googleActiveAd.id).then(() => {
          return AdsService().getAllAds().then(ads => {
            expect(ads[0].uid).to.equal(googleActiveAd.id)
            expect(ads[0].state).to.equal('Disabled')
          })
        })
      })
    })

    describe('when there are two ads: one enabled and one disabled', () => {
      before(() => {
        const ads = {
          [facebookDisableAd.id]: facebookDisableAd,
          [googleActiveAd.id]: googleActiveAd
        }
        Database('ads').set(ads)
      })

      it('should disable the enable ad', () => {
        return AdsService().disableAd(googleActiveAd.id).then(() => {
          return AdsService().getAllAds().then(ads => {
            expect(ads[1].uid).to.equal(facebookDisableAd.id)
            expect(ads[1].state).to.equal('Disabled')
            expect(ads[0].uid).to.equal(googleActiveAd.id)
            expect(ads[0].state).to.equal('Disabled')
          })
        })
      })
    })
  })
})
