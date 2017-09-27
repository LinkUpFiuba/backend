import Administrator from './administrator'
import Promise from 'bluebird'

export const Messaging = () => {
  if (process.env.MOCKFIREBASE_DB_URL) {
    return MessagingMock()
  }
  return Administrator().messaging()
}

const MessagingMock = () => {
  return {
    sendToDevice: (_token, _payload) => {
      return Promise.resolve({ results: [{ messageId: '0:1506053225016032%518a540e518a540e' }],
        canonicalRegistrationTokenCount: 0,
        failureCount: 0,
        successCount: 1,
        multicastId: 8187539027469470000 })
    }
  }
}
