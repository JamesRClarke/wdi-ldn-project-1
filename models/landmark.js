const mongoose = require('mongoose');

const landmarkSchema = new mongoose.Schema({
  image: {type: String}
});


module.exports = mongoose.model('Landmark', landmarkSchema );
