const rp = require('request-promise');
const oauth = require('../config/oauth');
const User = require('../models/user');


function github (req, res, next) {

  return rp({
    method: 'POST',
    url: oauth.github.accessTokenUrl,
    qs: {
      client_id: oauth.github.clientId,
      client_secret: oauth.github.clientSecret,
      code: req.query.code
    },
    json: true
  })
  .then((token) => {
    return rp({
      method: 'GET',
      url: oauth.github.profileUrl,
      qs: token,
      json: true,
      headers: {'User-Agent': 'JamesRClarke'}
    });
  })
  .then((profile) => {
    return User
    .findOne({ $or: [{ email: profile.email }, { githubId: profile.id }] })
    .then((user) => {
      if(!user) {
        user = new User({
          username: profile.login
        });
        if(profile.email) user.email = profile.email;
      }

      user.githubId = profile.id;
      return user.save();
    });
  })
  .then((user) => {
    req.session.userId = user.id;
    req.session.isAuthenticated = true;

    req.flash('info', `Welcome back, ${user.username}!`);
    res.redirect('/');
  })
  .catch(next);
}

function instagram (req, res, next) {

  return rp({
    method: 'POST',
    url: oauth.instagram.accessTokenUrl,
    form: {
      client_id: oauth.instagram.clientId,
      client_secret: oauth.instagram.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: oauth.instagram.redirectUri,
      code: req.query.code
    },
    json: true
  })
  .then((token) => {
    console.log('token', token);
    return User
    .findOne({ $or: [{ email: token.user.email }, { instagramId: token.user.id }] })
    .then((user) => {
      if(!user) {
        user = new User({
          username: token.user.username,
          image: token.user.profile_picture
        });
      }

      user.instagramId = token.user.id;
      return user.save();
    });
  })
  .then((user) => {
    req.session.userId = user.id;
    req.session.isAuthenticated = true;

    req.flash('info', `Welcome back, ${user.username}!`);
    res.redirect(`/`);
  })
  .catch(next);
}


module.exports = {
  github,
  instagram
};
