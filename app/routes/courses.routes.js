module.exports = (app) => {
  const courses = require('../controllers/courses.controller');
  const userHandlers = require('../controllers/auth.controller');

  app.route('/courses')
    .get(courses.findAll)
    .post(userHandlers.loginRequired, courses.create);

  app.route('/courses/:slug')
    .get(courses.findBySlug)
    .put(userHandlers.loginRequired, courses.update)
    .delete(userHandlers.loginRequired, courses.delete);
}