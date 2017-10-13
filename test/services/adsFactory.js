export class Ad {
  static id = 0

  constructor(title, image) {
    this.ad = {
      id: Ad.id.toString(),
      title: title,
      image: image
    }
    Ad.id += 1
  }

  active() {
    this.ad.state = 'active'
    return this
  }

  disable() {
    this.ad.state = 'disable'
    return this
  }

  get() {
    return this.ad
  }
}
