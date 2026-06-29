const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { provisionUser } = require('./provisioningService');

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'vitconnect_super_secret_key_123';

// Mock academic data mapping
const MOCK_DATA = {
  CSE: {
    courses: ['CS3401', 'CS3402', 'CS3403', 'MA3301'],
    sections: ['A', 'B', 'C', 'D']
  },
  ECE: {
    courses: ['EC3401', 'EC3402', 'MA3301'],
    sections: ['A', 'B', 'C']
  }
};

async function login(regNo) {
  // 1. Parse reg number (e.g., 23BCE1234 -> year: 2023, dept: CSE)
  const regRegex = /^(\d{2})B([A-Z]{2})\d{4}$/i;
  const match = regNo.match(regRegex);
  
  if (!match) {
    throw new Error('Invalid registration number format. Expected format: 23BCE1234');
  }

  const year = `20${match[1]}`;
  const deptCode = match[2].toUpperCase();
  
  const deptData = MOCK_DATA[deptCode] || MOCK_DATA['CSE']; // Fallback to CSE
  
  // Assign a mock section based on reg number hash
  const sectionIndex = regNo.charCodeAt(regNo.length - 1) % deptData.sections.length;
  const section = deptData.sections[sectionIndex];
  
  const academicData = {
    dept_code: deptCode,
    batch_year: year,
    section: section,
    course_list: deptData.courses
  };

  // 2. Find or create user
  let user = await prisma.user.findUnique({
    where: { reg_no: regNo.toUpperCase() }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        reg_no: regNo.toUpperCase(),
        display_name: `Student ${regNo.toUpperCase()}`
      }
    });
  }

  // 3. Auto-provision channels
  await provisionUser(user.user_id, academicData);

  // 4. Generate JWT
  const token = jwt.sign(
    { user_id: user.user_id, reg_no: user.reg_no, display_name: user.display_name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, user, academicData };
}

module.exports = { login };
