require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const User = require('./models/User');
const config = require('./config/config');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: config.corsOptions // Use the same CORS options as HTTP
});

app.use(cors(config.corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(config.mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

const userSockets = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('Authenticated user connected:', socket.id, 'User ID:', socket.userId);

  socket.on('user-online', async () => {
    try {
      const userId = socket.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, { online: true });
        userSockets.set(userId, socket.id);
        io.emit('status-update', { userId, online: true });
        console.log(`User ${userId} is now online (Socket ID: ${socket.id})`);
      }
    } catch (error) {
      console.error('Error updating user online status:', error);
    }
  });

  socket.on('send-message', async (message) => {
    try {
      const senderId = socket.userId;
      if (!senderId) {
        console.error('No sender ID found for socket:', socket.id);
        return;
      }

      const fullMessage = { ...message, sender: senderId };
      const receiverSocketId = userSockets.get(message.receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive-message', fullMessage);
        console.log(`Message sent to receiver ${message.receiver} (Socket ID: ${receiverSocketId})`);
      } else {
        console.log(`Receiver ${message.receiver} is offline or not connected. Message stored in MongoDB.`);
      }
      io.to(socket.id).emit('receive-message', fullMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      const userId = socket.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, { online: false });
        userSockets.delete(userId);
        io.emit('status-update', { userId, online: false });
        console.log(`User ${userId} disconnected and marked offline`);
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});