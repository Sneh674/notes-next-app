import mongoose from 'mongoose';

const connect= async()=>{
    try{
        mongoose.connect(process.env.DB_URL!)//! - for 
        const connection=mongoose.connection;

        connection.on('connected',()=>{
            console.log('MongoDB connected successfully')
        })
        connection.on('error',(err)=>{
            console.log(`MongoDB connection error: ${err}`)
        })
    }
    catch(error){
        console.log(`Error occurred while connecting nto db: ${error}`)
    }
}

export default connect;