export const maleSearchForFriends = id => {
  return {
    Uid: id,
    gender: 'female',
    age: 99,
    maxDistance: 50,
    invisibleMode: false,
    range: {
      minAge: 50,
      maxAge: 100
    },
    location: {
      latitude: 52.518611,
      longitude: 13.408056
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
    maxDistance: 50,
    invisibleMode: false,
    range: {
      minAge: 50,
      maxAge: 100
    },
    location: {
      latitude: 52.518611,
      longitude: 13.408056
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
    invisibleMode: false,
    maxDistance: 50,
    location: {
      latitude: 52.518611,
      longitude: 13.408056
    },
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
    invisibleMode: false,
    maxDistance: 50,
    location: {
      latitude: 52.518611,
      longitude: 13.408056
    },
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
    invisibleMode: false,
    maxDistance: 50,
    location: {
      latitude: 52.518611,
      longitude: 13.408056
    },
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
    invisibleMode: false,
    maxDistance: 50,
    location: {
      latitude: 52.518611,
      longitude: 13.408056
    },
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
    invisibleMode: false,
    age: 25,
    maxDistance: 50,
    location: {
      latitude: 52.518611,
      longitude: 13.408056
    },
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
    invisibleMode: false,
    age: 28,
    maxDistance: 50,
    location: {
      latitude: 52.518611,
      longitude: 13.408056
    },
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
    invisibleMode: false,
    age: 28,
    maxDistance: 50,
    location: {
      latitude: 52.518611,
      longitude: 13.408056
    },
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
    invisibleMode: false,
    age: 99,
    maxDistance: 50,
    location: {
      latitude: 52.518611,
      longitude: 13.408056
    },
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
    invisibleMode: false,
    age: 99,
    maxDistance: 50,
    location: {
      latitude: 52.518611,
      longitude: 13.408056
    },
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

export const femaleSearchForFemaleInvisibleMode = id => {
  return {
    Uid: id,
    gender: 'female',
    invisibleMode: true,
    age: 99,
    maxDistance: 50,
    location: {
      latitude: 52.518611,
      longitude: 13.408056
    },
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

export const femaleSearchForFriendsInvisibleMode = id => {
  return {
    Uid: id,
    gender: 'female',
    invisibleMode: true,
    age: 99,
    maxDistance: 50,
    location: {
      latitude: 52.518611,
      longitude: 13.408056
    },
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

export const femaleSearchForFriendsFarFromOthers = id => {
  return {
    Uid: id,
    gender: 'female',
    invisibleMode: true,
    age: 99,
    maxDistance: 50,
    location: {
      latitude: 0,
      longitude: 0
    },
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

export const solariFemaleSearchForFriends = id => {
  return {
    Uid: id,
    gender: 'female',
    invisibleMode: false,
    age: 99,
    maxDistance: 50,
    location: {
      latitude: 1,
      longitude: 1
    },
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

export const solariFemaleSearchForFemaleInPosition3 = id => {
  return {
    Uid: id,
    gender: 'female',
    invisibleMode: false,
    age: 99,
    maxDistance: 50,
    location: {
      latitude: 3,
      longitude: 3
    },
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

export const anotherSolariFemaleSearchForFemaleInPosition3 = id => {
  return {
    Uid: id,
    gender: 'female',
    invisibleMode: false,
    age: 99,
    maxDistance: 50,
    location: {
      latitude: 3.1,
      longitude: 3.4
    },
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

