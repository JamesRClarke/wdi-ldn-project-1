const User = require('../models/user');
const oauth = require('../config/oauth');

function sessionsNew(req, res) {
  res.render('sessions/new', {oauth});
}

function sessionsCreate(req, res, next) {
  User
  .findOne({ email: req.body.email })
  .then((user) => {
    if(!user || !user.validatePassword(req.body.password)) {
      req.flash('danger', 'Unknown email/password combination');
      return res.redirect('/login');
    }

    req.user = user;
    req.session.userId = user.id;
    req.session.isAuthenticated = true;

    req.flash('success', `Welcome, ${user.username}!`);
    res.redirect('/landmarks');
  })
  .catch(next);
}

function sessionsDelete(req, res) {
  req.session.regenerate(() => res.redirect('/'));
}

module.exports = {
  new: sessionsNew,
  create: sessionsCreate,
  delete: sessionsDelete
};
