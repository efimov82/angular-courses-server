module.exports = (app) => {
  const courses = require('../controllers/courses.controller.js');

  app.post('/courses', courses.create);

  app.get('/courses', courses.findAll);

  app.get('/courses/:id', courses.findOne);

  app.put('/courses/:id', courses.update);

  app.delete('/courses/:id', courses.delete);
}
