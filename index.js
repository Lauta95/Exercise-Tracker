const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const {MongoClient} = require('mongodb')

const client = new MongoClient(process.env.MONGO_URI)
const db = client.db('etracker');
const tracker = db.collection('tracker')

const port = process.env.PORT || 3030;

app.use(cors())
app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3030, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

