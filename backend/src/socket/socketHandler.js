const { saveMessage } = require('../services/messageService');

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_channels', (channelIds) => {
      channelIds.forEach(id => {
        socket.join(id);
        console.log(`Socket ${socket.id} joined channel ${id}`);
      });
    });

    socket.on('send_message', async (data) => {
      try {
        const message = await saveMessage(data);
        // Broadcast to everyone in the channel, including sender
        io.to(data.channel_id).emit('new_message', message);
      } catch (error) {
        console.error('Error saving/sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

module.exports = setupSocket;
