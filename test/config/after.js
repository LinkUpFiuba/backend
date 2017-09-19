import { TestServer } from '../server'

const server = new TestServer().get()
server.close(console.log('Server closed'))
