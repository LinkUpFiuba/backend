import express from 'express'
import UserService from './services/user-service'

const app = express()
const port = process.env.PORT || 5000

app.set('port', port)

app.use(express.static(`${__dirname}/public`))

// views is directory for all template files
app.set('views', `${__dirname}/views`)
app.set('view engine', 'ejs')

app.post('/users/:username', (request, response) => {
  UserService().create(request.params.username).then(response.status(201).send())
})

app.get('/users', (request, response) => {
  UserService().getAllUsers().then(users => response.json(users))
})

app.listen(app.get('port'), () => {
  console.log(`Node app is running on port ${port}`)
})
