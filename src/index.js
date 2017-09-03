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
  UserService().create(request.params.username)
  // No logro que esto se mande
  response.status(201)
})

app.get('/users/:username', (request, response) => {
  UserService().get(request.params.username).then(snapshot => response.json(snapshot.val()))
})

app.listen(app.get('port'), () => {
  console.log(`Node app is running on port ${port}`)
})
