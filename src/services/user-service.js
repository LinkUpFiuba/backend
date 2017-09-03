import Database from '../database'

export default function UserService() {
  return {
    create: username => {
      const usersRef = Database('users')

      usersRef.push().set({
        name: username
      })
    }
  }
}
