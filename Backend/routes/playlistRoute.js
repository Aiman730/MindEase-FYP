const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Playlist = require('../models/Playlist');



//route playlist
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });



// Upload and save song
router.post('/add', async (req, res) => {
  const { userId, title, artist, duration, fileUri, image } = req.body;
  console.log("✅ Adding song with data:", { title, artist, duration, fileUri, image });

  if (!fileUri || !title || !artist || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let playlist = await Playlist.findOne({ userId });

    if (!playlist) {
      playlist = new Playlist({ userId, songs: [] });
    }

    playlist.songs.push({ title, artist, duration, fileUri, image });
    await playlist.save();

    res.json({ message: 'Song added to playlist', playlist });
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({ error: error.message });
  }
});




// Fetch user's playlist
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const playlist = await Playlist.findOne({ userId });
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }
  res.json(playlist);
});



// DELETE: Remove song by title or ID
router.delete('/delete/:songId/:userId', async (req, res) => {
  const { songId, userId } = req.params;
  console.log('Deleting song:', songId, 'for user:', userId);

  let songObjectId;
  try {
    // Convert songId to a valid MongoDB ObjectId
    songObjectId = new mongoose.Types.ObjectId(songId);
    console.log('Valid ObjectId:', songObjectId);
  } catch (e) {
    console.error('Invalid song ID:', songId, e);
    return res.status(400).json({ message: 'Invalid song ID format' });
  }

  try {
    // Check if the song exists and pull it from the playlist
    const result = await Playlist.updateMany(
      { userId, 'songs._id': songObjectId },
      { $pull: { songs: { _id: songObjectId } } }
    );

    console.log('Update result:', result);

    if (result.modifiedCount === 0) {
      console.log('No song found for this songId in this user\'s playlist');
      return res.status(404).json({ message: 'Song not found in any playlist' });
    }

    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    return res.status(500).json({ message: 'An error occurred while deleting the song', error: error.message });
  }
});



router.put('/song/:songId/:userId', async (req, res) => {
  const { songId, userId } = req.params;
  const { title } = req.body;
  console.log('updating song:', songId, 'for user:', userId);

  let songObjectId;
  try {
    // Convert songId to a valid MongoDB ObjectId
    songObjectId = new mongoose.Types.ObjectId(songId);
    console.log('Valid ObjectId:', songObjectId);
  } catch (e) {
    console.error('Invalid song ID:', songId, e);
    return res.status(400).json({ message: 'Invalid song ID format' });
  }

  // Validate that both songId and userId are valid
  if (!mongoose.Types.ObjectId.isValid(songId)) {
    return res.status(400).json({ message: 'Invalid songId format' });
  }

  // userId is assumed to be a string based on your schema definition
  if (!userId) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }

  try {
    // Find the playlist by userId and songId
    const playlist = await Playlist.findOne({ userId, 'songs._id': songObjectId });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist or song not found' });
    }

    // Access the song by its ObjectId
    const song = playlist.songs.id(songObjectId);

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Check if the title is the same as before
    if (song.title === title) {
      return res.status(400).json({ message: 'Title is the same as before' });
    }

    // Update the song title
    song.title = title;
    await playlist.save();

    res.status(200).json({ message: 'Song updated successfully' });
  } catch (err) {
    console.error('Error updating song:', err.message);
    res.status(500).json({ message: 'Failed to update song' });
  }
});



/// Toggle favorite status - improved version
router.put('/toggle-favorite/:songId/:userId', async (req, res) => {
  try {
    const { songId, userId } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ error: 'Invalid song ID' });
    }

    const playlist = await Playlist.findOne({ userId });
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found for this user' });
    }

    const song = playlist.songs.id(songId);
    if (!song) {
      return res.status(404).json({ error: 'Song not found in playlist' });
    }

    // Toggle favorite status
    song.isFavorite = !song.isFavorite;
    await playlist.save();

    res.json({ 
      success: true,
      isFavorite: song.isFavorite,
      message: 'Favorite status updated'
    });

  } catch (error) {
    console.error('Error in toggle-favorite:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
});


// Get favorites
router.get('/favorites/:userId', async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ userId: req.params.userId });
    if (!playlist) return res.json([]);
    
    // Return full song objects with isFavorite flag
    const favorites = playlist.songs
      .filter(song => song.isFavorite)
      .map(song => ({
        _id: song._id,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        fileUri: song.fileUri,
        image: song.image,
        isFavorite: true
      }));
      
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// router.get('/favorites/:userId', async (req, res) => {
//   try {
//     const playlist = await Playlist.findOne({ userId: req.params.userId });
//     if (!playlist) return res.json([]);
    
//     const favorites = playlist.songs.filter(song => song.isFavorite);
//     res.json(favorites);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


module.exports = router;