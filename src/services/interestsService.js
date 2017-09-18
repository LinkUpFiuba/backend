export default function InterestsService() {
  return {
    getCommonInterests: (interests1, interests2) => {
      const interests1Dict = {}
      for (const key in interests1) {
        const value = interests1[key]
        interests1Dict[value.id] = value.name
      }
      const commonInterests = []
      for (const key in interests2) {
        const value = interests2[key]
        if (interests1[value.id] !== undefined) {
          commonInterests.push(value)
        }
      }
      return commonInterests
    }
  }
}
