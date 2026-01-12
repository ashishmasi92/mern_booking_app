import { useMutation , useQueryClient} from "@tanstack/react-query";
import { logout } from "../api_client";
import { useAppContext } from "../contexts/AppContext";

export default function SignOutButton() {
  let x = useAppContext();
let queryClient = useQueryClient()
  let mutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
        // queryClient.setQueryData(["validate"], null);
  await queryClient.invalidateQueries({ queryKey: ["validate"] });
      x.showToast({ message: "user logged out successfully", type: "Success" });
    },
    onError: (error: Error) => {
      x.showToast({ message: error.message, type: "Error" });
    },
  });

  let userLoggedOut = ()=>{
    mutation.mutate()
  }


  return (
    <div>
      <button onClick={userLoggedOut} className="text-blue-500 px-3 font-bold bg-white hover:bg-gray-100">
        Log Out
      </button>
    </div>
  );
}
