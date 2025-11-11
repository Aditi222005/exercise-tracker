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

    // FIX: Create a proper Date object.
    // If 'day' is empty or not provided, 'new Date()' will use the current date.
    // Otherwise, 'new Date(day)' will parse the provided date string.
    let dateObj = day ? new Date(day) : new Date();

    User.findById(userId)
    .then((userResult) => {
        if (!userResult) {
          return res.send('User not found');
        }
        
      const exercise = new Exercise({
        userId: userId,
        username: userResult.username,
        description: desc,
        duration: dur,
        date: dateObj // FIX: Save the actual Date object, not a string
    })

    exercise.save()
    .then((savedExercise) => {
        // Now, format the date string *only* for the response
        res.json({
              _id: userId,
              username: savedExercise.username,
              description: savedExercise.description,
              duration: savedExercise.duration,
              date: savedExercise.date.toDateString() // Format the Date object to a string
        })
    })
    .catch(err => res.status(500).send('Error saving exercise: ' + err));
    })
    .catch(err => res.status(500).send('Error finding user: ' + err));
}
const exercise_find = (req, res) => {
    let userId = req.params._id;
    let { from, to, limit } = req.query;

    User.findById(userId)
    .then(user => {
        if (!user) {
            return res.send('User not found');
        }

        // 1. Start building the query
        let query = Exercise.find({ userId: userId });

        // 2. Build a date filter object if 'from' or 'to' exist
        let dateFilter = {};
        if (from) {
            dateFilter.$gte = new Date(from);
        }
        if (to) {
            dateFilter.$lte = new Date(to);
        }

        // 3. Add date filter to query if it has any keys
        if (Object.keys(dateFilter).length > 0) {
            query = query.find({ date: dateFilter });
        }

        // 4. Add the limit to the query if it exists
        if (limit) {
            query = query.limit(parseInt(limit));
        }
        
        // 5. Select only the fields we need and execute the query
        query.select('description duration date')
        .exec()
        .then(exercises => {
            
            // 6. Format the log as required by the tests
            const log = exercises.map(ex => ({
                description: ex.description,
                duration: ex.duration,
                date: ex.date.toDateString() // Format date to string (Test 15)
            }));

            // 7. Send the final response object
            res.json({
                _id: user._id,
                username: user.username,
                count: log.length, // FIX: 'count' is the length of the *returned* log
                log: log
            });
        })
        .catch(err => res.status(500).send('Error finding exercises: ' + err));
    })
    .catch(err => res.status(500).send('Error finding user: ' + err));
}   
  /*  */
       
}


module.exports = {
    user_create,
    user_find,
    exercise_create,
    exercise_find
}