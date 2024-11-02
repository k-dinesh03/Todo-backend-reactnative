const express = require("express");
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require("mongoose");

const todoRoutes = require('./routes/todo');
const userRoutes = require('./routes/users');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/todo', todoRoutes);
app.use('/users', userRoutes);

app.get('/', (req: any, res: any) => {
    res.send('<h3>Server Working...</h3>');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL || '')
    .then(() => {
        console.log('Connected to MongoDB');
        // Server
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((error: any) => console.error('Connection to MongoDB failed:', error));
