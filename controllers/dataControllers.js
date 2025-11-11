const User = require('../models/data');
const Exercise = require('../models/exercise');
const bodyParser = require('body-parser');




const user_create = (req, res) => {
    const name = req.body.username;
    const user = new User({
        username: name
      });
    
      user.save()
      .then((result) => {
        res.json({username: name, _id: result._id});
      })
      .catch((err) => res.send('username already taken'));
}




const user_find = (req, res) => {
    User.find()
    .then((result) => {
      res.send(result);
      console.log(result);
    })
    .catch((err) => res.send('cannot find any users'));
}



const exercise_create = (req, res)  => {
    let userId = req.params._id;
    let desc = req.body.description;
    let dur = req.body.duration;
    let day = req.body.date;

    if(!day) {
      day = new Date().toDateString();
    } else {
    day = new Date(day).toDateString()
    }

User.findById(userId)
.then((result) => {
    
  const exercise = new Exercise({
    userId: userId,
    username: result.username,
    description: desc,
    duration: dur,
    date: new Date(day).toDateString()
})

exercise.save()
.then((result) => {
    res.json({
          _id: userId,
          username: result.username,
          description: result.description,
          duration: result.duration,
          date: new Date(result.date).toDateString()
    })
})
})



}

const exercise_find = (req, res) => {
    let userId = req.params._id;
    let from = req.query.from;
     let to = req.query.to;
     let limit = parseInt(req.query.limit);

      User.findById(userId)
      .then((result) => {
        let name = result.username;
        let theId = result._id;
        Exercise.find({userId:userId})
        .then((result) => {
          
          
            let newLog = result.map(item => {
              return {
                description: item.description,
                duration: Number(item.duration),
                date: new Date(item.date).toDateString(),
              }
            })
      
            if (from) {
              let newFrom = new Date(from);
              newLog = newLog.filter(item => {
                return new Date(item.date) >= newFrom
              });
            }
             if (to) {
              let newTo = new Date(to);
              newLog = newLog.filter(item => {
                return new Date(item.date) <= newTo
              });
            }
            if (limit) { 
              newLog = newLog.slice(0, limit)
            }
            
              let user = {
                username: name,
                _id: theId,
                count: result.length,
                log: newLog
              };
                              
              res.json(user);
            
          })
        })
      

     
   
  /*  */
       
}


module.exports = {
    user_create,
    user_find,
    exercise_create,
    exercise_find
}