import { useEffect } from "react";

type ToastProps = {
  message: string,
  type: "Success" | "Error",
  onClose:()=>void,
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    let timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
 
  return (
    <div>
      <div className={`${type=="Success" ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md":"fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md"}`}>
        <div className="flex justify-center items-center ">
            <span className="text-sm font-semibold">
                {message}
            </span>
        </div>
      </div>
    </div>
  );
}
