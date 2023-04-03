require('dotenv').config();
const express = require('express');
const app = express();
const normalizePort = require('./utils/normalizePort');

const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const { requestLogger, errorLogger } = require('./middleware/logEvents');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const path = require('path');
const userRoutes = require('./routes/user');

const errorHandler = require('./middleware/errorHandler');

const PORT = normalizePort(process.env.PORT || '3000');
app.set('PORT', PORT);

// Connect to MongoDB
connectDB();

// Monitoring requests
app.use(requestLogger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Parse req.body in JSON format
app.use(express.json());

// Static images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/auth/', userRoutes);

// Monitoring errors
app.use(errorLogger);

app.on('error', errorHandler);
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
