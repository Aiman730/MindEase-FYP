const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const playlistRoutes=require('./routes/playlistRoute');
const settingsRoutes = require('./routes/settingsRoutes');
const heartbeatRoutes = require('./routes/heartbeatRoutes')

const app = express();
app.use(cors({ origin: '*' }));  // Allow all origins, or specify your domain

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/playlist', playlistRoutes)
app.use('/api/settings', settingsRoutes);
app.use('/api/heartbeat', heartbeatRoutes);

let latestHeartbeat = 0;

app.post('/heartbeat', (req, res) => {
  latestHeartbeat = req.body.heartbeat;
  res.sendStatus(200);
});

app.get('/heartbeat', (req, res) => {
  res.json({ heartbeat: latestHeartbeat });
});


app.get('/', (req, res) => {
  console.log('GET / called');
  res.send('Server working!');
});

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/FYP')
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });



// Start the server on port 3000
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});