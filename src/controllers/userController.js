import UserService from '../services/userService'
import AdsService from '../services/adsService'

export default function UserController() {
  return {
    getUsersForUser: userUid => {
      return UserService().getPosibleLinks(userUid).then(users => {
        return AdsService().getRandomActiveAd().then(ad => {
          if (users.length === 0) {
            return []
          }
          users.forEach(user => {
            user.type = 'user'
          })
          // if there is no ad to add
          if (!ad) {
            return users
          }
          ad.type = 'ad'
          users.splice(Math.floor(Math.random() * users.length), 0, ad)
          return users
        })
      })
    }
  }
}
