import mongoose from "mongoose";


const dbConfig = () => {
    try {
        mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log("The MongoDB Connected Successfully");
        }).catch((error) => {
            console.log(error);
        })
    } catch (error) {
        console.log(error);
    }
}


export default dbConfig;