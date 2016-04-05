# crypto-couch-test

Simple test case to show `crypto-couch` works with `ignore: "_attachments"` option.

Test requires an accessibale CouchDB database at 'http://localhost:5984/sync-test'.
The URL can be configured on top of `index.js`

```
git clone https://github.com/gr2m/crypto-couch-test.git
cd crypto-couch-test
npm install
node index.js
```

Output should look like this

```
adding crypto with "password", ignoring _attachments
writing doc with attachment

doc ==============================
{ foo: 'bar',
  _id: 'id-crypto',
  _rev: '1-0626738cbb9763069ef767d8ff99c767',
  _attachments:
   { 'att.txt':
      { content_type: 'text/plain',
        digest: 'md5-YyGolkrSfLuxhOmOl3cyIg==',
        revpos: 1,
        data: <Buffer 4c 65 67 65 6e 64 61 72 79 20 68 65 61 72 74 73 2c 20 74 65 61 72 20 75 73 20 61 6c 6c 20 61 70 61 72 74 0a 4d 61 6b 65 20 6f 75 72 20 65 6d 6f 74 69 ... > } } }

doc._attachments["att.txt"].data ==============================
TGVnZW5kYXJ5IGhlYXJ0cywgdGVhciB1cyBhbGwgYXBhcnQKTWFrZSBvdXIgZW1vdGlvbnMgYmxlZWQsIGNyeWluZyBvdXQgaW4gbmVlZA==
same as original?  yes

replicate to http://localhost:5984/sync-test

remote doc ==============================
{ _id: 'id-crypto',
  _rev: '1-f96dc38a75d97518d1fed239e7f025ff',
  foo: 'bar',
  _attachments:
   { 'att.txt':
      { content_type: 'text/plain',
        revpos: 1,
        digest: 'md5-+LQtcAM4W1APZ1oyjPmf8Q==',
        length: 79,
        stub: true } } }

local doc without crypto ==============================
{ nonce: '092d6b25038ee69e05fe3d33',
  data: 'c99c924704a9337b6007425b49',
  tag: 'fca39f98b33885f6f18b20deebb5ba21',
  _id: 'id-crypto',
  _rev: '1-0626738cbb9763069ef767d8ff99c767',
  _attachments:
   { 'att.txt':
      { content_type: 'text/plain',
        digest: 'md5-YyGolkrSfLuxhOmOl3cyIg==',
        length: 79,
        revpos: 1,
        stub: true } } }
```
