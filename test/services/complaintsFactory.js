export class Complaint {
    static id = 0

    constructor() {
      this.complaint = {
        idReporting: 'uid',
        message: 'message',
        state: 'pending',
        id: Complaint.id
      }
      Complaint.id += 1
    }

    pending() {
      this.complaint.state = 'pending'
      return this
    }

    rejected() {
      this.complaint.state = 'rejected'
      return this
    }

    approved() {
      this.complaint.state = 'approved'
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
