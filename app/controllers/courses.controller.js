const Course = require('../models/course.model.js');

// Create and Save a new Course
exports.create = (req, res) => {
  if(!req.body.youtubeId) {
    return res.status(400).send({
      message: "Course youtubeId can not be empty"
    });
  }

  const slug = generateSlug();

  // Create a Course
  const course = new Course({
    slug: slug,
    author: req.body.author || '', // Todo
    dateCreation: req.body.dateCreation || Date(),
    description: req.body.description || "Untitled description",
    duration: req.body.duration || 0,
    title: req.body.title || '',
    thumbnail: req.body.thumbnail || '',
    youtubeId: req.body.youtubeId,
    topRated: (req.body.topRated) ? true : false,
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
* @return [items, count]
*/
exports.findAll = (req, res) => {
  let query = {};
  let limit = Number(req.query.count) ? Number(req.query.count) : 10;
  let offset = Number(req.query.start) ? Number(req.query.start) : 0;

  if (req.body.searchString) {
    query = { title: /${req.body.searchString}/ };
  }

  Course.find(query).limit(limit).skip(offset)
  .then(courses => {
    results = { item: courses };
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

// Find a single Course with Id
exports.findOne = (req, res) => {
  Course.findById(req.params.id)
    .then(note => {
        if(!course) {
            return res.status(404).send({
                message: "Course not found with id " + req.params.id
            });
        }
        res.send(course);
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

// Update a Course identified by the Id in the request
exports.update = (req, res) => {
  // Validate Request
  if(!req.body.youtubeId) {
    return res.status(400).send({
        message: "youtubeId can not be empty"
    });
  }

  // Find Course and update it with the request body
  Course.findByIdAndUpdate(req.params.id, {
      title: req.body.title || "Untitled Note",
      youtubeId: req.body.youtubeId
  }, {new: true})
  .then(course => {
      if(!course) {
          return res.status(404).send({
              message: "Course not found with id " + req.params.id
          });
      }
      res.send(course);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Course not found with id " + req.params.id
          });
      }
      return res.status(500).send({
          message: "Error updating course with id " + req.params.id
      });
  });
};

// Delete a Course with the specified ID in the request
exports.delete = (req, res) => {
  Course.findByIdAndRemove(req.params.id)
    .then(course => {
        if(!course) {
            return res.status(404).send({
                message: "Course not found with id " + req.params.id
            });
        }
        res.send({message: "Course deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Course not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Could not delete course with id " + req.params.id
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