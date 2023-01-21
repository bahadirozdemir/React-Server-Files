 import {Navigate, Outlet,useNavigate} from "react-router-dom";
import { useContext} from 'react'
import { AuthContext } from '../Context/AuthProvider'
export default function AuthLayout(){
const {currentuser} = useContext(AuthContext);
 
  console.log(currentuser)
  if(currentuser==null)
  {
    console.log("kullanıcı yok logine yönlendirdim.") 
    return <Navigate to="/login" replace />
  }
  else
  {
    return <Outlet/>
  }
   
 

 

}
