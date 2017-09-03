import express from 'express'
import UserService from './services/user-service'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000

app.set('port', port)

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json())

// views is directory for all template files
app.set('views', `${__dirname}/views`)
app.set('view engine', 'ejs')

app.post('/users/:username', (request, response) => {
  UserService().createUser(request.body)
    .then(() => response.status(201).send())
    .catch(err => {
      response.status(400)
      return response.json({ message: err })
    })
})

app.get('/users/:username', (request, response) => {
  UserService().getUser(request.params.username).then(users => response.json(users))
})

app.get('/users', (request, response) => {
  UserService().getAllUsers().then(users => response.json(users))
})

app.listen(app.get('port'), () => {
  console.log(`Node app is running on port ${port}`)
})
