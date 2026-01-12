// import type { ReactNode } from "react"
import { Navigate,Outlet } from "react-router-dom"
// interface ProtectedRouteProps {
//  children:ReactNode
// }
import {useAppContext} from "../contexts/AppContext";

export default function ProtectedRoute() {
      console.log("token");
const {isLoggedIn,isLoading} = useAppContext()
    console.log(isLoggedIn,isLoading)

    if(isLoading){
        return  <div>checking Authentication...</div>
    }

  if(!isLoggedIn){
return <Navigate to="/sign-in" replace />
  }
  
    return <>
    <Outlet/>
    </>
}
