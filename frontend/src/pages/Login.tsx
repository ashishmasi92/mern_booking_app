import { useForm } from "react-hook-form";
import { loggedIn } from "../api_client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  let x = useAppContext();
  let navigate = useNavigate();
  let location = useLocation();
  let queryClient = useQueryClient();
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  let mutation = useMutation({
    mutationFn: loggedIn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["validate"] });
      x.showToast({ message: "User Logged In Successfully", type: "Success" });
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (err: Error) => {
      x.showToast({ message: err.message, type: "Error" });
      console.log("logged in error", err.message);
    },
  });

  const onSubmit = handleSubmit((d) => {
    mutation.mutate(d);
  });

  return (
    <div>
      <form action="" onSubmit={onSubmit} className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Sign In</h2>
        <div className="">
          <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
            Email
            <input
              type="email"
              id="loginuseremail"
              {...register("email", {
                required: "this field must be required",
                validate: (v) => {
                  if (!v.includes("@")) {
                    return "email address must be valid";
                  }
                },
              })}
              className="border rounded w-full py-1 px-2 font-normal"
            />
          </label>
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}
        </div>
        <div className="">
          <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
            Password
            <input
              type="Password"
              id="loginuserpassword"
              {...register("password", {
                required: "this field must be required",
                minLength: {
                  value: 6,
                  message: "password length at least greater than 6 character",
                },
              })}
              className="border rounded w-full py-1 px-2 font-normal"
            />
          </label>
          {errors.password && (
            <span className="text-sm text-red-600">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">
            Not Registered?
            <Link
              className="underline cursor-pointer font-semibold hover:text-blue-400"
              to="/register"
            >
              Create an account
            </Link>
          </span>
          <span>
            <button
              type="submit"
              id="loginuserbutton"
              className="bg-blue-600 text-white font-bold hover:bg-blue-400 px-2 py-1 rounded"
            >
              Submit
            </button>
          </span>
        </div>
      </form>
    </div>
  );
}
