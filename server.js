require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./src/routes/v1/userRoutes');
require('./src/configs/db'); // DB connection

const app = express();

// ✅ CORS Middleware
// app.use(cors({
//     origin: 'http://localhost:5176', // Allow frontend origin
//     credentials: true               // Optional: needed if using cookies/auth headers
// }));

// ✅ Allow CORS for all origins (open access)
app.use(cors());

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// API Versioning
app.use('/api/v1/', userRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
