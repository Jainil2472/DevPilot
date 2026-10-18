import mongoose from "mongoose";
import 'dotenv/config';

const connect = async():Promise<void> => {

    try {
        const url = process.env.DATABASE_URL;
        if (!url) {
            throw new Error("the database url is missing ")
        }
        await mongoose.connect(url);
        console.log("database is connected");
        
    } catch (error) {
        console.log("database connection failed ",error);
        process.exit(1);
    }
}


export default connect;