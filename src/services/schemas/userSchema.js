const userSchema = {
  'id': '/SimpleUser',
  'type': 'object',
  'properties': {
    'name': { 'type': 'strinsg' },
    'age': { 'type': 'integer', 'minimum': 18 }
  },
  'required': ['name', 'age']
}

export default userSchema
