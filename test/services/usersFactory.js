export const maleSearchForFriends = id => {
  return {
    id: id,
    gender: 'female',
    interests: {
      'male': false,
      'female': false,
      'friends': true
    }
  }
}

export const femaleSearchForFriends = id => {
  return {
    id: id,
    gender: 'female',
    interests: {
      'male': false,
      'female': false,
      'friends': true
    }
  }
}

export const maleSearchForMale = id => {
  return {
    id: id,
    gender: 'male',
    interests: {
      'male': true,
      'female': false,
      'friends': false
    }
  }
}

export const maleSearchForFemale = id => {
  return {
    id: id,
    gender: 'male',
    interests: {
      'male': false,
      'female': true,
      'friends': false
    }
  }
}

export const maleSearchForFemaleAndMale = id => {
  return {
    id: id,
    gender: 'male',
    interests: {
      'male': true,
      'female': true,
      'friends': false
    }
  }
}

export const femaleSearchForMale = id => {
  return {
    id: id,
    gender: 'female',
    interests: {
      'male': true,
      'female': false,
      'friends': false
    }
  }
}

export const femaleSearchForFemale = id => {
  return {
    id: id,
    gender: 'female',
    interests: {
      'male': false,
      'female': true,
      'friends': false
    }
  }
}

export const femaleSearchForFemaleAndMale = id => {
  return {
    id: id,
    gender: 'female',
    interests: {
      'male': true,
      'female': true,
      'friends': false
    }
  }
}
