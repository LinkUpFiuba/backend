export const maleSearchForFriends = id => {
  return {
    Uid: id,
    gender: 'female',
    age: 99,
    range: {
      minAge: 50,
      maxAge: 100
    },
    interests: {
      'male': false,
      'female': false,
      'friends': true
    }
  }
}

export const femaleSearchForFriends = id => {
  return {
    Uid: id,
    gender: 'female',
    age: 99,
    range: {
      minAge: 50,
      maxAge: 100
    },
    interests: {
      'male': false,
      'female': false,
      'friends': true
    }
  }
}

export const maleSearchForMale = id => {
  return {
    Uid: id,
    gender: 'male',
    age: 99,
    range: {
      minAge: 50,
      maxAge: 100
    },
    interests: {
      'male': true,
      'female': false,
      'friends': false
    }
  }
}

export const maleSearchForFemale = id => {
  return {
    Uid: id,
    gender: 'male',
    age: 99,
    range: {
      minAge: 50,
      maxAge: 100
    },
    interests: {
      'male': false,
      'female': true,
      'friends': false
    }
  }
}

export const maleSearchForFemaleAndMale = id => {
  return {
    Uid: id,
    gender: 'male',
    age: 99,
    range: {
      minAge: 50,
      maxAge: 100
    },
    interests: {
      'male': true,
      'female': true,
      'friends': false
    }
  }
}

export const femaleSearchForMale = id => {
  return {
    Uid: id,
    gender: 'female',
    age: 99,
    range: {
      minAge: 50,
      maxAge: 100
    },
    interests: {
      'male': true,
      'female': false,
      'friends': false
    }
  }
}

export const femaleSearchForMaleInAgeRange = id => {
  return {
    Uid: id,
    gender: 'female',
    age: 25,
    range: {
      minAge: 20,
      maxAge: 30
    },
    interests: {
      'male': true,
      'female': false,
      'friends': false
    }
  }
}

export const maleSearchForFemaleInAgeRange = id => {
  return {
    Uid: id,
    gender: 'male',
    age: 28,
    range: {
      minAge: 20,
      maxAge: 25
    },
    interests: {
      'male': false,
      'female': true,
      'friends': false
    }
  }
}

export const maleSearchForFemaleInImposibleAgeRange = id => {
  return {
    Uid: id,
    gender: 'male',
    age: 28,
    range: {
      minAge: 0,
      maxAge: 10
    },
    interests: {
      'male': false,
      'female': true,
      'friends': false
    }
  }
}

export const femaleSearchForFemale = id => {
  return {
    Uid: id,
    gender: 'female',
    age: 99,
    range: {
      minAge: 50,
      maxAge: 100
    },
    interests: {
      'male': false,
      'female': true,
      'friends': false
    }
  }
}

export const femaleSearchForFemaleAndMale = id => {
  return {
    Uid: id,
    gender: 'female',
    age: 99,
    range: {
      minAge: 50,
      maxAge: 100
    },
    interests: {
      'male': true,
      'female': true,
      'friends': false
    }
  }
}
