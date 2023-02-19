import "jquery/dist/jquery.slim.min.js";
import "popper.js/dist/umd/popper.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { collection, doc, getDocs, query, orderBy, limit, startAt, where, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "../Context/AuthProvider";
function Header() {
    const { currentuser, setBasketCount, basketCount, logout } = useContext(AuthContext)
    const [SepetUrunleri, setSepetUrunleri] = useState([])
    const [TotalFiyat, setTotalFiyat] = useState(0)
    const [Loading, setLoading] = useState(true)

    useEffect(() => {
        const sepeti_getir = async () => {
            setLoading(true);
            setSepetUrunleri([])
            setTotalFiyat(0)
            let docRef = doc(db, "sepet", currentuser.uid);
            let docSnap = await getDoc(docRef);
            let toplamfiyat = 0;
            if (docSnap.exists()) {
                if (docSnap.data().sepetim.length != 0) {
                    docSnap.data().sepetim.forEach(async (element) => {
                        let docRef = doc(db, "urunler", element);
                        let docSnap = await getDoc(docRef);
                        setSepetUrunleri(data => [...data, docSnap.data()])  
                        let fiyat = 0;
                        if (docSnap.data().fiyat.split('.')[0].length == 1) {
                            fiyat = docSnap.data().fiyat * Math.pow("10", docSnap.data().fiyat.split('.')[1].length)

                        }
                        else {
                            fiyat = docSnap.data().fiyat
                        }
                        toplamfiyat = toplamfiyat + Number(fiyat);
                        setTotalFiyat(toplamfiyat.toFixed(2));
                    });

                }

            }
            setLoading(false);

        }
        if (currentuser != null) {
            console.log("girdi")
            sepeti_getir();
        }
    }, [basketCount,currentuser])
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white w-100 navigation" id="navbar">
            <div className="container">
                <Link className="navbar-brand font-weight-bold" to={{ pathname: "/" }}><div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}><div className="logom"><img src="/assets/images/logo.png" width={100} height={100} /></div></div></Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-navbar"
                    aria-controls="main-navbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse " id="main-navbar">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to={{ pathname: "/" }}>Anasayfa</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink  className="nav-link" to={{ pathname: "/Urunler/Kadın/page=1" }}>Kadın</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink  className="nav-link" to={{ pathname: "/Urunler/Erkek/page=1" }}>Erkek</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={{ pathname: "/Urunler/Çocuk/page=1" }}>Çocuk</NavLink>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={{ pathname: "/Urunler/Çocuk/page=1" }} style={{color:"orange"}}>Outlet</Link>
                        </li>
                    </ul>
                </div>

                <ul className="top-menu list-inline mb-0 d-none d-lg-block" id="top-menu">
                    <li className="list-inline-item">
                        <a href="#" className="search_toggle" id="search-icon"><i className="tf-ion-android-search"></i></a>
                    </li>
                    {currentuser != null &&
                        <>
                            <li className="dropdown cart-nav dropdown-slide list-inline-item">
                                <a href="#" className="dropdown-toggle cart-icon" data-toggle="dropdown" data-hover="dropdown">
                                    <i className="tf-ion-android-cart ml-3"></i>
                                    {
                                        basketCount != 0 && <div className="basket_number">{basketCount}</div>
                                    }

                                </a>

                                <div className="dropdown-menu cart-dropdown">
                                    {SepetUrunleri.length > 0 && Loading == false ?
                               
                                        <>                                     
                                            {SepetUrunleri.map((element, index) => {
                                                                                             
                                                return (
                                                <div key={index} className="media">
                                                    <a href="/product-single">
                                                        <img className="media-object img- mr-3" src={element.urun_resim} alt="image" />
                                                    </a>
                                                    <div className="media-body">
                                                        <h6>{element.urun_markasi}</h6>
                                                        <div className="cart-price">
                                                            <span>{element.urun_cesidi}</span>
                                                            <br />
                                                            <span>{element.fiyat} TL</span>
                                                        </div>
                                                    </div>
                                                </div>                                   
                                            )
                                            
                                          })}
                                            <div className="cart-summary">
                                                <span className="h6">Toplam</span>
                                                <span className="total-price h6">{TotalFiyat} TL</span>
                                                <div className="text-center cart-buttons mt-3">
                                                    <Link to={"/sepet"} className="btn btn-small btn-transparent btn-block">Sepeti Görüntüle</Link>
                                                </div>
                                            </div>
                                        </>
                                        : Loading == false ?
                                            <div style={{ textAlign: "center" }}>Sepetiniz Boş</div>
                                            :
                                            <div style={{ textAlign: "center" }}>Yükleniyor.</div>
                                    }

                                </div>

                            </li>
                        </>
                    }

                    <li className="nav-item dropdown dropdown-slide list-inline-item">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown5" role="button" data-delay="350"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="tf-ion-ios-person mr-3"></i>
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown5">
                            {currentuser != null ?
                                <>
                                    <li><Link to={{ pathname: "/Siparislerim" }}>Siparişlerim</Link></li>
                                    <li><Link to={{ pathname: "/login" }}>Kuponlarım</Link></li>
                                    <li><Link to={{ pathname: "/Profil" }}>Profilim</Link></li>
                                    <li><Link onClick={() => { logout() }}>Çıkış Yap</Link></li>
                                </>
                                :
                                <li><Link to={{ pathname: "/login" }}>Giriş Yap</Link></li>
                            }
                        </ul>
                    </li>






                </ul>
            </div>
             
             
            <div id="modal-container" class="">
                <div class="modal-background">
                    <div class="modal">
                        <h2>I'm a Modal</h2>
                        <p>Hear me roar.</p>
                        <svg class="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
                            <rect x="0" y="0" fill="none" width="226" height="162" rx="3" ry="3"></rect>
                        </svg>
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Header;