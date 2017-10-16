const adSchema = {
  'id': '/SimpleAd',
  'type': 'object',
  'properties': {
    'title': { 'type': 'string' },
    'image': { 'type': 'string' },
    'state': { 'type': 'string' }
  },
  'required': ['title', 'image', 'state']
}

export default adSchema
