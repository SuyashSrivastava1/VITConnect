const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const channelRoutes = require('./routes/channelRoutes');
const setupSocket = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // For MVP, allow all origins
    methods: ['GET', 'POST']
  }
});

setupSocket(io);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
