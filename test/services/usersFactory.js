import { Interest } from './interestsFactory'

export class User {
  static id = 0

  constructor() {
    this.user = {
      Uid: User.id.toString(),
      gender: undefined,
      age: 23,
      maxDistance: 100,
      invisibleMode: false,
      range: {
        minAge: 18,
        maxAge: 28
      },
      location: {
        latitude: 20,
        longitude: 20
      },
      interests: {
        male: false,
        female: false,
        friends: false
      },
      likesList: {}
    }
    User.id += 1
    this.likesCount = 0
  }

  male() {
    this.user.gender = 'male'
    return this
  }

  female() {
    this.user.gender = 'female'
    return this
  }

  age(age) {
    this.user.age = age
    return this
  }

  maxDistance(distance) {
    this.user.maxDistance = distance
    return this
  }

  invisibleModeOn() {
    this.user.invisibleMode = true
    return this
  }

  ageRange(min, max) {
    this.user.range = {
      minAge: min,
      maxAge: max
    }
    return this
  }

  likesMale() {
    this.user.interests.male = true
    return this
  }

  likesFemale() {
    this.user.interests.female = true
    return this
  }

  likesFriends() {
    this.user.interests.friends = true
    return this
  }

  withLocation(lat, long) {
    this.user.location = {
      latitude: lat,
      longitude: long
    }
    return this
  }

  withInterest(interest) {
    this.user.likesList[(this.likesCount++).toString()] = interest
    return this
  }

  withManyInterests() {
    this.withInterest(Interests.bocaInterest)
    this.withInterest(Interests.sanLorenzoInterest)
    this.withInterest(Interests.ortigozaInterest)
    this.withInterest(Interests.benedettoInterest)
    this.withInterest(Interests.tallerInterest)
    this.withInterest(Interests.adminInterest)
    this.withInterest(Interests.fiubaInterest)
    this.withInterest(Interests.programmingInterest)
    this.withInterest(Interests.whatsappInterest)
    this.withInterest(Interests.pepeArgentoInterest)
    this.withInterest(Interests.lopilatoInterest)
    return this
  }

  withSomeInterests() {
    this.withInterest(Interests.sanLorenzoInterest)
    this.withInterest(Interests.ortigozaInterest)
    this.withInterest(Interests.tallerInterest)
    this.withInterest(Interests.fiubaInterest)
    this.withInterest(Interests.programmingInterest)
    return this
  }

  get() {
    return this.user
  }
}

export class Interests {
  static bocaInterest = new Interest('boca').get()
  static sanLorenzoInterest = new Interest('san lorenzo').get()
  static ortigozaInterest = new Interest('ortigoza').get()
  static benedettoInterest = new Interest('benedetto').get()
  static tallerInterest = new Interest('tdp II').get()
  static adminInterest = new Interest('admin I').get()
  static fiubaInterest = new Interest('fiuba').get()
  static programmingInterest = new Interest('programming').get()
  static whatsappInterest = new Interest('whatsapp').get()
  static pepeArgentoInterest = new Interest('pepe argento').get()
  static lopilatoInterest = new Interest('luisana lopilato').get()
}
