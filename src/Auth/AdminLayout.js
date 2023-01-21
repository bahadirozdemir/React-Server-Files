import {Navigate, Outlet,useNavigate} from "react-router-dom";
import { useContext} from 'react'
import { AuthContext } from '../Context/AuthProvider'
import PermisionAdmin from "../ErrorPage/PermisionAdmin";
export default function AdminLayout(){
const {currentuser} = useContext(AuthContext);
 
  console.log(currentuser)
  if(currentuser==null)
  {
    console.log("kullanıcı yok logine yönlendirdim.") 
    return <Navigate to="/login" replace />
  }
  else if(currentuser.email=="root@gmail.com")
  {
    return <Outlet/>
  }
  else
  {
    return <PermisionAdmin/>
  }
}