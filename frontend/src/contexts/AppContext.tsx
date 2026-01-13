import { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import { validateToken } from "../api_client";
import { loadStripe} from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";

const Stripe_Bub_Key = import.meta.env.VITE_PUBLISHER_KEY || "";

type ToastMessage = {
  message: string;
  type: "Success" | "Error";
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  stripePromise: Promise<Stripe | null>;
};

const AppContext = createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(Stripe_Bub_Key);

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

  //   const { isError } = useQuery({
  //     queryKey: ["validate"],
  //     queryFn: validateToken,
  //     retry:false
  //   });
  // const { data:user  } = useQuery({
  //     queryKey: ["validate"],
  //     queryFn: async()=>{
  //         let res = await validateToken()
  // console.log(res);

  //         return res===true
  //     },
  //     retry: false,
  //   });

  const { data: isLoggedIn = false, isLoading } = useQuery({
    queryKey: ["validate"],
    queryFn: validateToken, // directly use the function
    retry: false,
  });
  // console.log("user:", isLoggedIn);

  return (
    <div>
      <AppContext.Provider
        value={{
          showToast: (toastMessage) => {
            setToast(toastMessage);
          },
          isLoggedIn,
          isLoading,
          stripePromise,
        }}
      >
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => {
              setToast(undefined);
            }}
          />
        )}
        {children}
      </AppContext.Provider>
    </div>
  );
}
