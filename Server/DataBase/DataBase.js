import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const connectDB=async()=>{
    try {
        await mysql.createConnection({
            host:process.env.DB_HOST,
            user:process.env.DB_USER,
            password:process.env.DB_PASSWORD,
            database:process.env.DB_DATABASE
        });
        console.log("MySQL connected");
    } catch (error) {
        console.log(error);
    }
}
export default connectDB;
