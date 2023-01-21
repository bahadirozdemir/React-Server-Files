import { React, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { Routes, Route, NavLink } from 'react-router-dom'
import Home from '../Views/Home'
import Login from '../Views/Login'
import Anasayfa from '../Views/Product/Anasayfa'
import Register from '../Views/Register'
import AuthLayout from "../Auth/AuthLayout";
import Admin from "../Views/Admin";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loading from "../Views/Loading/Loading";
import DetailPage from "../Views/Product/DetailPage";
import ProductLayout from "../Views/Product";
import AdminLayout from "../Auth/AdminLayout";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { CgProfile } from "react-icons/cg";
const RouteContoller = () => {

  const { currentuser, setUser, logout } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true)
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    //console.log(user)
    setUser(user);
    setTimeout(() => {
      setLoading(false);
    }, 500);

    //navigate("/home")
  });


  if (isLoading == true) {
    return <Loading />
  }
  return (
    <>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ padding: 20 }}>
        <NavLink className="navbar-brand" to="/">FYKHA</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <NavLink className="nav-link" to="/">Anasayfa <span className="sr-only"></span></NavLink>
            </li>
            {currentuser ?

              <div style={{ position: "absolute", right: 50, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                <NavDropdown title={<CgProfile size={30} />} id="navbarScrollingDropdown" >
                  <NavDropdown.Item href="/*" onClick={()=>{logout()}}>Profil</NavDropdown.Item>
                  <NavDropdown.Item href="/*" onClick={()=>{logout()}}>Siparişlerim</NavDropdown.Item>
                  <NavDropdown.Item href="/" onClick={()=>{logout()}}>Çıkış Yap</NavDropdown.Item>
                </NavDropdown>
                
              </div>
              :
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Giriş Yap</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/kayitol">Kayıt Ol</NavLink>
                </li>
              </>
            }
            {currentuser ?
              <li className="nav-item">
                <NavLink className="nav-link" to="/home">Ürünler</NavLink>
              </li>
              :
              ""
            }


          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<ProductLayout />}>
          <Route index={true} element={<Anasayfa />} />
          <Route path="productdetail/:product_id/:product_name" element={<DetailPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/kayitol" element={<Register />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>

    </>
  )


}
export default RouteContoller