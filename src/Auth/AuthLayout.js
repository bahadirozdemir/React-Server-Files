import { Navigate, Outlet, Location, useLocation } from "react-router-dom";
import { useContext } from 'react'
import { AuthContext } from '../Context/AuthProvider'
export default function AuthLayout() {
  const { currentuser, basketCount } = useContext(AuthContext);
  const location = useLocation();

  if(location.pathname == "/OdemeSayfasi" && basketCount!=0 && currentuser!=null)
  {
    return <Outlet/>
   
  }
  else if(location.pathname != "/OdemeSayfasi" && currentuser!=null){
    return <Outlet/>
  }
  else if(location.pathname=="Sepet" && basketCount==0){
    
    return <Navigate to="/" replace />
  }

  

}
