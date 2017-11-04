const adSchema = {
  'id': '/SimpleAd',
  'type': 'object',
  'properties': {
    'title': { 'type': 'string' },
    'image': { 'type': 'string' },
    'state': { 'type': 'string' },
    'target': { 'type': 'string' },
    'ageRange': { 'type': 'object' }
  },
  'required': ['title', 'image', 'state', 'target', 'ageRange']
}

export default adSchema
