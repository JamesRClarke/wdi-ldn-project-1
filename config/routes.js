const express = require('express');
const router  = express.Router();
const sessions = require('../controllers/sessions');
const registrations = require('../controllers/registrations');
const landmark = require('../controllers/landmarks');
const statics = require('../controllers/statics');
const secureRoute = require('../lib/secureRoute');

router.route('/')
.get(statics.index);

router.route('/landmarks')
.get( secureRoute,landmark.index)
.post(secureRoute,landmark.create);

router.route('/landmarks/new')
.get(secureRoute,landmark.new);

router.route('/landmarks/:id')
.get(secureRoute,landmark.show)
.put(secureRoute,landmark.update)
.delete(secureRoute,landmark.delete);

router.route('/landmarks/:id/edit')
.get(secureRoute,landmark.edit);

router.route('/landmarks/:id/comments')
  .post(secureRoute, landmark.createComment);

router.route('/landmarks/:id/comments/:commentId')
  .delete(secureRoute, landmark.deleteComment);


// router.route('/users/:id')
// .get(users.show)
// .post(upload.single('image'), users.update)
// .delete(users.delete);
//
// router.route('/users/:id/edit')
// .get(users.edit);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

router.route('/profile')
.get(registrations.show)
.put(secureRoute,registrations.update)
.delete(secureRoute,registrations.delete);

router.route('/profile/edit')
.get(secureRoute,registrations.edit);


router.all('*', (req, res) => res.notFound());

module.exports = router;
