export class Ad {
  static id = 0

  constructor(title, image) {
    this.ad = {
      id: Ad.id.toString(),
      title: title,
      image: image,
      target: 'all',
      ageRange: {
        min: 18,
        max: 100
      }
    }
    Ad.id += 1
  }

  ageRange(ageRange) {
    this.ad.ageRange = ageRange
    return this
  }

  active() {
    this.ad.state = 'Active'
    return this
  }

  disabled() {
    this.ad.state = 'Disabled'
    return this
  }

  forAll() {
    this.ad.target = 'all'
    return this
  }

  forMale() {
    this.ad.target = 'male'
    return this
  }

  forFemale() {
    this.ad.target = 'female'
    return this
  }

  get() {
    return this.ad
  }
}
