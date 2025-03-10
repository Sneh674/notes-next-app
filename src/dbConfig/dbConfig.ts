import mongoose from 'mongoose';

const connect= async()=>{
    try{
        if (mongoose.connection.readyState === 1) {
            console.log("Already connected to MongoDB.");
            return;
        }
        await mongoose.connect(process.env.DB_URL!)//! - for 
        const connection=mongoose.connection;

        connection.on('connected',()=>{
            console.log('MongoDB connected successfully')
        })
        connection.on('error',(err)=>{
            console.log(`MongoDB connection error: ${err}`)
        })
    }
    catch(error){
        console.log(`Error occurred while connecting to db: ${error}`)
    }
}
const disconnect = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.log(`Error occurred while disconnecting from db: ${error}`);
    }
};

export { connect,disconnect };