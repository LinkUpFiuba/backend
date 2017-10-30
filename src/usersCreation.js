// Run as `node dist/usersCreation.js` (After running `npm run build`)

import Administrator from './services/gateway/administrator'
import Database from './services/gateway/database'

const simpsons = {
  id: '29534858696',
  name: 'The Simpsons'
}

const simpsonsUniversidad = {
  id: '359787784180562',
  name: 'Los Simpsons y la Universidad'
}

const simpsonsYSistemas = {
  id: '201690326953790',
  name: 'Los Simpson y Sistemas'
}

const simpsonsFiuba = {
  id: '848492601896773',
  name: 'Los Simpsons y la FIUBA'
}

const fiuba = {
  id: '323298391008',
  name: 'FIUBA | Facultad de Ingeniería de la UBA'
}

const remando = {
  id: '121677551254143',
  name: 'Remando en el CBC'
}

const mepes = {
  id: '498352890308904',
  name: 'Me Pasó En Sistemas'
}

const teamviewer = {
  id: '170086771112',
  name: 'TeamViewer'
}

const nba = {
  id: '8245623462',
  name: 'NBA'
}

const goldenState = {
  id: '47657117525',
  name: 'Golden State Warriors'
}

const stephenCurry = {
  id: '306767216014860',
  name: 'Stephen Curry'
}

const spotify = {
  id: '448411565274565',
  name: 'Spotify'
}

const netflix = {
  id: '268372269857888',
  name: 'Netflix'
}

const houseOfCards = {
  id: '339799489548766',
  name: 'House of Cards'
}

const metroYMedio = {
  id: '122601577929656',
  name: 'Metro y Medio'
}

const daParaDarse = {
  id: '482514181789130',
  name: 'Da para darse'
}

const pringles = {
  id: '269689779834969',
  name: 'Pringles'
}

const chupitos = {
  id: '164392050335524',
  name: 'Chupitos Bar'
}

const lilita = {
  id: '70666562597',
  name: 'Elisa Lilita Carrió'
}

const ortigozaPhoto = 'http://media.diarioveloz.com/adjuntos/120/imagenes/001/693/0001693962.jpggi'
const solPerezPhoto = 'https://k61.kn3.net/taringa/B/D/1/B/E/D/corderoalejandro/B37.jpg'
const monacoPhoto = 'https://upload.wikimedia.org/wikipedia/commons/4/42/Flickr_-_Carine06_-_Juan_Monaco_%288%29.jpg'
const tinelliPhoto = 'https://images.clarin.com/2015/05/10/r1W-jXoAXl_930x525.jpg'
const pampitaPhoto = 'http://www3.pictures.gi.zimbio.com/Los+Premios+MTV+Latino+America+2006+Press+ibrnX3-UcEAx.jpg'
const juanPhoto = 'http://www.equiposytalento.com/upload/talent_estudiantes/000/75/img_0348.jpg'
const carlitaPhoto = 'http://images.eldiario.es/galicia/Sabela-Ramos-Facultad-Informatica-UDC_EDIIMA20150128_0701_13.jpg'
const karlPhoto = 'https://mariajosefurio.files.wordpress.com/2010/05/chicototal.jpg'
const pilarPhoto = 'http://s3-us-west-2.amazonaws.com/bucket-vidasana/wp-content/uploads/2016/01/mujer-pensando.jpg'
const federicoPhoto = 'https://pbs.twimg.com/profile_images/825466192898953217/EjQD-1vo.jpg'
const pipaPhoto = 'http://sevilla.abc.es/deportes/orgullodenervion/wp-content/uploads/2017/05/Benedetto.jpg'
const salinasPhoto = 'http://www.elequipo-deportea.com/upload/news/magda/2017/07/596cb469dcad2_crop.jpg'

const landscapePhoto = {
  url: 'https://i.pinimg.com/736x/5c/4b/67/5c4b672e04cc92914959cc8e9e8125c7--bucket-list-lakes.jpg'
}

const sanLorenzoPhoto = {
  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Escudo-San-Lorenzo.png/220px-Escudo-San-Lorenzo.png'
}

const usersToCreate = [
  {
    aboutMe: 'Me gusta la joda',
    age: '32',
    availableSuperlinks: 5,
    birthday: '10/07/1984',
    education: '',
    email: 'jonny@gmail.com',
    gender: 'male',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: chupitos,
      1: daParaDarse,
      2: lilita,
      3: netflix,
      4: pringles,
      5: simpsons,
      6: {
        id: '826371263',
        name: 'Yo también gané la Copa Libertadores'
      }
    },
    linkUpPlus: false,
    location: {
      latitude: -34.6347631,
      longitude: -58.4270265
    },
    maxDistance: 100,
    name: 'Néstor Ortigoza',
    photoUrl: ortigozaPhoto,
    profilePhotosList: {
      0: { url: ortigozaPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 18,
      maxAge: 50
    },
    tokenFCM: '',
    work: 'Jugador de fútbol en Olimpia'
  },
  {
    aboutMe: 'Tan solo soy una chica',
    age: '23',
    availableSuperlinks: 5,
    birthday: '07/16/1994',
    education: 'Lasalle',
    email: 'solci@gmail.com',
    gender: 'female',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: daParaDarse,
      1: chupitos,
      2: metroYMedio,
      3: spotify,
      4: netflix,
      5: simpsons,
      6: lilita,
      7: {
        id: '7845364',
        name: 'A mi también me gusta el olor a lluvia'
      }
    },
    linkUpPlus: false,
    location: {
      latitude: -34.5325003,
      longitude: -58.5091439
    },
    maxDistance: 100,
    name: 'Sol Pérez',
    photoUrl: solPerezPhoto,
    profilePhotosList: {
      0: { url: solPerezPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 23,
      maxAge: 40
    },
    tokenFCM: '',
    work: 'Chica del clima en TyC'
  },
  {
    aboutMe: 'Me dicen Pico',
    age: '33',
    availableSuperlinks: 5,
    birthday: '03/29/1984',
    education: 'Club Independiente de Tandil',
    email: 'pico@gmail.com',
    gender: 'male',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: simpsons,
      1: metroYMedio,
      2: lilita,
      3: houseOfCards,
      4: {
        id: '621635162',
        name: 'Fans club de Pampita'
      },
      5: {
        id: '621635163',
        name: 'Fans club de Klosterboer'
      },
      6: {
        id: '621635164',
        name: 'Fans club de Zaira Nara'
      },
      7: {
        id: '621635162',
        name: 'Fans club de Luisana Lopilato'
      }
    },
    linkUpPlus: false,
    location: {
      latitude: -34.5814699,
      longitude: -58.450428
    },
    maxDistance: 30,
    name: 'Juan Mónaco',
    photoUrl: monacoPhoto,
    profilePhotosList: {
      0: { url: monacoPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 22,
      maxAge: 40
    },
    tokenFCM: '',
    work: 'Ex Tenista'
  },
  {
    aboutMe: 'Aguante San Lorenzo',
    age: '57',
    availableSuperlinks: 5,
    birthday: '04/01/1960',
    education: 'Colegio Manuel Belgrano',
    email: 'marce@gmail.com',
    gender: 'male',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: houseOfCards,
      1: lilita,
      2: nba,
      3: goldenState,
      4: stephenCurry,
      5: {
        id: '8912312',
        name: 'Sin basquet no puedo vivir'
      }
    },
    linkUpPlus: false,
    location: {
      latitude: -34.5814699,
      longitude: -58.450428
    },
    maxDistance: 40,
    name: 'Marcelo Tinelli',
    photoUrl: tinelliPhoto,
    profilePhotosList: {
      0: { url: tinelliPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 18,
      maxAge: 30
    },
    tokenFCM: '',
    work: 'Capo de Ideas del Sur'
  },
  {
    aboutMe: 'Pampeña hasta la muerte!',
    age: '39',
    availableSuperlinks: 5,
    birthday: '01/17/1978',
    education: 'Un cole pampeño',
    email: 'pampita@gmail.com',
    gender: 'female',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: simpsonsYSistemas,
      1: {
        id: '7812312378',
        name: 'Fans club de Pico Mónaco'
      }
    },
    linkUpPlus: false,
    location: {
      latitude: -34.61112968,
      longitude: -58.48654301
    },
    maxDistance: 35,
    name: 'Caro',
    photoUrl: pampitaPhoto,
    profilePhotosList: {
      0: { url: pampitaPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 20,
      maxAge: 38
    },
    tokenFCM: '',
    work: 'Jurado en ShowMatch'
  },
  {
    aboutMe: 'Un típico estudiante de ingeniería',
    age: '25',
    availableSuperlinks: 5,
    birthday: '04/13/1992',
    education: 'FIUBA | Facultad de Ingeniería de la UBA',
    email: 'estudiante@gmail.com',
    gender: 'male',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: simpsonsYSistemas,
      1: simpsonsFiuba,
      2: simpsonsUniversidad,
      3: remando,
      4: fiuba,
      5: teamviewer,
      6: mepes,
      7: nba,
      8: netflix,
      9: houseOfCards,
      10: pringles,
      11: spotify,
      12: {
        id: '123123',
        name: 'Algo que no le gusta a nadie'
      }
    },
    linkUpPlus: false,
    location: {
      latitude: -34.6176389,
      longitude: -58.3701572
    },
    maxDistance: 15,
    name: 'Juan Rodríguez',
    photoUrl: juanPhoto,
    profilePhotosList: {
      0: { url: juanPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 20,
      maxAge: 35
    },
    tokenFCM: '',
    work: 'Programador en Despegar.com'
  },
  {
    aboutMe: 'Sapo de otro pozo',
    age: '21',
    availableSuperlinks: 5,
    birthday: '06/20/1996',
    education: 'UCA - Ingeniería en Informática',
    email: 'estudiante@gmail.com',
    gender: 'female',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: fiuba,
      1: simpsonsFiuba,
      2: remando,
      3: {
        id: '812831',
        name: 'Mujeres en Ingeniería'
      }
    },
    linkUpPlus: false,
    location: {
      latitude: -34.6157348,
      longitude: -58.3656946
    },
    maxDistance: 15,
    name: 'Carlita Sabella',
    photoUrl: carlitaPhoto,
    profilePhotosList: {
      0: { url: carlitaPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 20,
      maxAge: 25
    },
    tokenFCM: '',
    work: 'Desempleada'
  },
  {
    aboutMe: 'Socialista a full',
    age: '26',
    availableSuperlinks: 5,
    birthday: '10/25/1991',
    education: 'Facultad de Sociales - UBA',
    email: 'socialista@gmail.com',
    gender: 'male',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: houseOfCards,
      1: simpsons,
      2: stephenCurry,
      3: spotify,
      4: {
        id: '13417843',
        name: 'Karl Marx'
      }
    },
    linkUpPlus: false,
    location: {
      latitude: -34.6204462,
      longitude: -58.384547
    },
    maxDistance: 20,
    name: 'Karl Rodriguez',
    photoUrl: karlPhoto,
    profilePhotosList: {
      0: { url: karlPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 18,
      maxAge: 50
    },
    tokenFCM: '',
    work: 'Hippie del mundo'
  },
  {
    aboutMe: 'Intento de psicóloga. Busco analizar gente. Freud o muerte.',
    age: '27',
    availableSuperlinks: 5,
    birthday: '12/09/1989',
    education: 'PsiUBA',
    email: 'psicologa@gmail.com',
    gender: 'female',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: pringles,
      1: simpsons,
      2: netflix,
      3: teamviewer,
      4: {
        id: '712361',
        name: 'Psicología mundial'
      },
      5: {
        id: '172831',
        name: 'Dibujitos animados'
      }
    },
    linkUpPlus: false,
    location: {
      latitude: -34.6123364,
      longitude: -58.4124022
    },
    maxDistance: 100,
    name: 'Pilar Lyfschik',
    photoUrl: pilarPhoto,
    profilePhotosList: {
      0: { url: pilarPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 18,
      maxAge: 30
    },
    tokenFCM: '',
    work: 'Terapeuta independiente'
  },
  {
    aboutMe: 'Caminante no hay camino, se hace el camino al andar',
    age: '25',
    availableSuperlinks: 5,
    birthday: '10/15/1993',
    education: 'Marketing en La Fundación',
    email: 'fede@gmail.com',
    gender: 'male',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: simpsons,
      1: teamviewer,
      2: nba,
      3: stephenCurry,
      4: houseOfCards,
      5: spotify,
      6: netflix,
      7: metroYMedio,
      8: {
        id: '123712637',
        name: 'Caminar el mundo'
      }
    },
    linkUpPlus: false,
    location: {
      latitude: -34.554348,
      longitude: -58.5066694
    },
    maxDistance: 100,
    name: 'Federico Morgante',
    photoUrl: federicoPhoto,
    profilePhotosList: {
      0: { url: federicoPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 18,
      maxAge: 30
    },
    tokenFCM: '',
    work: 'Trotamundos'
  },
  {
    aboutMe: 'Me dicen pipa.',
    age: '27',
    availableSuperlinks: 5,
    birthday: '05/07/1990',
    education: '',
    email: 'pipa@gmail.com',
    gender: 'male',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: simpsons,
      1: metroYMedio,
      2: nba,
      3: netflix,
      4: {
        id: '234567890',
        name: 'Yo también le hice goles a tu abuela, a tu mamá y a tu hermano'
      },
      5: mepes,
      6: spotify
    },
    linkUpPlus: false,
    location: {
      latitude: -34.6375881,
      longitude: -58.3704502
    },
    maxDistance: 20,
    name: 'Darío Benedetto',
    photoUrl: pipaPhoto,
    profilePhotosList: {
      0: { url: pipaPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 22,
      maxAge: 100
    },
    tokenFCM: '',
    work: 'Goleador en Boca.'
  },
  {
    aboutMe: 'Me gusta meter goles.',
    age: '31',
    availableSuperlinks: 5,
    birthday: '06/04/1986',
    education: 'Chaca me enseño todo, papá',
    email: 'rodri@gmail.com',
    gender: 'male',
    getNotifications: true,
    interests: {
      male: false,
      female: false,
      friends: true
    },
    invisibleMode: false,
    likesList: {
      0: {
        id: '16235612',
        name: 'Chacarita Juniors'
      }
    },
    linkUpPlus: false,
    location: {
      latitude: -34.5672771,
      longitude: -58.5281459
    },
    maxDistance: 50,
    name: 'Rodrigo Salinas',
    photoUrl: salinasPhoto,
    profilePhotosList: {
      0: { url: salinasPhoto },
      1: landscapePhoto,
      2: sanLorenzoPhoto
    },
    range: {
      minAge: 20,
      maxAge: 30
    },
    tokenFCM: '',
    work: 'Goleador de Chaca.'
  }
]

const usersRef = Database('users')
const creations = usersToCreate.map(user => {
  const newUserRef = usersRef.push()
  const Uid = newUserRef.key
  return newUserRef.set({
    Uid,
    ...user
  }).then(() => console.log(`User ${user.name} creado con Uid: ${Uid}`))
})
Promise.all(creations).then(() => {
  Administrator().app().delete()
})
