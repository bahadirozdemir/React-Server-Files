import {Navigate, Outlet,useNavigate} from "react-router-dom";
import { useContext} from 'react'
import { AuthContext } from '../Context/AuthProvider'
export default function AdminLayout(){
const {currentuser} = useContext(AuthContext);
 
  if(currentuser==null)
  {
    return <Navigate to="/login" replace />
  }
  else if(currentuser.email=="root@gmail.com")
  {
    return <Outlet/>
  }
 
}