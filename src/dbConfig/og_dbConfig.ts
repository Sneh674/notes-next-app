import mongoose from 'mongoose';
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connect= async()=>{
    try{
        console.log("DNS SERVERS:", dns.getServers());
        if (mongoose.connection.readyState === 1) {
            console.log("Already connected to MongoDB.");
            return;
        }
        console.log('trial')
        if(process.env.DB_URL===undefined){
            throw new Error("DB_URL is not defined in the environment variables.");
        }
        // await mongoose.connect(process.env.DB_URL!)//! - for 
        await mongoose.connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("MongoDB connected successfully");
        console.log("Ready state:", mongoose.connection.readyState);
        console.log("Database:", mongoose.connection.db?.databaseName);
        console.log('trial2')
        const connection=mongoose.connection;

        connection.on('connected',()=>{
            console.log('MongoDB connected successfully')
        })
        connection.on('error',(err)=>{
            console.log(`MongoDB connection error: ${err}`)
        })
    }
    catch(error){
        console.error(error);
        console.log(`Error occurred while connecting to db: ${error}`)
    }
}
const disconnect = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error(error);
        console.log(`Error occurred while disconnecting from db: ${error}`);
    }
};

export { connect,disconnect };