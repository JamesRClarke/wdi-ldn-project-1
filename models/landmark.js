const mongoose = require('mongoose');

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



const landmarkSchema = new mongoose.Schema({
  image: {type: String},
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema]
}, {
  timestamps: true
});

landmarkSchema.methods.belongsTo = function belongsTo(user) {
  if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
  return user.id === this.createdBy.toString();
};


module.exports = mongoose.model('Landmark', landmarkSchema );
