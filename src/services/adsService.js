import Database from './gateway/database'
import Validator from 'jsonschema'
import adSchema from './schemas/adSchema'

export default function AdsService() {
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

  return {
    getAllAds: () => {
      const adsRef = Database('ads')
      const adsArray = []
      return adsRef.once('value').then(ads => {
        ads.forEach(ad => {
          const completeAd = ad.val()
          completeAd.uid = ad.key
          adsArray.push(completeAd)
        })
      }).then(() => adsArray)
    },

    deleteAd: adUid => {
      return Database('ads').child(adUid).remove()
    },

    createAd: ad => {
      const adsRef = Database('ads')
      const correctness = validateAd(ad)
      if (!correctness.result) {
        return Promise.reject(correctness.message)
      }
      return adsRef.push({
        title: ad.title,
        image: ad.image,
        state: ad.state
      })
    }
  }
}
