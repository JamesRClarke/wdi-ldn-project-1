const mongoose = require('mongoose');
const timeAgo = require('time_ago_in_words');


const commentSchema = new mongoose.Schema({
  content: {type: String, required: true},
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now}
}, {
  timestamps: true
});

commentSchema.methods.belongsTo = function belongsTo(user) {
  if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
  return user.id === this.createdBy.toString();
};

commentSchema
  .virtual('timeAgo')
  .get(function getImageSRC() {
    return timeAgo(this.createdAt);
  });


const landmarkSchema = new mongoose.Schema({
  image: {type: String},
  caption: {type: String},
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  lat: {type: Number},
  lng: {type: Number},
  title: {type: String},

  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema]
}, {
  timestamps: true
});

landmarkSchema
  .virtual('timeAgo')
  .get(function getImageSRC() {
    return timeAgo(this.createdAt);
  });


landmarkSchema.virtual('imageSRC')
.get(function getImageSRC() {
  if(!this.image) return null;
  if(this.image.match(/^http/)) return this.image;
  return `https://s3-eu-west-1.amazonaws.com/wdi27-london/${this.image}`;
});

landmarkSchema.methods.belongsTo = function belongsTo(user) {
  if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
  return user.id === this.createdBy.toString();
};


module.exports = mongoose.model('Landmark', landmarkSchema );
