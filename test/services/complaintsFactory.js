export class Complaint {
    static id = 0

    constructor() {
      this.complaint = {
        name: 'name',
        denouncerUser: 'uid',
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
      this.complaint.denouncerUser = denouncerUserUid
      return this
    }

    get() {
      return this.complaint
    }
}
