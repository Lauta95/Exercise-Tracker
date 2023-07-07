const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI)

const port = process.env.PORT || 3030;

const UserSchema = new Schema({
  username: String
});
const User = mongoose.model('User', UserSchema);

const ExerciseSchema = new Schema({
  user_id: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date
})
const Exercise = mongoose.model('Exercise', ExerciseSchema);


app.use(cors())
app.use(express.static('public'))
// para obtener el request del req.body necesitamos un middleware para obtenerlo:
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// aca se usa un request body
app.post('/api/users', async (req, res) => {
  console.log(req.body);
  const userObj = new User({
    username: req.body.username
  })
  try {
    const user = await userObj.save()
    console.log(user);
    res.json(user)
  } catch (err) {
    console.log(err);
  }
})

// aca se usa un request params
app.post('/api/users/:_id/exercises', async (req, res) => {
  const id = req.params._id;
  const { description, duration, date } = req.body
  try{
    const user = await User.findById(id)
    if(!user){
      res.send('no user')
    }else{
      const exerciseObj = new Exercise({
        user_id: user._id,
        description,
        duration,
        date: date ? new Date(date) : new Date()
      })
      const exercise = await exerciseObj.save()
      res.json({
        _id: user._id,
        username: user.username,
        description: user.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString()
      })
    }
  }catch(err){
    console.log(err);
    res.send("hay un error al intentar guardar")
  }
})

const listener = app.listen(process.env.PORT || 3030, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

