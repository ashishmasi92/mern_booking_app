import mongoose ,{Document,Model} from "mongoose";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { UserType } from "../shared/type";
import "dotenv/config"

// export type UserType={
//     _id:string;
//     email:string;
//     password:string;
//     firstName:string;
//     lastName:string
// }



// 2️⃣ Extend mongoose Document to include methods
export interface UserDocument extends UserType, Document {
  accessToken(): string;
  isPasswordCorrect(password: string): Promise<boolean>;
}


const userSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:60
    },
    firstName:{
        type:String,
        reqired:true,
    },
    lastName:{
        type:String,
        required:true
    }

},{
  timestamps:true
})


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return 
  }

  this.password = await bcrypt.hash(this.password, 10);

});

userSchema.methods.isPasswordCorrect = function (password:string): Promise <boolean> {
    return bcrypt.compare(password,this.password)

}


userSchema.methods.accessToken = function (){

    return jwt.sign({
        id:this._id,
email:this.email,
    },
    process.env.ACCESSTOKEN_SECRET as string,
    {expiresIn:"1d"}
)
}

const User = mongoose.model<UserDocument>("User",userSchema)


export default User