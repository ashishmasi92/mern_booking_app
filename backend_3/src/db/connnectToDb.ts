import mongoose from "mongoose";
import "dotenv/config"

let url = process.env.MONGODB_URL || process.env.MONGO_URL



let tries = 0;
let max_tries=5;

if (!url) {
  throw new Error("❌ MONGO_URL environment variable is not defined");
}

async function connectToDb(url:string):Promise <void>{
try {    
   let response = await mongoose.connect(url)
   console.log("connect to Database",response.connection.host);
} catch (error) {
    console.log("error while connected to db",error);
    tries++

    if(tries<max_tries){
        console.log("retrying in 3 sec..");
        await new Promise((res)=>{
            setTimeout(res,3000)
        })
        await connectToDb(url)
        
    }else{
        throw new Error("After so many attempt database still not connected.")
    }

}
}


connectToDb(url);
