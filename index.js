const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { json } = require('express/lib/response');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config()

dbUrl = process.env.MONGODB_URL

mongoose.connect(dbUrl)
.then((result) => console.log('database connected'))
.catch((err) => console.log(err));
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api/users', userRoutes)



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})