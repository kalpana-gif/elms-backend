const prisma = require('../models/prismaClient');

async function testConnection() {
    try {
        await prisma.$connect();
        console.log('✅ Connected to the database.');
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    }
}

testConnection();
