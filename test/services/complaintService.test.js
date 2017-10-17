import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, before, it } from 'mocha'
import Database from '../../src/services/gateway/database'
import ComplaintService from '../../src/services/complaintService'
import { User } from '../factories/usersFactory'
import { Complaint } from '../factories/complaintsFactory'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('complaintService', () => {
  describe('getComplaintsCountForUsers', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()
    const newComplaint = new Complaint().new().get()
    const seenComplaint = new Complaint().seen().get()
    const newComplaint2 = new Complaint().new().get()

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

    describe('One complaint in new', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [newComplaint.id]: newComplaint
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return one complaint', () => {
        return ComplaintService().getComplaintsCountForUsers().then(complaints => {
          expect(complaints.length).to.equal(1)
          expect(complaints[0].new).to.equal(1)
        })
      })
    })

    describe('One complaint in seen', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [seenComplaint.id]: seenComplaint
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return zero complaints in new', () => {
        return ComplaintService().getComplaintsCountForUsers().then(complaints => {
          expect(complaints.length).to.equal(1)
          expect(complaints[0].new).to.equal(0)
        })
      })
    })

    describe('two complaint in new for same user', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [newComplaint.id]: newComplaint,
            [newComplaint2.id]: newComplaint2
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return two complaint in one user', () => {
        return ComplaintService().getComplaintsCountForUsers().then(complaints => {
          expect(complaints.length).to.equal(1)
          expect(complaints[0].new).to.equal(2)
        })
      })
    })

    describe('two complaint in new for differents users', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [newComplaint.id]: newComplaint
          },
          [femaleForFriends.Uid]: {
            [newComplaint2.id]: newComplaint2
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return two complaints (one in each user)', () => {
        return ComplaintService().getComplaintsCountForUsers().then(complaints => {
          expect(complaints.length).to.equal(2)
          expect(complaints[0].new).to.equal(1)
          expect(complaints[1].new).to.equal(1)
        })
      })
    })
  })

  describe('getComplaintsForUser && getComplaintsCountForUsers', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()
    const newComplaint = new Complaint().new().denouncerUser(femaleForFriends.Uid).get()
    const newComplaint2 = new Complaint().new().denouncerUser(femaleForFriends.Uid).get()

    before(() => {
      const users = {
        [maleForFriends.Uid]: maleForFriends,
        [femaleForFriends.Uid]: femaleForFriends
      }
      Database('users').set(users)
    })

    describe('One complaint in new', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [newComplaint.id]: newComplaint
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return one in total and zero in new', () => {
        return ComplaintService().getComplaintsForUser(maleForFriends.Uid).then(() => {
          return ComplaintService().getComplaintsCountForUsers().then(complaints => {
            expect(complaints.length).to.equal(1)
            expect(complaints[0].new).to.equal(0)
            expect(complaints[0].total).to.equal(1)
          })
        })
      })
    })

    describe('Two complaint in new', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [newComplaint.id]: newComplaint,
            [newComplaint2.id]: newComplaint2
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return two in total and zero in new', () => {
        return ComplaintService().getComplaintsForUser(maleForFriends.Uid).then(() => {
          return ComplaintService().getComplaintsCountForUsers().then(complaints => {
            expect(complaints.length).to.equal(1)
            expect(complaints[0].new).to.equal(0)
            expect(complaints[0].total).to.equal(2)
          })
        })
      })
    })
  })

  describe('getComplaintsForUser', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()
    const newComplaint = new Complaint().new().denouncerUser(femaleForFriends.Uid).get()
    const seenComplaint = new Complaint().seen().denouncerUser(femaleForFriends.Uid).get()
    const newComplaint2 = new Complaint().new().denouncerUser(femaleForFriends.Uid).get()

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
        return ComplaintService().getComplaintsForUser(maleForFriends.Uid).then(complaints => {
          expect(complaints.length).to.equal(0)
        })
      })
    })

    describe('One complaint in new', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [newComplaint.id]: newComplaint
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return one complaint', () => {
        return ComplaintService().getComplaintsForUser(maleForFriends.Uid).then(complaints => {
          expect(complaints.length).to.equal(1)
          expect(complaints[0].complaintId).to.equal(newComplaint.id.toString())
        })
      })
    })

    describe('One complaint in seen', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [seenComplaint.id]: seenComplaint
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return one complaint', () => {
        return ComplaintService().getComplaintsForUser(maleForFriends.Uid).then(complaints => {
          expect(complaints.length).to.equal(1)
          expect(complaints[0].complaintId).to.equal(seenComplaint.id.toString())
        })
      })
    })

    describe('two complaint in new for same user', () => {
      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [newComplaint.id]: newComplaint,
            [newComplaint2.id]: newComplaint2
          }
        }
        Database('complaints').set(complaints)
      })

      it('should return two complaint in one user', () => {
        return ComplaintService().getComplaintsForUser(maleForFriends.Uid).then(complaints => {
          expect(complaints.length).to.equal(2)
        })
      })
    })
  })
})
