import { Server } from '../server'

const server = new Server().get()
server.close(console.log('Server closed'))
