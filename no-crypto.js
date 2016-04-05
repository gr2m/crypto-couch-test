var PouchDB = require('pouchdb').defaults({
  db: require('memdown')
})

var db = new PouchDB('db')

db.then(function () {
  return db.put({
    _id: 'id-no-crypto',
    foo: 'bar',
    _attachments: {
      'att.txt': {
        content_type: 'text/plain',
        data: 'TGVnZW5kYXJ5IGhlYXJ0cywgdGVhciB1cyBhbGwgYXBhcnQKTWFrZS' +
              'BvdXIgZW1vdGlvbnMgYmxlZWQsIGNyeWluZyBvdXQgaW4gbmVlZA=='
      }
    }
  })
})

.then(function () {
  // workaround using db.get instead of db.getAttachment
  // https://github.com/calvinmetcalf/crypto-pouch/issues/13
  return db.get('id-no-crypto', {
    attachments: true,
    binary: true
  })

  .then(function (doc) {
    return doc._attachments['att.txt'].data
  })
})

.then(function (attachment) {
  console.log('\nattachment ==============================')
  console.log(attachment.toString('base64'))
  console.log(Buffer.isBuffer(attachment))

  return new Promise(function (resolve, reject) {
    db.replicate.to('http://localhost:5984/sync-test')
    .on('complete', resolve).on('error', reject);
  })
})

.then(function () {
  console.log('done.')
})
