import { useForm } from "react-hook-form";
  import {useMutation } from "@tanstack/react-query"
import { registered} from "../api_client.ts";
import { useAppContext } from "../contexts/AppContext.tsx";




export  type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
const x = useAppContext()
  const { register,watch,handleSubmit,formState:{errors} } = useForm<RegisterFormData>();
  let mutation = useMutation({
    mutationFn:registered,
    onSuccess:()=>{
      x.showToast({message:"register successfully",type:"Success"})      
    },
    onError:(err:Error)=>{
        console.log("error",err);
        x.showToast({message:err.message,type:"Error"})        
    }
  })
  const onSubmit= handleSubmit((d)=>{
    mutation.mutate(d)
  });



  return (
    <div>
      <form action="" onSubmit={onSubmit} className="flex flex-col gap-5">
        <h2 className="text-3xl font-bold">Create an Account</h2>
        <div className="flex  flex-col md:flex-row gap-5 ">
          <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
            First Name
            <input
              type="text"
              {...register("firstName", {
                required: "this field must be required",
              })}
              className="border rounded w-full py-1 px-2 font-normal"
            />
            {errors.firstName && <span className="error" >{errors.firstName.message}</span>}
          </label>
          <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
            LastName
            <input
              type="text"
              {...register("lastName", {
                required: "this field must be required",
              })}
              className="border rounded w-full py-1 px-2 font-normal"
            />
{errors.lastName && <span className="error" >{errors.lastName.message}</span>}
          </label>
        </div>

        <div className="">
          <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
            Email
            <input
              type="email"
              {...register("email", {
                required: "this field must be required",
                validate:(v)=>{
                    if(!v.includes("@")){
return "email address must be valid"
                    }
                }
              })}
              className="border rounded w-full py-1 px-2 font-normal"
            />
            {errors.email && <span className="error" >{errors.email.message}</span> }
          </label>
        </div>
        
        <div className="">
          <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
            Password
            <input
              type="password"
              {...register("password", {
                required: "this field must be required",
                minLength:{
                    value:6,
                    message:"password must be at least 6 character"
                }
                
              })}
              className="border rounded w-full py-1 px-2 font-normal"
            />
            {errors.password && <span className="error" >{errors.password.message}</span>}
          </label>
        </div>
        
        <div className="">
          <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
            ConfirmPassword
            <input
              type="password"
              {...register("confirmPassword", {
                validate:(v)=>{
                    if(!v){
                        return "this field must be required"
                    }else if(watch("password") !== v ){
                        return "password do not match"
                    }
                }
              })}
              className="border rounded w-full py-1 px-2 font-normal"
            />
            {errors.confirmPassword && <span className="error" >{errors.confirmPassword.message}</span>}
          </label>
        </div>
        <span>
            <button type="submit" className="bg-blue-600 text-white font-bold hover:bg-blue-400 px-2 py-1 rounded">
            Submit
            </button>
        </span>
      </form>
    </div>
  );
}
