import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import "dotenv/config"



cloudinary.config({
cloud_name:process.env.CLOUDINARY_CLOUD_NAME!,
api_key:process.env.CLOUDINARY_CLOUD_API_KEY!,
api_secret:process.env.CLOUDINARY_CLOUD_SECRET_KEY!
})



const uploadOnCloudinary = async (localPath:string) :Promise <string |undefined> =>{
try {
    if(!localPath){
        console.log("no path provided");
        return;
    }

    let response = await cloudinary.uploader.upload(localPath,{
        resource_type:"auto",
        folder:"booking_uploads_img"
    })

    // console.log("image uploaded successfully ",response.url);
    return response.secure_url
    
} catch (error) {
    console.log("error occur while file uploading",error);
    if(localPath && fs.existsSync(localPath)){
        fs.unlinkSync(localPath)
    }
        
}

}

export default uploadOnCloudinary