export class Complaint {
    static id = 0

    constructor() {
      this.complaint = {
        idReporting: 'uid',
        message: 'message',
        state: 'new',
        type: 'other',
        timeStamp: '2017-10-30 12:00:00',
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

    spam() {
      this.complaint.type = 'spam'
      return this
    }

    suspicious() {
      this.complaint.type = 'suspicious'
      return this
    }

    inappropiateMessage() {
      this.complaint.type = 'inappropiate-message'
      return this
    }

    other() {
      this.complaint.type = 'other'
      return this
    }

    fromSeptember() {
      this.complaint.timeStamp = '2017-09-15 12:00:00'
      return this
    }

    fromOctober() {
      this.complaint.timeStamp = '2017-10-15 12:00:00'
      return this
    }

    fromNovember() {
      this.complaint.timeStamp = '2017-11-15 12:00:00'
      return this
    }

    get() {
      return this.complaint
    }
}
