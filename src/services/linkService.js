import Database from './gateway/database'

export default (uid = null) => {
  return {
    link: userId => {
      const linksRef = Database(`links/${uid}`)
      return linksRef.push({
        [userId]: true
      })
    },
    unlink: userId => {
      const linksRef = Database(`unlinks/${uid}`)
      return linksRef.push({
        [userId]: true
      })
    }
  }
}
