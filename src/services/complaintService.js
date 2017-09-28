import Database from './gateway/database'
import UserService from './userService'

export default function ComplaintService() {
  function calculatePending(complaintsForUser) {
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
              const pending = calculatePending(complaintsForUser)
              if (user) {
                const complaint = {
                  name: user.name,
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
    }
  }
}

// {
//     userName: 'Tanner Linsley',
//         age: 6,
//     sex: 'Male',
//     pending: 15,
//     id: 2
// }
