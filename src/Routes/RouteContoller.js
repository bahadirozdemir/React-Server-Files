import { React, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { Routes, Route,useNavigate} from 'react-router-dom'
import Home from '../Views/Home'
import Login from '../Views/Login'
import Anasayfa from '../Views/Product/Anasayfa'
import Register from '../Views/Register'
import AuthLayout from "../Auth/AuthLayout";
import Admin from "../Views/Admin";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loading from "../Views/Loading/Loading";
import DetailPage from "../Views/Product/DetailPage";
import Sepet from "../Views/Sepet/Sepet";
import Odeme from "../Views/Odeme/Odeme";
import ProductLayout from "../Views/Product";
import Siparislerim from "../Views/Siparislerim/Siparislerim"
import AdminLayout from "../Auth/AdminLayout";
import LoginLayout from "../Auth/LoginLayout";
import Products from '../Views/Product/Products'
import {doc, getDoc, } from "firebase/firestore";
import { db } from "../config/firebase";
import HeaderKapsa from "../Views/HeaderKapsa";

import ErrorPage from "../Views/ErrorPage";
import SingleProduct from "../Views/Product/SingleProduct";
const RouteContoller = () => {
  

  const { currentuser, setUser, logout,basketCount,setBasketCount} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true)
  const auth = getAuth();
  const SepetCek = async(user)=>{
    const veriler = await getDoc(doc(db,"sepet",user.uid))
    if(veriler.exists()){
      setBasketCount(veriler.data().sepetim.length)
    }
    else{
      setBasketCount(0)
    }
  }
  onAuthStateChanged(auth, (user) => {
    if(user){
      setUser(user);
      SepetCek(user);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
   
  });


  if (isLoading == true) {
    return <Loading />
  }
  return (
    <>

     
    
      <Routes>
      <Route element={<HeaderKapsa />}>
        <Route path="/" element={<ProductLayout />}>
          <Route index={true} element={<Anasayfa />} />
          <Route path="productdetail/:product_id/:product_name" element={<DetailPage />} />
        </Route>

        <Route path="Urunler/:Cinsiyet/:page" element={<Products />} />
        <Route element={<LoginLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/kayitol" element={<Register />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/sepet" element={<Sepet />} />
          <Route path="/OdemeSayfasi" element={<Odeme />} />
          <Route path="/Siparislerim" element={<Siparislerim />} />
        </Route>
        <Route path="/SingleProduct/:product_id/:Marka" element={<SingleProduct />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
   
    
    </>
  )


}
export default RouteContoller