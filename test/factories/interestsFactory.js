export class Interest {
  static id = 0

  constructor(name) {
    this.interest = {
      id: Interest.id.toString(),
      name: name
    }
    Interest.id += 1
  }

  get() {
    return this.interest
  }
}
