import express from 'express'
import UserService from './services/userService'
import Administrator from './services/gateway/administrator'
import bodyParser from 'body-parser'
import firebase from 'firebase'
import firebaseService from './services/firebaseService'
import LinkService from './services/linkService'

const app = express()
const port = process.env.PORT || 5000

app.set('port', port)

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json())

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
      response.status(401)
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
}

app.listen(app.get('port'), () => {
  console.log(`Node app is running on port ${port}`)
})
