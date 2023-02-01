import { Navigate, Outlet, Location, useLocation } from "react-router-dom";
import { useContext } from 'react'
import { AuthContext } from '../Context/AuthProvider'
export default function LoginLayout() {
    const { currentuser, basketCount } = useContext(AuthContext);
  if (currentuser == null) {
    return <Outlet />
  }
  else {
    return <Navigate to="/" replace />
  }

}
