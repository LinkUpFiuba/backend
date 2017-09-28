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
    const maleForFriends2 = new User().male().likesFriends().get()
    const femaleForFriends = new User().female().likesFriends().get()
    const pendingComplaint = new Complaint().pending().get()
    const approvedComplaint = new Complaint().approved().get()
    const pendingComplaint2 = new Complaint().pending().get()

    before(() => {
      const users = {
        [maleForFriends.Uid]: maleForFriends,
        [femaleForFriends.Uid]: femaleForFriends,
        [maleForFriends2.Uid]: maleForFriends2
      }
      Database('users').set(users)
    })

    describe('No complaints', () => {
      before(() => {
        Database('complaints').set({})
      })

      it('should return no complaints', () => {
        return ComplaintService().getComplaintsCountForUsers().then(complatins => {
          expect(complatins.length).to.equal(0)
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

      it('should return on complaint', () => {
        return ComplaintService().getComplaintsCountForUsers().then(complatins => {
          expect(complatins.length).to.equal(1)
          expect(complatins[0].pending).to.equal(1)
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
        return ComplaintService().getComplaintsCountForUsers().then(complatins => {
          expect(complatins.length).to.equal(1)
          expect(complatins[0].pending).to.equal(0)
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
        return ComplaintService().getComplaintsCountForUsers().then(complatins => {
          expect(complatins.length).to.equal(1)
          expect(complatins[0].pending).to.equal(2)
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
        return ComplaintService().getComplaintsCountForUsers().then(complatins => {
          expect(complatins.length).to.equal(2)
        })
      })
    })
  })
})
