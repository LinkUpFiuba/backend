import express from 'express'
import UserService from './services/userService'
import LinkService from './services/linkService'
import Administrator from './services/gateway/administrator'
import bodyParser from 'body-parser'

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
      UserService().getAllUsers(uid).then(users => response.json(users))
    })
    .catch(error => {
      response.status(401)
      return response.json({ message: error })
    })
})

app.put('/link/:id', (request, response) => {
  const uid = request.get('token')
  LinkService(uid).link(request.params.id).then(() => response.status(201).send())
})

app.put('/unlink/:id', (request, response) => {
  const uid = request.get('token')
  LinkService(uid).unlink(request.params.id).then(() => response.status(201).send())
})

app.listen(app.get('port'), () => {
  console.log(`Node app is running on port ${port}`)
})
