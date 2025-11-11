const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataControllers');





router.post('/', dataController.user_create);
  router.get('/', dataController.user_find);
  router.post('/:_id/exercises', dataController.exercise_create);
  router.get('/:_id/logs', dataController.exercise_find);
  

  module.exports = router;