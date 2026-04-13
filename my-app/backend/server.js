const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '.env' });

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(async () => {
    console.log('MongoDB connected');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
  })
  .catch(err => console.log('MongoDB connection error:', err));

mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
mongoose.connection.on('error', (err) => console.log('MongoDB error:', err));

// Main change: mount authentication routes
app.use("/api/auth", authRoutes);

// Main change: mount user profile management routes
app.use("/api/users", userRoutes);

// Main change: mount project management routes
app.use("/api/projects", projectRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);
