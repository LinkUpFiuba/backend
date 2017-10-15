import Database from './gateway/database'

export default function AdsService() {
  return {
    getAllAds: () => {
      const adsRef = Database('ads')
      const adsArray = []
      return adsRef.once('value').then(ads => {
        ads.forEach(ad => {
          adsArray.push(ad.val())
        })
      }).then(() => adsArray)
    },

    deleteAd: adUid => {
      return Database('ads').child(adUid).remove()
    }
  }
}
