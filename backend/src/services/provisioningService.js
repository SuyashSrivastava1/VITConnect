const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function provisionUser(userId, academicData) {
  const { dept_code, batch_year, section, course_list } = academicData;

  const channelsToProvision = [
    { name: 'Global VIT Chennai', type: 'official' },
    { name: `${dept_code}-${batch_year}`, type: 'official' },
    { name: `${dept_code}-${section}`, type: 'official' }
  ];

  course_list.forEach(course => {
    channelsToProvision.push({ name: course, type: 'course' });
  });

  for (const channelData of channelsToProvision) {
    // 1. Find or create channel
    let channel = await prisma.channel.findUnique({
      where: { name: channelData.name }
    });

    if (!channel) {
      channel = await prisma.channel.create({
        data: {
          name: channelData.name,
          type: channelData.type
        }
      });
    }

    // 2. Add user to channel (upsert to handle idempotency)
    await prisma.channelMember.upsert({
      where: {
        channel_id_user_id: {
          channel_id: channel.channel_id,
          user_id: userId
        }
      },
      update: {}, // Do nothing if exists
      create: {
        channel_id: channel.channel_id,
        user_id: userId
      }
    });
  }
}

module.exports = { provisionUser };
