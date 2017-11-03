export class Ad {
  static id = 0

  constructor(title, image) {
    this.ad = {
      id: Ad.id.toString(),
      title: title,
      image: image,
      ageRange: { min: 18, max: 100 },
      target: 'All'
    }
    Ad.id += 1
  }

  setAgeRange(ageRange) {
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
    this.ad.target = 'All'
    return this
  }

  forMale() {
    this.ad.target = 'Male'
    return this
  }

  forFemale() {
    this.ad.target = 'Female'
    return this
  }

  get() {
    return this.ad
  }
}
