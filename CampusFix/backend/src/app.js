const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const authRoutes = require('./routes/auth.js');
// const userRoutes = require('./routes/users.js');
const issueRoutes = require('./routes/issues.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ message: 'CampusFix backend is running' }));

app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

module.exports = app;
