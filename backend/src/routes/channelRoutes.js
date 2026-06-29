const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// Get all channels for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const channels = await prisma.channel.findMany({
      where: {
        channel_members: {
          some: {
            user_id: userId
          }
        }
      },
      include: {
        messages: {
          orderBy: {
            sent_at: 'desc'
          },
          take: 1
        }
      }
    });

    res.json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get message history for a specific channel
router.get('/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    // Verify user is a member of the channel
    const member = await prisma.channelMember.findUnique({
      where: {
        channel_id_user_id: {
          channel_id: id,
          user_id: userId
        }
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'Not a member of this channel' });
    }

    const messages = await prisma.message.findMany({
      where: {
        channel_id: id
      },
      include: {
        sender: {
          select: {
            user_id: true,
            display_name: true
          }
        }
      },
      orderBy: {
        sent_at: 'asc'
      },
      take: 100 // Limit for MVP
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
