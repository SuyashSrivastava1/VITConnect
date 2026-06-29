const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function saveMessage(data) {
  const { channel_id, sender_id, content, reply_to } = data;

  const message = await prisma.message.create({
    data: {
      channel_id,
      sender_id,
      content,
      reply_to
    },
    include: {
      sender: {
        select: {
          user_id: true,
          display_name: true
        }
      }
    }
  });

  return message;
}

module.exports = { saveMessage };
