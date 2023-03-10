import "jquery/dist/jquery.slim.min.js";
import "popper.js/dist/umd/popper.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { collection, doc, getDocs, query, orderBy, limit, startAt, where, getDoc, endAt } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "../Context/AuthProvider";
import classNames from "classnames";
import Button from 'react-bootstrap/Button';
import "./css/Header.css"
import useDebounce from './Debounce/Debounce';
import Lottie from "lottie-react";
import Detective from "../Animation/96262-detective-search.json";
import LoadingAnimation from "../Animation/9965-loading-spinner.json";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBIcon,
    MDBRipple,
    MDBBtn,
} from "mdb-react-ui-kit";
import Form from 'react-bootstrap/Form';
function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [araniyor, setaraniyor] = useState(false)
    const gecikme = useDebounce(searchQuery, 1000);
    const [data, setData] = useState([])
    const location = useLocation();
    const { currentuser, setBasketCount, basketCount, logout } = useContext(AuthContext)
    const [SepetUrunleri, setSepetUrunleri] = useState([])
    const [TotalFiyat, setTotalFiyat] = useState(0)
    const [Loading, setLoading] = useState(true)
    const [ClickLink, setClickLink] = useState(false)
    const [Visible_Search, setVisible_Search] = useState(false)
    useEffect(() => {
        if (gecikme) {

            aramafilter(gecikme);
        }
    }, [gecikme])
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
            sepeti_getir();
        }
    }, [basketCount, currentuser])
    const Changepage = () => {
        setClickLink(true);
        setTimeout(() => {
            setClickLink(false);
        }, 500);
    }
    const aramafilter = async (sorgu) => {





        setData([])
        if (sorgu != "") {

            function capitalize(str) {
                return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
            }
            let arakelime = capitalize(sorgu);

            const result = await getDocs(query(collection(db, "urunler"), orderBy("urun_markasi"),startAt(arakelime), endAt(arakelime+ '~'), limit(5)));
            result.forEach(element => {
                setData(data => [element.data(), ...data]);
        
            })
            const urun_id_search = await getDocs(query(collection(db, "urunler"), orderBy("urun_id"),startAt(arakelime), endAt(arakelime+ '~'), limit(5)));
            urun_id_search.forEach(element => {
                setData(data => [element.data(), ...data]);
        
            })
            setaraniyor(false);
        }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white w-100 navigation" id="navbar">
            <div className="container">
                <Link className="navbar-brand font-weight-bold mr-5" to={{ pathname: "/" }}><div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}><div className="logom"><img src="/assets/images/logo.png" width={150} height={150} /></div></div></Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-navbar"
                    aria-controls="main-navbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse " id="main-navbar">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item" >
                            <NavLink onClick={(state) => { state.target.className != "nav-link active" && Changepage() }} to={{ pathname: "/" }} className={classNames({
                                "nav-link": true,
                                "nav-link nav-link-disabled": ClickLink == true
                            })}>Anasayfa</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink onClick={(state) => { state.target.className != "nav-link active" && Changepage() }} className={classNames({
                                "nav-link": true,
                                "nav-link nav-link-disabled": ClickLink == true
                            })} to={{ pathname: "/Urunler/Kadın/page=1" }}>Kadın</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink onClick={(state) => { state.target.className != "nav-link active" && Changepage() }} className={classNames({
                                "nav-link": true,
                                "nav-link nav-link-disabled": ClickLink == true
                            })} to={{ pathname: "/Urunler/Erkek/page=1" }}>Erkek</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink onClick={(state) => { state.target.className != "nav-link active" && Changepage() }} className={classNames({
                                "nav-link": true,
                                "nav-link nav-link-disabled": ClickLink == true
                            })} to={{ pathname: "/Urunler/Çocuk/page=1" }}>Çocuk</NavLink>
                        </li>
                        <li className="nav-item" >
                            <NavLink onClick={(state) => { state.target.className != "nav-link active" && Changepage() }} className={classNames({
                                "nav-link": true,
                                "nav-link nav-link-disabled": ClickLink == true
                            })} to={{ pathname: "/Urunler/Çocuk/page=1" }} style={{ color: "orange" }}>Outlet</NavLink>
                        </li>
                        <li className="nav-item" >
                            <NavLink onClick={(state) => { state.target.className != "nav-link active" && Changepage() }} className={classNames({
                                "nav-link visible-link": true,
                                "nav-link nav-link-disabled": ClickLink == true
                            })} to={{ pathname: "/Sepet" }} style={{ color: "orange" }}>Sepet</NavLink>
                        </li>
                        <li className="nav-item" >
                            <NavLink onClick={(state) => { state.target.className != "nav-link active" && Changepage() }} className={classNames({
                                "nav-link visible-link": true,
                                "nav-link nav-link-disabled": ClickLink == true
                            })} to={{ pathname: "/Siparislerim" }} style={{ color: "orange" }}>Siparislerim</NavLink>
                        </li>
                        <li className="nav-item" >
                            <NavLink onClick={(state) => { state.target.className != "nav-link active" && Changepage() }} className={classNames({
                                "nav-link visible-link": true,
                                "nav-link nav-link-disabled": ClickLink == true
                            })} to={{ pathname: "/Profil" }} style={{ color: "orange" }}>Profil</NavLink>
                        </li>
                        <li className="nav-item" >
                            <NavLink onClick={(state) => { state.target.className != "nav-link active" && Changepage() }} className={classNames({
                                "nav-link visible-link": true,
                                "nav-link nav-link-disabled": ClickLink == true
                            })} to={{ pathname: "/Iletisim" }} style={{ color: "orange" }}>İletişim</NavLink>
                        </li>
                    </ul>

                </div>

                <ul className="top-menu list-inline mb-0 d-none d-lg-block" id="top-menu">

                    <li className="list-inline-item">
                        <Form className="d-flex">
                            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column", backgroundColor: "white", height: 0 }}>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 15 }}>
                                    <Form.Control            
                                        placeholder="Bir marka veya ürün numarası arayın"                 
                                        aria-label="Search"
                                        onChange={(e) => { setSearchQuery(e.target.value); setaraniyor(true); }}
                                        className={classNames({
                                            "me-2 search_box_visible": Visible_Search != true,
                                            "me-2 search_box_non_visible": Visible_Search == true,
                                        })}
                                        value={searchQuery}

                                    />

                                    <a style={{ cursor: "pointer" }} onClick={() => { setVisible_Search(!Visible_Search) }} className="search_toggle" id="search-icon"><i style={Visible_Search == true ? { backgroundColor: "#fb5c42", color: "white" } : { backgroundColor: "", color: "" }} className="tf-ion-android-search"></i></a>

                                </div>
                                <div className={classNames({
                                    "search_box_modal__non_visible": Visible_Search == true,
                                    "search_box_modal_visible": Visible_Search != true,
                                })}>
                                    <div>

                                        <MDBContainer  className={classNames({                     
                                                            "modal_body":true,
                                                            "modal_body_visible":searchQuery == "",
                                                        })}>
                                            <MDBRow>
                                                <MDBCol md="0" xl="0">
                                                    <MDBCard className="border rounded-3">
                                                        <MDBCardBody 
                                                         
                                                         >                                                     
                                                               {araniyor != true &&
                                                                    <>
                                                                        {data.map((element, index) => (
                                                                            <MDBRow className="modal_box">
                                                                                <MDBCol md="6" lg="3" className="mb-lg-0">
                                                                                  <>
                                                                                        <MDBCardImage
                                                                                            src={element.urun_resim}
                                                                                         
                                                                                            className="w-100"
                                                                                        />
                                                                                        <a href="#!">
                                                                                            <div
                                                                                                className="mask"
                                                                                                style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                                                                                            ></div>
                                                                                        </a>
                                                                                    </>
                                                                                </MDBCol>
                                                                                <MDBCol md="6">
                                                                                   <Link onClick={()=>{setSearchQuery("");}} to={"/SingleProduct/" + element.urun_id + "/" + element.urun_markasi}><h5>{element.aciklama}</h5></Link>
                                                                                    <div className="d-flex flex-row">

                                                                                        <span>{element.urun_markasi}</span>
                                                                                    </div>
                                                                                    <div className="mt-1 mb-0 text-muted small">



                                                                                    </div>
                                                                                    <div className="mb-2 text-muted small">
                                                                                        <span>{element.cinsiyet}</span>
                                                                                        <span className="text-primary"> • </span>
                                                                                        <span>{element.numara} Numara</span>
                                                                                    </div>
 
                                                                                </MDBCol>
                                                                                <MDBCol
                                                                                    md="6"
                                                                                    lg="3"
                                                                                    className="border-sm-start-none border-start"
                                                                                >
                                                                                    <div className="d-flex flex-row align-items-center mb-1">
                                                                                        <h4 style={{fontSize:15}} className="mb-1 me-1">{element.indirim > 0 ? (element.fiyat - element.indirim) :  element.fiyat} TL</h4>

                                                                                    </div>
                                                                                </MDBCol>
                                                                            </MDBRow>

                                                                        ))}


                                                                    </>
                                                                    }     
                                                                     {searchQuery=="" &&
                                                                    <div style={{ width: "310px", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>                                    
                                                                    <h6>FYKHA</h6>
                                                                </div>}                  
                                                                    {araniyor==true && searchQuery!="" &&
                                                                    <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                                                        <Lottie animationData={LoadingAnimation} style={{ width: 310, height: 200 }} />
                                                                        <h6>Aranıyor</h6>
                                                                    </div>}
                                                                  
                                                                    {araniyor==false && data.length==0 && searchQuery!="" &&
                                                                    <div style={{ width: "310px", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                                          
                                                                    <h6>Üzgünüz Veri Bulunamadı</h6>
                                                                </div>}


                                                       
                                                        </MDBCardBody>
                                                    </MDBCard>
                                                </MDBCol>

                                            </MDBRow>
                                        </MDBContainer>

                                    </div>

                                </div>

                            </div>

                        </Form>

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
                                                        <Link to={"/SingleProduct/" + element.urun_id + "/" + element.urun_markasi}>
                                                            <img className="media-object img- mr-3" src={element.urun_resim} alt="image" />
                                                        </Link>
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
                                    <li><Link to={{ pathname: "/Kuponlarim" }}>Kuponlarım</Link></li>
                                    <li><Link to={{ pathname: "/Profil" }}>Profilim</Link></li>
                                    <li><Link to={{ pathname: "/Iletisim" }}>Bize Ulaşın</Link></li>
                                    <li><Link onClick={() => { logout() }}>Çıkış Yap</Link></li>
                                </>
                                :
                                <>
                                <li><Link to={{ pathname: "/login" }}>Giriş Yap</Link></li>
                                <li><Link to={{ pathname: "/Iletisim" }}>Bize Ulaşın</Link></li>
                                </>
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