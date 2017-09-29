import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, before, it } from 'mocha'
import Database from '../../src/services/gateway/database'
import ComplaintService from '../../src/services/complaintService'
import { User } from './usersFactory'
import { Complaint } from './complaintsFactory'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('complaintService', () => {
  describe('getComplaintsCountForUsers', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()
    const pendingComplaint = new Complaint().pending().get()
    const approvedComplaint = new Complaint().approved().get()
    const pendingComplaint2 = new Complaint().pending().get()

    before(() => {
      const users = {
        [maleForFriends.Uid]: maleForFriends,
        [femaleForFriends.Uid]: femaleForFriends
      }
      Database('users').set(users)
    })

    describe('No complaints', () => {
      before(() => {
        Database('complaints').set({})
      })

      it('should return no complaints', () => {
        return ComplaintService().getComplaintsCountForUsers().then(complaints => {
          expect(complaints.length).to.equal(0)
        })
      })
    })

    describe('One complaint in pending', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [pendingComplaint.id]: pendingComplaint
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return one complaint', () => {
        return ComplaintService().getComplaintsCountForUsers().then(complaints => {
          expect(complaints.length).to.equal(1)
          expect(complaints[0].pending).to.equal(1)
        })
      })
    })

    describe('One complaint in approved', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [approvedComplaint.id]: approvedComplaint
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return zero complaints in pending', () => {
        return ComplaintService().getComplaintsCountForUsers().then(complaints => {
          expect(complaints.length).to.equal(1)
          expect(complaints[0].pending).to.equal(0)
        })
      })
    })

    describe('two complaint in pending for same user', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [pendingComplaint.id]: pendingComplaint,
            [pendingComplaint2.id]: pendingComplaint2
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return two complaint in one user', () => {
        return ComplaintService().getComplaintsCountForUsers().then(complaints => {
          expect(complaints.length).to.equal(1)
          expect(complaints[0].pending).to.equal(2)
        })
      })
    })

    describe('two complaint in pending for differents users', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [pendingComplaint.id]: pendingComplaint
          },
          [femaleForFriends.Uid]: {
            [pendingComplaint2.id]: pendingComplaint2
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return two complaints (one in each user)', () => {
        return ComplaintService().getComplaintsCountForUsers().then(complaints => {
          expect(complaints.length).to.equal(2)
          expect(complaints[0].pending).to.equal(1)
          expect(complaints[1].pending).to.equal(1)
        })
      })
    })
  })

  describe('getComplaintsForUser', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()
    const pendingComplaint = new Complaint().pending().denouncerUser(femaleForFriends.Uid).get()
    const approvedComplaint = new Complaint().approved().denouncerUser(femaleForFriends.Uid).get()
    const pendingComplaint2 = new Complaint().pending().denouncerUser(femaleForFriends.Uid).get()

    before(() => {
      const users = {
        [maleForFriends.Uid]: maleForFriends,
        [femaleForFriends.Uid]: femaleForFriends
      }
      Database('users').set(users)
    })

    describe('No complaints', () => {
      before(() => {
        Database('complaints').set({})
      })

      it('should return no complaints', () => {
        return ComplaintService().getComplaintsForUser(maleForFriends.Uid).then(response => {
          expect(response.complaints.length).to.equal(0)
        })
      })

      it('should return the same user', () => {
        return ComplaintService().getComplaintsForUser(maleForFriends.Uid).then(response => {
          expect(response.user.Uid).to.equal(maleForFriends.Uid)
        })
      })
    })

    describe('One complaint in pending', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [pendingComplaint.id]: pendingComplaint
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return one complaint', () => {
        return ComplaintService().getComplaintsForUser(maleForFriends.Uid).then(response => {
          expect(response.complaints.length).to.equal(1)
          expect(response.complaints[0].complaintId).to.equal(pendingComplaint.id.toString())
        })
      })
    })

    describe('One complaint in approved', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [approvedComplaint.id]: approvedComplaint
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return one complaint', () => {
        return ComplaintService().getComplaintsForUser(maleForFriends.Uid).then(response => {
          expect(response.complaints.length).to.equal(1)
          expect(response.complaints[0].complaintId).to.equal(approvedComplaint.id.toString())
        })
      })
    })

    describe('two complaint in pending for same user', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [pendingComplaint.id]: pendingComplaint,
            [pendingComplaint2.id]: pendingComplaint2
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return two complaint in one user', () => {
        return ComplaintService().getComplaintsForUser(maleForFriends.Uid).then(response => {
          expect(response.complaints.length).to.equal(2)
        })
      })
    })
  })
})
