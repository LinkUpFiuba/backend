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

  describe('#getComplaintsByType(startDate, endDate)', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()

    describe('for different types of complaints', () => {
      const otherComplaint = new Complaint().other().get()
      const inappropiateMessageComplaint = new Complaint().inappropiateMessage().get()
      const suspiciousComplaint = new Complaint().suspicious().get()
      const spamComplaint = new Complaint().spam().get()
      const anotherSuspiciousComplaint = new Complaint().suspicious().get()
      const anotherSpamComplaint = new Complaint().spam().get()

      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [otherComplaint.id]: otherComplaint,
            [inappropiateMessageComplaint.id]: inappropiateMessageComplaint,
            [anotherSpamComplaint.id]: anotherSpamComplaint
          },
          [femaleForFriends.Uid]: {
            [suspiciousComplaint.id]: suspiciousComplaint,
            [spamComplaint.id]: spamComplaint,
            [anotherSuspiciousComplaint.id]: anotherSuspiciousComplaint
          }
        }
        Database('complaints').set(complaints)
      })

      it('gets correct amounts of complaints for each type', () => {
        return ComplaintService().getComplaintsByType(null, null).then(complaints => {
          expect(complaints['spam']).to.eq(2)
          expect(complaints['other']).to.eq(1)
          expect(complaints['suspicious']).to.eq(2)
          expect(complaints['inappropiate-message']).to.eq(1)
        })
      })
    })

    describe('for different dates', () => {
      const septemberComplaint = new Complaint().fromSeptember().get()
      const septemberComplaint2 = new Complaint().fromSeptember().get()
      const octoberComplaint = new Complaint().fromOctober().get()
      const novemberComplaint = new Complaint().fromNovember().get()
      const novemberComplaint2 = new Complaint().fromNovember().get()
      const novemberComplaint3 = new Complaint().fromNovember().get()
      const novemberComplaint4 = new Complaint().fromNovember().get()

      before(() => {
        const complaints = {
          [maleForFriends.Uid]: {
            [septemberComplaint.id]: septemberComplaint,
            [octoberComplaint.id]: octoberComplaint,
            [novemberComplaint.id]: novemberComplaint
          },
          [femaleForFriends.Uid]: {
            [septemberComplaint2.id]: septemberComplaint2,
            [novemberComplaint2.id]: novemberComplaint2,
            [novemberComplaint3.id]: novemberComplaint3,
            [novemberComplaint4.id]: novemberComplaint4
          }
        }
        Database('complaints').set(complaints)
      })

      describe('when no specific dates are set', () => {
        it('returns all complaints', () => {
          return ComplaintService().getComplaintsByType(undefined, undefined).then(complaints => {
            expect(complaints['other']).to.eq(7)
          })
        })
      })

      describe('when specifying a startDate', () => {
        it('returns only complaints with timestamp greater than it', () => {
          return ComplaintService().getComplaintsByType('2017-10', undefined).then(complaints => {
            expect(complaints['other']).to.eq(5)
          })
        })
      })

      describe('when specifying an endDate', () => {
        it('returns only complaints with timestamp lower than it', () => {
          return ComplaintService().getComplaintsByType(undefined, '2017-10').then(complaints => {
            expect(complaints['other']).to.eq(3)
          })
        })
      })

      describe('when specifying both startDate and endDate', () => {
        it('returns only complaints with timestamp between them', () => {
          return ComplaintService().getComplaintsByType('2017-10', '2017-10').then(complaints => {
            expect(complaints['other']).to.eq(1)
          })
        })
      })

      describe('when specifying dates that have no complaints', () => {
        it('returns no complaints', () => {
          return ComplaintService().getComplaintsByType(undefined, '2017-08').then(complaints => {
            expect(complaints).to.be.empty
          })
        })

        it('returns no complaints', () => {
          return ComplaintService().getComplaintsByType('2017-12', undefined).then(complaints => {
            expect(complaints).to.be.empty
          })
        })
      })
    })
  })

  describe('#getComplaintsByType(type)', () => {
    const maleForFriends = new User().male().likesFriends().get()
    const maleForFriends2 = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()
    const femaleForFriends2 = new User().female().likesFriends().get()

    const otherComplaint = new Complaint().other().get()
    const otherComplaint2 = new Complaint().other().get()
    const suspiciousComplaint = new Complaint().suspicious().get()
    const suspiciousComplaint2 = new Complaint().suspicious().get()
    const suspiciousComplaint3 = new Complaint().suspicious().get()
    const spamComplaint = new Complaint().spam().get()
    const spamComplaint2 = new Complaint().spam().get()
    const spamComplaint3 = new Complaint().spam().get()

    before(() => {
      const complaints = {
        [maleForFriends.Uid]: {
          [otherComplaint.id]: otherComplaint,
          [suspiciousComplaint.id]: suspiciousComplaint
        },
        [maleForFriends2.Uid]: {
          [spamComplaint.id]: spamComplaint,
          [spamComplaint2.id]: spamComplaint2
        },
        [femaleForFriends.Uid]: {
          [otherComplaint2.id]: otherComplaint2,
          [suspiciousComplaint2.id]: suspiciousComplaint2,
          [spamComplaint3.id]: spamComplaint3
        },
        [femaleForFriends2.Uid]: {
          [suspiciousComplaint3.id]: suspiciousComplaint3
        }
      }
      Database('complaints').set(complaints)

      Database('disabledUsers').set({})
    })

    it('returns the correct amount for other type', () => {
      return ComplaintService().getDisabledUsersForType('other').then(usersWithComplaints => {
        expect(usersWithComplaints.enabled).to.eq(2)
        expect(usersWithComplaints.disabled).to.eq(0)
      })
    })

    it('returns the correct amount for spam type', () => {
      return ComplaintService().getDisabledUsersForType('spam').then(usersWithComplaints => {
        expect(usersWithComplaints.enabled).to.eq(2)
        expect(usersWithComplaints.disabled).to.eq(0)
      })
    })

    it('returns the correct amount for suspicious type', () => {
      return ComplaintService().getDisabledUsersForType('suspicious').then(usersWithComplaints => {
        expect(usersWithComplaints.enabled).to.eq(3)
        expect(usersWithComplaints.disabled).to.eq(0)
      })
    })

    describe('when there are disabledUsers', () => {
      before(() => {
        const disabledUsers = {
          [maleForFriends.Uid]: true,
          [femaleForFriends.Uid]: true
        }
        Database('disabledUsers').set(disabledUsers)
      })

      it('returns the correct amount for other type', () => {
        return ComplaintService().getDisabledUsersForType('other').then(usersWithComplaints => {
          expect(usersWithComplaints.enabled).to.eq(0)
          expect(usersWithComplaints.disabled).to.eq(2)
        })
      })

      it('returns the correct amount for spam type', () => {
        return ComplaintService().getDisabledUsersForType('spam').then(usersWithComplaints => {
          expect(usersWithComplaints.enabled).to.eq(1)
          expect(usersWithComplaints.disabled).to.eq(1)
        })
      })

      it('returns the correct amount for suspicious type', () => {
        return ComplaintService().getDisabledUsersForType('suspicious').then(usersWithComplaints => {
          expect(usersWithComplaints.enabled).to.eq(1)
          expect(usersWithComplaints.disabled).to.eq(2)
        })
      })
    })
  })
})
