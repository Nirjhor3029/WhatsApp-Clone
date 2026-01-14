const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/dbConnect');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoute');

dotenv.config();

const app = express();

//Middlewares
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies



connectDB();

// Routes
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});