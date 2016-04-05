var remoteUrl = 'http://localhost:5984/sync-test'
var attBase64Data = 'TGVnZW5kYXJ5IGhlYXJ0cywgdGVhciB1cyBhbGwgYXBhcnQKTWFrZS' +
                    'BvdXIgZW1vdGlvbnMgYmxlZWQsIGNyeWluZyBvdXQgaW4gbmVlZA=='
var PouchDB = require('pouchdb').defaults({
  db: require('memdown')
})

var crypto = require('@gr2m/crypto-pouch')
PouchDB.plugin(crypto)

var db = new PouchDB('db')

console.log('adding crypto with "password", ignoring _attachments')
db.crypto('password', {ignore: '_attachments'})

db.then(function () {
  console.log('writing doc with attachment')

  // workaround to use db.put instead of db.putAttachment
  // https://github.com/calvinmetcalf/crypto-pouch/issues/13
  return db.bulkDocs([{
    _id: 'id-crypto',
    foo: 'bar',
    _attachments: {
      'att.txt': {
        content_type: 'text/plain',
        data: attBase64Data
      }
    }
  }])
})

.then(function () {
  // workaround using db.get instead of db.getAttachment
  // https://github.com/calvinmetcalf/crypto-pouch/issues/13
  return db.get('id-crypto', {
    attachments: true,
    binary: true
  })

  .then(function (doc) {
    console.log('\ndoc ==============================')
    console.log(doc)

    return doc._attachments['att.txt'].data
  })
})

.then(function (attachment) {
  console.log('\ndoc._attachments["att.txt"].data ==============================')
  console.log(attachment.toString('base64'))
  console.log('same as original? ', attachment.toString('base64') === attBase64Data ? 'yes' : 'no')
  console.log('\nreplicate to', remoteUrl)

  return new Promise(function (resolve, reject) {
    db.replicate.to(remoteUrl)
    .on('complete', resolve).on('error', reject);
  })
})

.then(function () {
  return new PouchDB(remoteUrl).get('id-crypto')
})


.then(function (doc) {
  console.log('\nremote doc ==============================')
  console.log(doc)

  db.removeCrypto()

  return db.get('id-crypto')
})

.then(function (doc) {
  console.log('\nlocal doc without crypto ==============================')
  console.log(doc)
})
