import Database from './gateway/database'
import UserService from './userService'

export default function ComplaintService() {
  const calculatePending = complaintsForUser => {
    let pending = 0
    complaintsForUser.forEach(complaint => {
      const state = complaint.val().state
      if (state === 'pending') {
        pending++
      }
    })
    return pending
  }

  return {
    getComplaintsCountForUsers: () => {
      const complaintsRef = Database('complaints')
      const complaintsArray = []
      const promisesArray = []
      return complaintsRef.once('value')
        .then(complaints => {
          complaints.forEach(complaintsForUser => {
            promisesArray.push(UserService().getUser(complaintsForUser.key).then(user => {
              if (user) {
                const pending = calculatePending(complaintsForUser)
                const complaint = {
                  userName: user.name,
                  age: user.age,
                  sex: user.gender,
                  uid: user.Uid,
                  pending: pending
                }
                complaintsArray.push(complaint)
              }
            }))
          })
        })
        .then(() => {
          return Promise.all(promisesArray).then(() => complaintsArray)
        })
    },

    getComplaintsForUser: userUid => {
      const complaintsRef = Database('complaints')
      const promisesArray = []
      const complaintsArray = []
      return complaintsRef.child(userUid).once('value')
        .then(complaints => {
          complaints.forEach(complaint => {
            const reportingUserUid = complaint.val().idReporting
            promisesArray.push(UserService().getUser(reportingUserUid).then(user => {
              complaintsArray.push({
                complaintId: complaint.key,
                userName: user.name,
                age: user.age,
                sex: user.gender,
                ...complaint.val()
              })
            }))
          })
        })
        .then(() => {
          return Promise.all(promisesArray).then(() => {
            return complaintsArray
          })
        })
    },

    rejectComplaint: (userUid, complaintUid) => {
      const complaintsRef = Database('complaints')
      const update = {}
      update[`/${userUid}/${complaintUid}/state`] = 'rejected'
      return complaintsRef.child(userUid).child(complaintUid).once('value')
        .then(complaint => {
          console.log(complaint.val())
          if (complaint.val() === null) {
            return Promise.reject(new Error('Complaint was not found'))
          }
          return complaintsRef.update(update).then(() => {
            return complaintsRef.child(userUid).child(complaintUid).once('value')
              .then(complaint => {
                return complaint.val()
              })
          })
        })
    }
  }
}
