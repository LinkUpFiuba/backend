export class Complaint {
    static id = 0

    constructor() {
      this.complaint = {
        idReporting: 'uid',
        message: 'message',
        state: 'new',
        id: Complaint.id
      }
      Complaint.id += 1
    }

    new() {
      this.complaint.state = 'new'
      return this
    }

    seen() {
      this.complaint.state = 'seen'
      return this
    }

    denouncerUser(denouncerUserUid) {
      this.complaint.idReporting = denouncerUserUid
      return this
    }

    get() {
      return this.complaint
    }
}
