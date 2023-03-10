import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs, limit, query, where, orderBy } from "firebase/firestore";
import Lottie from "lottie-react";
import LoadingAnimation from "../../Animation/9965-loading-spinner.json";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PlaceholderImage from "../../PlaceHolderİmages/FYKHA.png";
import { TbDiscount } from "react-icons/tb";
import { RiErrorWarningLine } from "react-icons/ri";
function Home() {
    const [Loading, setLoading] = useState(true)
    const [Sale_Data, setSaleData] = useState([])
    useEffect(() => {
        document.title = 'FYKHA | Anasayfa';
        const indirimli_urunler_get = async () => {

            const querySnapshot = await getDocs(query(collection(db, "urunler"), where("indirim", ">", 0), orderBy('indirim', "asc"), orderBy("urun_tarihi", "desc"),limit(8)));
            querySnapshot.forEach(element => {
                setSaleData(veri => [...veri, element.data()])
            });
            setLoading(false);
        }
        indirimli_urunler_get();

    }, [])
    return (
        <div className="home-container">
            <div className="main-slider slider slick-initialized slick-slider">
                <div className="slider-item" style={{ backgroundImage: "url('https://thumbs.dreamstime.com/b/heart-shape-shoe-laces-gray-mesh-fabric-sneakers-over-bright-yellow-background-laced-up-stylish-textile-sport-shoes-wide-232319408.jpg')", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-12 offset-lg-6 offset-md-6">
                                <div className="slider-caption">
                                    <span className="lead text-color">Modaya Ayak Uydur</span>
                                    <h1 className="mt-1 mb-4"><span className="text-color">Kış </span>Koleksiyonu</h1>
                                    <Link to={"/Urunler/Kadın/page=1"} className="btn btn-main">Alışverişe Başla</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <section className="category section pt-3 pb-0">

            </section>
            <section className="section products-main">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="title text-center">
                                <h2>İndirimde Olan Ürünler</h2>
                                <p>Fırsatlı Ürünleri Keşfedin</p>
                            </div>
                        </div>
                    </div>


                    <div className="row">
                        {Sale_Data.length > 0 && Loading == false ?
                            Sale_Data.map((element, value) => {
                                const logo = `/assets/images/${element.urun_markasi}.png`
                                return (
                                    <div key={value} className="col-lg-3 col-12 col-md-6 col-sm-6 mb-5 border border-dark-0">
                                        <div className="product">
                                            <div className="product-wrap">
                                                <Link to={"/SingleProduct/" + element.urun_id + "/" + element.urun_markasi}><LazyLoadImage placeholderSrc={PlaceholderImage} width={250} height={350} src={element.urun_resim} alt="product-img" /></Link>
                                                <Link to={"/SingleProduct/" + element.urun_id + "/" + element.urun_markasi}><div className="div"><img className="img-second" width="100%" height={150} src={logo} alt="product-img" /></div></Link>
                                            </div>
                                            
                                            {element.kargo_fiyat == 0 && <span className="kargo_bedava">Kargo Bedava</span>}
                                            <div className="boxes">
                                            <span className="onsale">İndirimli Ürün</span>     
                                            {element.stok < 20 && <span className="stok"> Tükeniyor</span>}                  
                                            </div>
                                            <div className="product-info">
                                                <h2 className="product-title h5 mb-0">{element.aciklama}</h2>                          
                                                <span className="price"> 
                                                {Number(element.fiyat - element.indirim).toFixed(2)} TL
                                                </span>  
                                                &nbsp;    
                                                <span className="price_indirim">
                                                    {element.fiyat} TL
                                                </span>                    
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            : Loading == true ?
                                <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <Lottie animationData={LoadingAnimation} style={{ width: 200, height: 200 }} />
                                    <h5>Sizin İçin Ürünleri Getiriyoruz.</h5>
                                </div>
                                :
                                <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <br />
                                    <h5>Üzgünüz Veri Bulunamadı.</h5>
                                </div>
                        }
                    </div>
                </div>
            </section>



            <section className="features border-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="feature-block">
                                <i className="tf-ion-android-bicycle"></i>
                                <div className="content">
                                    <h5>Ücretsiz Kargo</h5>
                                    <p>500 TL ve Üstü Alışverişlerde</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="feature-block">
                                <i className="tf-wallet"></i>
                                <div className="content">
                                    <h5>30 Gün İçinde İade</h5>
                                    <p>Para İade Garantisi</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="feature-block">
                                <i className="tf-key"></i>
                                <div className="content">
                                    <h5>Güvenli Ödeme</h5>
                                    <p>100% Gizli Ödeme</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-md-6">
                            <div className="feature-block">
                                <i className="tf-clock"></i>
                                <div className="content">
                                    <h5>7/24 Destek</h5>
                                    <p>Kesintisiz Müşteri Desteği</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default Home;