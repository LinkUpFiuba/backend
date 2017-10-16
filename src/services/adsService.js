import Database from './gateway/database'

export default function AdsService() {
  const getAllAds = () => {
    const adsRef = Database('ads')
    const adsArray = []
    return adsRef.once('value').then(ads => {
      ads.forEach(ad => {
        adsArray.push(ad.val())
      })
    }).then(() => adsArray)
  }

  return {
    getAllAds: getAllAds,

    // return undefined if there is no ad to show
    getRandomAd: () => {
      return getAllAds().then(ads => {
        if (ads.length === 0) {
          return
        }
        return ads[Math.floor(Math.random() * ads.length)]
      })
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
