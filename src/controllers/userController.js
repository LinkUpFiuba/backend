import UserService from '../services/userService'
import AdsService from '../services/adsService'

export default function UserController() {
  return {
    getUsersForUser: userUid => {
      return UserService().getPosibleLinks(userUid).then(users => {
        return UserService().hasLinkUpPlus(userUid).then(hasLinkUpPlus => {
          return AdsService().getRandomActiveAd().then(ad => {
            if (users.length === 0) {
              return []
            }
            users.forEach(user => {
              user.type = 'user'
            })
            // If there is no ad to add or if it's a premium user we don't send ads
            if (!ad || hasLinkUpPlus) {
              return users
            }
            ad.type = 'ad'
            users.splice(Math.floor(Math.random() * users.length), 0, ad)
            return users
          })
        })
      })
    }
  }
}
