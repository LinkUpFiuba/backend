/* eslint-disable max-len */
import express from 'express'
import cors from 'cors'
import UserService from './services/userService'
import Administrator from './services/gateway/administrator'
import bodyParser from 'body-parser'
import firebase from 'firebase'
import firebaseService from './services/firebaseService'
import LinkService from './services/linkService'
import { ChatService } from './services/chatService'
import ComplaintService from './services/complaintService'
import DisableUserService from './services/disableUserService'
import AdsService from './services/adsService'

const app = express()
const port = process.env.PORT || 5000

app.set('port', port)

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json())
app.use(cors())

// views is directory for all template files
app.set('views', `${__dirname}/views`)
app.set('view engine', 'ejs')

app.post('/users', (request, response) => {
  UserService().createUser(request.body)
    .then(() => response.status(201).send())
    .catch(error => {
      response.status(400)
      return response.json({ message: error })
    })
})

app.get('/users/:id', (request, response) => {
  UserService().getUser(request.params.id).then(users => response.json(users))
})

app.get('/complaints', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  ComplaintService().getComplaintsCountForUsers().then(complaints => response.json(complaints))
})

app.post('/ads', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  const ad = request.body
  AdsService().createAd(ad)
    .then(() => response.status(201).send())
    .catch(error => {
      response.status(400)
      return response.json({ message: error })
    })
})

app.get('/ads', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  AdsService().getAllAds().then(ads => response.json(ads))
})

app.get('/ads/random', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  AdsService().getRandomAd().then(ad => response.json(ad))
})

app.delete('/ads/:adUid', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  AdsService().deleteAd(request.params.adUid).then(() => response.send())
})

app.get('/complaints/:userUid', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  ComplaintService().getComplaintsForUser(request.params.userUid)
    .then(complaints => {
      UserService().getUser(request.params.userUid)
        .then(user => {
          response.json({ user: user, complaints: complaints })
        })
    })
})

app.post('/users/:userUid/disable', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  const userUid = request.params.userUid
  DisableUserService().blockUser(userUid)
    .then(() => response.json())
    .catch(err => {
      console.log(err)
      response.status(404)
      return response.json({ message: 'That user was not found' })
    })
})

app.post('/users/:userUid/enable', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  const userUid = request.params.userUid
  DisableUserService().unblockUser(userUid)
    .then(() => response.json())
    .catch(() => {
      response.status(403)
      return response.json({ message: 'That user is no disabled' })
    })
})

app.get('/users', (request, response) => {
  if (!request.get('token')) {
    response.status(400)
    return response.json({ message: 'El header "token" debe enviarse como parte del request' })
  }
  Administrator().auth().verifyIdToken(request.get('token'))
    .then(decodedToken => {
      const uid = decodedToken.uid
      UserService().getPosibleLinks(uid).then(users => response.json(users))
    })
    .catch(error => {
      response.status(403)
      return response.json({ message: error })
    })
})

app.post('/getToken', (request, response) => {
  firebaseService().initiazeFirebase()
  firebase.auth().signInWithEmailAndPassword(request.body.email, request.body.password)
    .then(user => response.json({ user: user }))
    .catch(error => response.json({ error: error }))
})

if (process.env.ENVIRONMENT === 'production') {
  LinkService().detectLinks()
  ChatService().detectNewMessages()
}

app.listen(app.get('port'), () => {
  console.log(`Node app is running on port ${port}`)
})
