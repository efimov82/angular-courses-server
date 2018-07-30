const Course = require('../models/course.model.js');

// Create and Save a new Course
exports.create = (req, res) => {
  if(!req.body.youtubeId) {
    return res.status(400).send({
      message: "Field youtubeId can not be empty"
    });
  }

  const slug = generateSlug();
  let filename = '';
  // Upload thumbnail
  if (req.files && req.files.thumbnail) {
    let thumbnail = req.files.thumbnail;
    filename = slug + '.' + thumbnail.filename.substr(-3);
    preview.mv('../../public/images/courses/'+filename, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
    });
  }
  // Create a Course
  const course = new Course({
    slug: slug,
    author: req.body.author || '', // Todo
    dateCreation: req.body.dateCreation || Date(),
    description: req.body.description || "",
    duration: req.body.duration || 0,
    title: req.body.title || '',
    thumbnail: filename || '',
    youtubeId: req.body.youtubeId,
    topRated: (req.body.topRated == 1 || req.body.topRated == 'true') ? true : false,
  });

  // Save Note in the database
  course.save()
  .then(data => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the Course."
      });
  });
};

/* Retrieve and return all notes from the database.
 * @params [start, count, searchString]
* @return [items, all, start, count]
*/
exports.findAll = (req, res) => {
  let query = {};
  let limit = Number(req.query.count) ? Number(req.query.count) : 10;
  let offset = Number(req.query.start) ? Number(req.query.start) : 0;

  if (req.query.search) {
    query = { $or: [
      {'title': { $regex: req.query.search, $options: 'i'}},
      {'description': { $regex: req.query.search, $options: 'i'}}
    ],
    };
  }

  Course.find(query).limit(limit).skip(offset)
  .then(courses => {
    courses.forEach(course => {
        let path = process.env.HOST_NAME + ':' + process.env.LISTEN_PORT + '/images/courses/';
        if (!course.thumbnail) {
            course.thumbnail = 'default.png'
        }
        course.thumbnail = path + course.thumbnail;
    });
    results = { items: courses };
    Course.find(query).then(allCourses => {
      results.all = allCourses.length;
      results.start = offset;
      results.count = limit;
      res.send(results);
    });
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving courses."
      });
  });
};

/* Find Course by slug
 * param: slug
 * return Course
*/
exports.findBySlug = (req, res) => {
  if(!req.params.slug) {
    return res.status(400).send({
      message: "Param slug can not be empty"
    });
  }

  Course.find({ slug: req.params.slug })
    .then(course => {
        if(!course) {
            return res.status(404).send({
                message: "Course not found with slug " + req.params.slug
            });
        }
        res.send(course[0]);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Course not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error retrieving course with id " + req.params.id
        });
    });
};

/* Update a Course by slug in the request
 *
 * @param: slug
 * @body: [youtubeId, topRated, author, duration, title]
 * @return Course
 */
exports.update = (req, res) => {
  if(!req.params.slug) {
    return res.status(400).send({
      message: "Param slug can not be empty"
    });
  }

  let dataForUpdate = req.body;
  // Find Course and update it with the request body
  Course.findOneAndUpdate({ slug: req.params.slug }, dataForUpdate, { new: true })
  .then(course => {
      if(!course) {
          return res.status(404).send({
              message: "Course not found with slug " + req.params.slug
          });
      }
      res.send(course);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Course not found with slug " + req.params.slug
          });
      }
      return res.status(500).send({
          message: "Error updating course with slug " + req.params.slug
      });
  });
};

// Delete a Course with the specified slug in the request
exports.delete = (req, res) => {
  if(!req.params.slug) {
    return res.status(400).send({
      message: "Param slug can not be empty"
    });
  }

  Course.findOneAndRemove({ slug: req.params.slug })
    .then(course => {
        if(!course) {
            return res.status(404).send({
                message: "Course not found with slug " + req.params.slug
            });
        }
        res.send({message: "Course deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Course not found with slug " + req.params.slug
            });
        }
        return res.status(500).send({
            message: "Could not delete course with slug " + req.params.dlug
        });
    });
};


function generateSlug(slugLength = 8) {
  let res = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < slugLength; i++)
    res += possible.charAt(Math.floor(Math.random() * possible.length));

  return res;
}