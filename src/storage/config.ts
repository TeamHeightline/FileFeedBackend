const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, './bucket-creditionals.json')

const {Storage} = Cloud
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: 'just-circle-333407',
})
const bucket = storage.bucket('file-feed-bucket')

export default bucket