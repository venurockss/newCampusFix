const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client'); // ✅ Correct import

dotenv.config();

const prisma = new PrismaClient(); // ✅ Create instance
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');

    const server = http.createServer(app);
    server.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));

    const shutdown = async () => {
      console.log('🛑 Shutting down...');
      await prisma.$disconnect();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('❌ Failed to start server', err);
    process.exit(1);
  }
}

start();
