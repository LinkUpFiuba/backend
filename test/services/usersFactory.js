export class User {
  static id = 0

  constructor() {
    this.user = {
      Uid: User.id.toString(),
      gender: undefined,
      age: 23,
      maxDistance: 50,
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
      }
    }
    User.id += 1
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

  get() {
    return this.user
  }
}
