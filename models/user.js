const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const s3 = require('aws-sdk/clients/s3');

const userSchema = new mongoose.Schema({
  firstName: { type: String},
  lastName: { type: String},
  gender: {type: String, enum: ['Male', 'Female', 'Other']},
  email: { type: String},
  username: { type: String},
  image: {type: String},
  password: { type: String },
  githubId: { type: Number },
  instagramId: { type: Number }

});

userSchema
.virtual('imageSRC')
.get(function getImageSRC() {
  if(!this.image) return null;
  if(this.image.match(/^http/)) return this.image;
  return `https://s3-eu-west-1.amazonaws.com/wdi27-london/${this.image}`;
});



userSchema.virtual('passwordConfirmation')
.set(function setPasswordConfirmation(passwordConfirmation) {
  this._passwordConfirmation = passwordConfirmation;
});


// lifecycle hook - mongoose middleware
userSchema.pre('validate', function checkPassword(next) {

  if((!this.password && !this.instagramId) && (!this.password && !this.githubId) ) {
    this.invalidate('password', 'required');
  }

  if(this.password && this._passwordConfirmation !== this.password){
    this.invalidate('passwordConfirmation', 'does not match');
  }
  next();
});

userSchema.pre('save', function checkPassword(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

userSchema.pre('remove', function removeImage(next) {
  s3.deleteObject({ Key: this.image }, next);
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
