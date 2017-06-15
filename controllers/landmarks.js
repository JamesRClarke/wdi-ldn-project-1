const Landmark = require('../models/landmark');

function indexRoute(req, res, next) {
  Landmark
  .find()
  .populate('createdBy')
  .exec()
  .then((landmarks) => res.render('landmarks/index', { landmarks }))
  .catch(next);
}

function newRoute(req, res) {
  return res.render('landmarks/new');
}

function createRoute(req, res, next) {

  req.body.createdBy = req.user;
  if(req.file) req.body.image = req.file.key;
  Landmark
  .create(req.body)
  .then(() => res.redirect('/landmarks'))
  .catch((err) => {
    if(err.name === 'ValidationError') return res.badRequest(`/landmarks/${req.params.id}/edit`, err.toString());
    next(err);
  });
}

function showRoute(req, res, next) {
  Landmark
  .findById(req.params.id)
  .populate('createdBy comments.createdBy')
  .exec()
  .then((landmark) => {
    if(!landmark) return res.notFound();
    return res.render('landmarks/show', { landmark });
  })
  .catch(next);
}



function editRoute(req, res, next) {
  Landmark
  .findById(req.params.id)
  .populate('createdBy comments.createdBy')
  .exec()
  .then((landmark) => {
    if(!landmark) return res.redirect();
    if(!landmark.belongsTo(req.user)) return res.unauthorized(`/landmarks/${landmark.id}`, 'You do not have permission to edit that resource');
    else {
      return res.render('landmarks/edit', { landmark });
    }
  })
  .catch(next);
}

function updateRoute(req, res, next) {
  Landmark
  .findById(req.params.id)
  .exec()
  .then((landmark) => {
    if(!landmark) return res.notFound();
    if(!landmark.belongsTo(req.user)) return res.unauthorized(`/landmarks/${landmark.id}`, 'You do not have permission to edit that resource');

    for(const field in req.body) {
      landmark[field] = req.body[field];
    }
    return landmark.save();
  })
  .then(() => res.redirect(`/landmarks/${req.params.id}`))
  .catch((err) => {
    if(err.name === 'ValidationError') return res.badRequest(`/landmarks/${req.params.id}/edit`, err.toString());
    next(err);
  });
}

function deleteRoute(req, res, next) {
  Landmark
  .findById(req.params.id)
  .exec()
  .then((landmark) => {
    if(!landmark) return res.notFound();
    // if(!landmark.belongsTo(req.user)) return res.unauthorized(`/landmarks/${landmark.id}`, 'You do not have permission to delete that resource');
    return landmark.remove();
  })
  .then(() => res.redirect('/landmarks'))
  .catch(next);
}

function createCommentRoute(req, res, next) {

  req.body.createdBy = req.user;

  Landmark
  .findById(req.params.id)
  .exec()
  .then((landmark) => {
    if(!landmark) return res.notFound();

    landmark.comments.push(req.body);
    return landmark.save();
  })
  .then((landmark) => res.redirect(`/landmarks/${landmark.id}`))
  .catch(next);
}

function deleteCommentRoute(req, res, next) {
  Landmark
    .findById(req.params.id)
    .exec()
    .then((landmark) => {
      if(!landmark) return res.notFound();
      // get the embedded record by it's id
      const comment = landmark.comments.id(req.params.commentId);
      comment.remove();

      return landmark.save();
    })
    .then((landmark) => res.redirect(`/landmarks/${landmark.id}`))
    .catch(next);
}

module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  createComment: createCommentRoute,
  deleteComment: deleteCommentRoute
};
