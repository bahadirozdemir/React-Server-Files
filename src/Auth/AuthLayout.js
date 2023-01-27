 import {Navigate, Outlet,Location, useLocation} from "react-router-dom";
import { useContext} from 'react'
import { AuthContext } from '../Context/AuthProvider'
export default function AuthLayout(){
const {currentuser,basketCount} = useContext(AuthContext);
const location = useLocation();

 
  if(location.pathname != "/odeme")
  {
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
  else if(basketCount!=0 && currentuser!=null){
    return <Outlet/>
  }
  else{
    console.log("anasayfa  yönlendi")
    return <Navigate to="/" replace />
  }
  
}
