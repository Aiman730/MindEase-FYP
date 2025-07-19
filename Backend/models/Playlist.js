const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  userId: String,
  title: String,
  artist: String,
  duration: String,
  fileUri: String,
  image: String,
  isFavorite: { type: Boolean, default: false } 
});


const playlistSchema = new mongoose.Schema({
  userId: String,
  songs: [songSchema],
});

module.exports = mongoose.model('Playlist', playlistSchema);