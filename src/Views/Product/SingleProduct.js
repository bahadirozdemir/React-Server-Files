import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {doc,setDoc,getDoc} from "firebase/firestore";
import LoadingAnimation from "../../Animation/9965-loading-spinner.json";
import Lottie from "lottie-react";
import { db } from "../../config/firebase";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PlaceholderImage from "../../PlaceHolderİmages/FYKHA.jpg";
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { AuthContext } from "../../Context/AuthProvider";
function SingleProduct() {
    const { currentuser, setBasketCount, basketCount} = useContext(AuthContext)
    const [Products, setData] = useState()
    const [Sepet, setSepet] = useState(false)
    const [Loading, setLoading] = useState(true)
    const [SepetLoading, setSepetLoading] = useState(true)
    const [GirisYap, setGirisYap] = useState(false)
    const params= useParams();
    useEffect(() => {
        const get_product_function = async()=>{
            const docRef = doc(db, "urunler",params.product_id);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setData(docSnap.data())
            }
            else{
               console.log("data yok")
            }
            setLoading(false);
            if(currentuser!=null){
            const check = await getDoc(doc(db, "sepet",currentuser.uid))
            if(check.exists()){
              if(check.data().sepetim.find(x=> x === params.product_id)){
                setSepet(true);
              }
            }
          }
          else{
            setGirisYap(true)
          }
            setSepetLoading(false);
        }

        get_product_function();


     
    }, [])
    const SepeteEkle=async()=>{
        setSepetLoading(true);
        const docRef = doc(db, "sepet",currentuser.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          let yenisepet = docSnap.data().sepetim;
          const ara = yenisepet.find(x=>x===params.product_id);
          if(ara){
 
            setSepet(false)
            yenisepet = yenisepet.filter(data => data !== params.product_id)
            setBasketCount(basketCount - 1)       
          }
          else{
 
            setBasketCount(basketCount + 1)
            setSepet(true)
            yenisepet.push(params.product_id)
          }
          await setDoc(doc(db, "sepet", currentuser.uid), {
            sepetim:yenisepet
          });
        }
        else{
            let yenisepet = []
            setSepet(true)
 
            setBasketCount(1)
            yenisepet.push(params.product_id)
            await setDoc(doc(db, "sepet", currentuser.uid), {
               sepetim:yenisepet
            });
        }
      setSepetLoading(false);
    }
    return (
        Loading==false && Products!=null > 0 ? 
   
        <div className="single-product-container"> 
            <section className="single-product">
                <div className="container">
                <div className="row">
                    <div className="col-md-5">
                    <div className="single-product-slider">
                        <div className="carousel slide" data-ride="carousel" id="single-product-slider">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                            <LazyLoadImage effect="black-and-white" placeholderSrc={PlaceholderImage} width={250} height={420} src={Products.urun_resim} alt="product-img" />
                            </div>
                        </div>                 
                        </div>
                    </div>
                    </div>
                    
                    <div className="col-md-7">
                    <div className="single-product-details mt-5 mt-lg-0">
                        <h2>{Products.aciklama}</h2>
                        <div className="sku_wrapper mb-4">
                        Ürün Numarası: <span className="text-muted">{Products.urun_id}</span>
                        </div>
            
                        <hr />
                        
                        <h3 className="product-price">{Products.fiyat} TL</h3>
                        
                        <p className="product-description my-4 ">
                          
                        </p>
            
                        <form className="cart">
                        <div className="quantity d-flex align-items-center"> 
                        <button onClick={()=>SepeteEkle()} className="btn btn-main btn-small" disabled={GirisYap==true ? true : SepetLoading==true ? true : ""}>{SepetLoading==false ? GirisYap==true ? "Lütfen Giriş Yapın" : Sepet==false ?  "Sepete Ekle" : "Sepetten Çıkar" : "Yükleniyor"}</button>
                        </div>
                        </form>               
                        <div className="color-swatches mt-4 d-flex align-items-center">
                        <span className="font-weight-bold text-capitalize product-meta-title">Renk</span>
                        <ul className="list-inline mb-0">
                           <li>{Products.urun_renk}</li>                        
                        </ul>
                        </div>
            
                        <div className="product-size d-flex align-items-center mt-4">
                        <span className="font-weight-bold text-capitalize product-meta-title">Numara</span>
                        <select className="form-control">
                            <option>{Products.numara}</option>
                        </select>
                        </div>
            
                        <div className="products-meta mt-4">
                        <div className="product-category d-flex align-items-center">
                            <span className="font-weight-bold text-capitalize product-meta-title">Kategori</span>
                            <Link href="#">Ayakkabı</Link>
                        </div>
            
                        <div className="product-share mt-5">
                            <ul className="list-inline">
                            <li className="list-inline-item">
                                <Link href="#"><i className="tf-ion-social-facebook"></i></Link>
                            </li>
                            <li className="list-inline-item">
                                <Link href="#"><i className="tf-ion-social-twitter"></i></Link>
                            </li>
                            <li className="list-inline-item">
                                <Link href="#"><i className="tf-ion-social-linkedin"></i></Link>
                            </li>
                            <li className="list-inline-item">
                                <Link href="#"><i className="tf-ion-social-pinterest"></i></Link>
                            </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            
                
                <div className="row">
                    <div className="col-lg-12">
                    <nav className="product-info-tabs wc-tabs mt-5 mb-5">
                        <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                        <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Açıklama</a>
                        <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Ek Bilgiler</a>
                        <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Değerlendirmeler (2)</a>
                        </div>
                    </nav>
            
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                        <p>Dünyaca ünlü markadan çıkan bu ayakkabı bu sene herkes tarafından en çok önerilenler listesinde.</p>
            
                        <h4>Ürün Özellikleri</h4>
            
                        <ul className="">
                        <li>İç Materyal : Tekstil</li>
                        <li>Dış Materyal : Suni Deri</li>
                        <li>Kapama Şekli : Bağcıklı</li>
                        <li>Taban : Phylon</li>
                        </ul>
            
                        </div>
                        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                        
                        <ul className="list-unstyled info-desc">
                        <li className="d-flex">
                            <strong>Marka </strong>  
                            <span>{Products.urun_markasi}</span>
                        </li>
                        <li className="d-flex">
                            <strong>Cinsiyet</strong>
                            <span>{Products.cinsiyet}</span>
                        </li>
                        <li className="d-flex">
                            <strong>Malzeme</strong>
                            <span >En az 60% kumaş</span>
                        </li>
                        <li className="d-flex">
                            <strong>Renk</strong>
                            <span>{Products.urun_renk}</span>
                        </li>
                        <li className="d-flex">
                            <strong>Numara</strong>
                            <span>{Products.numara}</span>
                        </li>
                        </ul>
                        </div>
                        <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                        <div className="row">
                        <div className="col-lg-7">
                            <div className="media review-block mb-4">
                            <img src="assets/images/avater-1.jpg" alt="reviewimg" className="img-fluid mr-4" />
                            <div className="media-body">
                                <div className="product-review">
                                <span><i className="tf-ion-android-star"></i></span>
                                <span><i className="tf-ion-android-star"></i></span>
                                <span><i className="tf-ion-android-star"></i></span>
                                <span><i className="tf-ion-android-star"></i></span>
                                <span><i className="tf-ion-android-star"></i></span>
                                </div>
                                <h6>Therichpost <span className="text-sm text-muted font-weight-normal ml-3">-June 23, 2019</span></h6>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum suscipit consequuntur in, perspiciatis laudantium ipsa fugit. Iure esse saepe error dolore quod.</p>
                            </div>  
                            </div>
            
                            <div className="media review-block">
                            <img src="assets/images/avater-2.jpg" alt="reviewimg" className="img-fluid mr-4" />
                            <div className="media-body">
                                <div className="product-review">
                                <span><i className="tf-ion-android-star"></i></span>
                                <span><i className="tf-ion-android-star"></i></span>
                                <span><i className="tf-ion-android-star"></i></span>
                                <span><i className="tf-ion-android-star"></i></span>
                                <span><i className="tf-ion-android-star-outline"></i></span>
                                </div>
                                <h6>Therichpost <span className="text-sm text-muted font-weight-normal ml-3">-June 23, 2019</span></h6>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum suscipit consequuntur in, perspiciatis laudantium ipsa fugit. Iure esse saepe error dolore quod.</p>
                            </div>  
                            </div>
                        </div>
            
            
                        <div className="col-lg-5">
                            <div className="review-comment mt-5 mt-lg-0">
                            <h4 className="mb-3">Yorum Ekleyin</h4>
            
                            <form>
                                <div className="starrr"></div>
                                <div className="form-group">
                                <input type="text" className="form-control" placeholder="Adınız" />
                                </div>
                                <div className="form-group">
                                <input type="email" className="form-control" placeholder="E-Mail Adresiniz" />
                                </div>
                                <div className="form-group">
                                <textarea name="comment" id="comment" className="form-control" cols="30" rows="4" placeholder="Değerlendirmeniz"></textarea>
                                </div>
            
                                <Link to="/product-single" className="btn btn-main btn-small">Gönder</Link>
                            </form>
                            </div>
                        </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            
            
            {/* <section className="products related-products section">
                <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                    <div className="title text-center">
                        <h2>You may like this</h2>
                        <p>The best Online sales to shop these weekend</p>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3 col-6" >
                            <div className="product">
                        <div className="product-wrap">
                        <Link to="/product-single"><img className="img-fluid w-100 mb-3 img-first" src="assets/images/322.jpg" alt="product-img" /></Link>
                        <Link to="/product-single"><img className="img-fluid w-100 mb-3 img-second" src="assets/images/444.jpg" alt="product-img" /></Link>
                        </div>
            
                        <span className="onsale">Sale</span>
                        <div className="product-hover-overlay">
                        <Link href="#"><i className="tf-ion-android-cart"></i></Link>
                        <Link href="#"><i className="tf-ion-ios-heart"></i></Link>
                            </div>
            
                        <div className="product-info">
                        <h2 className="product-title h5 mb-0"><Link to="/product-single">Kirby Shirt</Link></h2>
                        <span className="price">
                            $329.10
                        </span>
                        </div>
                    </div>
                    </div>
            
                    <div className="col-lg-3 col-6" >
                            <div className="product">
                        <div className="product-wrap">
                        <Link to="/product-single"><img className="img-fluid w-100 mb-3 img-first" src="assets/images/111.jpg" alt="product-img" /></Link>
                        <Link to="/product-single"><img className="img-fluid w-100 mb-3 img-second" src="assets/images/222.jpg" alt="product-img" /></Link>
                        </div>
            
                        <span className="onsale">Sale</span>
                        <div className="product-hover-overlay">
                        <Link href="#"><i className="tf-ion-android-cart"></i></Link>
                        <Link href="#"><i className="tf-ion-ios-heart"></i></Link>
                            </div>
            
                        <div className="product-info">
                        <h2 className="product-title h5 mb-0"><Link to="/product-single">Kirby Shirt</Link></h2>
                        <span className="price">
                            $329.10
                        </span>
                        </div>
                    </div>
                    </div>
            
            
                    <div className="col-lg-3 col-6" >
                            <div className="product">
                        <div className="product-wrap">
                        <Link to="/product-single"><img className="img-fluid w-100 mb-3 img-first" src="assets/images/111.jpg" alt="product-img" /></Link>
                        <Link to="/product-single"><img className="img-fluid w-100 mb-3 img-second" src="assets/images/322.jpg" alt="product-img" /></Link>
                        </div>
            
                        <span className="onsale">Sale</span>
                        <div className="product-hover-overlay">
                        <Link href="#"><i className="tf-ion-android-cart"></i></Link>
                        <Link href="#"><i className="tf-ion-ios-heart"></i></Link>
                            </div>
            
                        <div className="product-info">
                        <h2 className="product-title h5 mb-0"><Link to="/product-single">Kirby Shirt</Link></h2>
                        <span className="price">
                            $329.10
                        </span>
                        </div>
                    </div>
                    </div>
            
                    <div className="col-lg-3 col-6">
                            <div className="product">
                        <div className="product-wrap">
                        <Link to="/product-single"><img className="img-fluid w-100 mb-3 img-first" src="assets/images/444.jpg" alt="product-img" /></Link>
                        <Link to="/product-single"><img className="img-fluid w-100 mb-3 img-second" src="assets/images/222.jpg" alt="product-img" /></Link>
                        </div>
            
                        <span className="onsale">Sale</span>
                        <div className="product-hover-overlay">
                        <Link href="#"><i className="tf-ion-android-cart"></i></Link>
                        <Link href="#"><i className="tf-ion-ios-heart"></i></Link>
                            </div>
            
                        <div className="product-info">
                        <h2 className="product-title h5 mb-0"><Link to="/product-single">Kirby Shirt</Link></h2>
                        <span className="price">
                            $329.10
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section> */}

        </div>
        :
        <div style={{ width: "100%", height: "100vh", display: "flex",flexDirection:"column", justifyContent: "center", alignItems: "center" }}>
        <Lottie animationData={LoadingAnimation} style={{width:200,height:200}} />
        <br/>
        <h5>Seçtiğiniz Ürünü Arıyoruz.</h5>
       </div>
    )}
export default SingleProduct;