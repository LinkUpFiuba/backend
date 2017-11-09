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
import UserController from './controllers/userController'
import schedule from 'node-schedule'

const app = express()
const port = process.env.PORT || 5000

app.set('port', port)

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json())
app.use(cors())

// views is directory for all template files
app.set('views', `${__dirname}/views`)
app.set('view engine', 'ejs')

// For administrator
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

app.delete('/ads/:adUid', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  AdsService().deleteAd(request.params.adUid).then(() => response.send())
})

app.post('/ads/:adUid/enable', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  AdsService().enableAd(request.params.adUid).then(() => response.send())
})

app.post('/ads/:adUid/disable', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  AdsService().disableAd(request.params.adUid).then(() => response.send())
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

app.delete('/ads/:adUid', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  AdsService().deleteAd(request.params.adUid).then(() => response.send())
})

app.post('/ads/:adUid/enable', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  AdsService().enableAd(request.params.adUid).then(() => response.send())
})

app.post('/ads/:adUid/disable', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  AdsService().disableAd(request.params.adUid).then(() => response.send())
})

app.get('/complaints', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  ComplaintService().getComplaintsCountForUsers().then(complaints => response.json(complaints))
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

app.get('/analytics/complaints/type', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  ComplaintService().getComplaintsByType(request.query.startDate, request.query.endDate)
    .then(complaints => response.json(complaints))
})

app.get('/analytics/complaints/disabled', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  ComplaintService().getDisabledUsersForType(request.query.type)
    .then(usersWithComplaints => response.json(usersWithComplaints))
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

app.get('/analytics/users', (request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  UserService().getActiveUsers(request.query.startDate, request.query.endDate)
    .then(users => response.json(users))
})

// For the app
app.get('/users', (request, response) => {
  if (!request.get('token')) {
    response.status(400)
    return response.json({ message: 'El header "token" debe enviarse como parte del request' })
  }
  Administrator().auth().verifyIdToken(request.get('token'))
    .then(decodedToken => {
      const uid = decodedToken.uid
      UserController().getUsersForUser(uid).then(usersWithAd => response.json(usersWithAd))
      UserService().updateUserActivity(uid)
    })
    .catch(error => {
      response.status(403)
      return response.json({ message: error })
    })
})

app.delete('/users/:uid', (request, response) => {
  if (!request.get('token')) {
    response.status(400)
    return response.json({ message: 'El header "token" debe enviarse como parte del request' })
  }
  Administrator().auth().verifyIdToken(request.get('token'))
    .then(decodedToken => {
      const uid = decodedToken.uid
      UserService().deleteUser(uid).then(() => response.json())
    })
    .catch(error => {
      response.status(403)
      return response.json({ message: error })
    })
})

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

app.post('/getToken', (request, response) => {
  firebaseService().initiazeFirebase()
  firebase.auth().signInWithEmailAndPassword(request.body.email, request.body.password)
    .then(user => response.json({ user: user }))
    .catch(error => response.json({ error: error }))
})

if (process.env.ENVIRONMENT === 'production') {
  LinkService().detectLinks()
  ChatService().detectNewMessages()

  // Update available superlinks everyday at midnight from local time
  const rule = new schedule.RecurrenceRule()
  rule.hour = 0
  rule.minute = 0
  schedule.scheduleJob(rule, UserService().updateAvailableSuperlinks)
}

app.listen(app.get('port'), () => {
  console.log(`Node app is running on port ${port}`)
})
