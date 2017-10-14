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
    }
  }
}
