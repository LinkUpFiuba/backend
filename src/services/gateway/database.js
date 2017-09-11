import Administrator from './administrator'

export default function Database(table) {
  const db = Administrator().database()
  return db.ref(`/${table}`)
}
