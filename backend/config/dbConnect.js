const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/whatsapp-clone';
const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDb Connected successfully! \nHost: ${conn.connection.host} \nDatabase:  ${conn.connection.name} `,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log("Error in connecting to mongoDB",error);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;