import Database from './gateway/database'
import * as Validator from 'jsonschema'
import adSchema from './schemas/adSchema'

export default function AdsService() {
  const getAllAds = state => {
    const adsArray = []
    const adsRef = state ? Database('ads').orderByChild('state').equalTo(state) : Database('ads')
    return adsRef.once('value').then(ads => {
      ads.forEach(ad => {
        const completeAd = ad.val()
        completeAd.uid = ad.key
        adsArray.push(completeAd)
      })
    }).then(() => adsArray)
  }

  const validateAd = ad => {
    const correctness = {}
    const v = new Validator.Validator()
    const result = v.validate(ad, adSchema)
    if (result.errors.length > 0) {
      correctness.result = false
      correctness.message = result.errors
      return correctness
    }
    correctness.result = true
    return correctness
  }

  const adExists = adUid => {
    const ref = Database('ads')
    return ref.child(adUid).once('value').then(ad => {
      return ad.exists()
    })
  }

  const changeStateOfAd = (adUid, newState) => {
    return adExists(adUid).then(adExists => {
      if (!adExists) {
        return Promise.reject(new Error('That adUid does not exist'))
      }
      const updates = {}
      updates[`/${adUid}/state`] = newState
      return Database('ads').update(updates)
    })
  }

  return {
    getAllAds: getAllAds,

    // return undefined if there is no ad to show
    getRandomActiveAd: () => {
      return getAllAds('Active').then(ads => {
        if (ads.length === 0) {
          return
        }
        return ads[Math.floor(Math.random() * ads.length)]
      })
    },

    deleteAd: adUid => {
      return Database('ads').child(adUid).remove()
    },

    enableAd: adUid => {
      return changeStateOfAd(adUid, 'Active')
    },

    disableAd: adUid => {
      return changeStateOfAd(adUid, 'Disabled')
    },

    createAd: ad => {
      const adsRef = Database('ads')
      const correctness = validateAd(ad)
      if (!correctness.result) {
        return Promise.reject(correctness.message)
      }
      return adsRef.push(ad)
    }
  }
}
