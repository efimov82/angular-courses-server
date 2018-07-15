module.exports = (app) => {
  const courses = require('../controllers/courses.controller.js');

  app.post('/courses', courses.create);

  app.get('/courses', courses.findAll);

  app.get('/courses/:slug', courses.findBySlug);

  app.put('/courses/:slug', courses.update);

  app.delete('/courses/:slug', courses.delete);
}
