import Database from './gateway/database'
import UserService from './userService'
import DisableUserService from '../../src/services/disableUserService'

export default function ComplaintService() {
  const TOTAL_INDEX = 0
  const NEW_COMPLAINT = 1

  const calculateCounts = complaintsForUser => {
    let newComplaint = 0
    let total = 0
    complaintsForUser.forEach(complaint => {
      const state = complaint.val().state
      total++
      if (state === 'new') {
        newComplaint++
      }
    })
    return [total, newComplaint]
  }

  const translateCondition = isDisabled => {
    return isDisabled ? 'Disabled' : 'Active'
  }

  return {
    getComplaintsCountForUsers: () => {
      const complaintsRef = Database('complaints')
      const complaintsArray = []
      const promisesArrayOfUsers = []
      return complaintsRef.once('value')
        .then(complaints => {
          complaints.forEach(complaintsForUser => {
            promisesArrayOfUsers.push(UserService().getUser(complaintsForUser.key).then(user => {
              return DisableUserService().isUserDisabled(user.Uid).then(isDisabled => {
                const counts = calculateCounts(complaintsForUser)
                const complaint = {
                  total: counts[TOTAL_INDEX],
                  new: counts[NEW_COMPLAINT],
                  condition: translateCondition(isDisabled),
                  userName: user.name,
                  age: user.age,
                  sex: user.gender,
                  userUid: user.Uid
                }
                complaintsArray.push(complaint)
              })
            }))
          })
        })
        .then(() => {
          return Promise.all(promisesArrayOfUsers).then(() => {
            return complaintsArray
          })
        })
    },

    getComplaintsForUser: userUid => {
      const complaintsRef = Database('complaints')
      const promisesArray = []
      const complaintsArray = []
      const updateComplaintsArray = []
      return complaintsRef.child(userUid).once('value')
        .then(complaints => {
          return complaints.forEach(complaint => {
            const reportingUserUid = complaint.val().idReporting
            promisesArray.push(UserService().getUser(reportingUserUid).then(user => {
              complaintsArray.push({
                complaintId: complaint.key,
                userName: user.name,
                age: user.age,
                sex: user.gender,
                ...complaint.val()
              })
              const modifyStatus = {}
              modifyStatus[`/${userUid}/${complaint.key}/state/`] = 'seen'
              updateComplaintsArray.push(Database('complaints').update(modifyStatus))
            }))
          })
        })
        .then(() => {
          return Promise.all(promisesArray, updateComplaintsArray).then(() => {
            return complaintsArray
          })
        })
    }
  }
}
