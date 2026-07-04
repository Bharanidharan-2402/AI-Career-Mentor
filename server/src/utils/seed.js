import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const run = async () => {
  await connectDB();
  await User.create({
    name: 'Test Student',
    email: 'student@mentor.app',
    password: '$2b$12$KIXM3nYDFrXm8Z/kxoYZ6.NfWGB2o6A2A5Y8q1e3hnHtITbD5F0vy',
    careerGoal: 'Full-Stack Developer'
  });
  console.log('Seed data created');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
