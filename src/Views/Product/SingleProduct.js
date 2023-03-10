import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {doc,setDoc,getDoc,updateDoc, collection,getDocs} from "firebase/firestore";
import LoadingAnimation from "../../Animation/9965-loading-spinner.json";
import Lottie from "lottie-react";
import { db } from "../../config/firebase";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PlaceholderImage from "../../PlaceHolderİmages/FYKHA.jpg";
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { AuthContext } from "../../Context/AuthProvider";
import { useFormik } from 'formik';
import DegerlendirmeValidation from "../Validation/DegerlendirmeValidation"
import classNames from "classnames";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { RiErrorWarningFill } from 'react-icons/ri';
function SingleProduct() {
    const [animationParent] = useAutoAnimate()
    const { currentuser, setBasketCount, basketCount} = useContext(AuthContext)
    const [Products, setData] = useState()
    const [Sepet, setSepet] = useState(false)
    const [Loading, setLoading] = useState(true)
    const [SepetLoading, setSepetLoading] = useState(true)
    const [GirisYap, setGirisYap] = useState(false)
    const [Kverileri, setKverileri] = useState(false)
    const [Yorumlar, setYorumlar] = useState([])
    const params= useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const get_product_function = async()=>{
            const docRef = doc(db, "urunler",params.product_id);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setData(docSnap.data())
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
            //Yorumlar
            const Yorumlar = await getDoc(doc(db, "Yorumlar",params.product_id));
            if(Yorumlar.exists()){
                setYorumlar(Yorumlar.data().yorum)
            }
        }

        get_product_function();
        const kullanici_getir = async()=>{
            const K_verileri = await getDoc(doc(db, "users",currentuser.uid));
            values.namesurname=K_verileri.data().isim_soyisim;
            values.email=K_verileri.data().email;
            setKverileri(true);
        }
        if(currentuser){
           kullanici_getir()
        }

     
    }, [navigate])
    const { handleChange, handleSubmit, values, errors, touched } = useFormik({
        initialValues: {
            namesurname: '',
            email: '',
            degerlendirme:"",
        },
        validationSchema: DegerlendirmeValidation
        ,
        onSubmit: async(values,{resetForm}) => {
            let siparis_check = false;
            const Siparisler = await getDocs(collection(db, "Siparisler"));
            Siparisler.forEach((doc) => {           
                 if(doc.data().siparisveren==currentuser.uid){
                    if(doc.data().Urunler.find(data=>data.Urun_No===params.product_id)){
                        siparis_check=true;
                    }
                 }
            });
            if(siparis_check==true)
            {
            let newDate = new Date()
            let date = newDate.getDate();
            let month = newDate.getMonth() + 1;
            let year = newDate.getFullYear();
            if(month.toString().length==1){
                month = "0"+month;
            }
            if(date.toString().length==1){
                date="0"+date;
            }
            values["yorumtarihi"]=date+"."+month+"."+year;
            values["yorumyapanid"]=currentuser.uid;
            values["yorum_saniyesi"]=newDate.getTime();   
            const Yorumlar = await getDoc(doc(db, "Yorumlar",params.product_id));
            if(Yorumlar.exists()){
                let eskiyorumlar = Yorumlar.data().yorum
                function compare( a, b ) {
                    if ( a.yorum_saniyesi > b.yorum_saniyesi ){
                        return -1;
                    }
                    if ( a.yorum_saniyesi < b.yorum_saniyesi ){
                        return 1;
                    }
                        return 0;
                    }
                eskiyorumlar.sort(compare);
                const id_ara = eskiyorumlar.find(data => data.yorumyapanid===currentuser.uid)
                if(id_ara){           
                    let distance =  newDate.getTime() - id_ara.yorum_saniyesi;   
                    var diffMin = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    if(diffMin < 6){
                        toast.dismiss();
                        toast.warning(<div>5 Dakikada Bir Yorum Yapabilirsiniz.<br/><div style={{fontSize:"11px"}}>Kalan Zaman : {(5 -diffMin)==0 ? (60- seconds) + " Saniye": (5-diffMin) + " Dakika " +(60- seconds) + " Saniye"}</div></div>,
                        { 
                          position: toast.POSITION.BOTTOM_CENTER,
                          className: 'toast-message'
                        },
                   
                        )
                        resetForm();
                        return
                    }
                    else{
                        eskiyorumlar = eskiyorumlar.filter(data=>data.yorumyapanid != currentuser.uid)
                        eskiyorumlar.push(values)
                        await updateDoc(doc(db,"Yorumlar",params.product_id),{
                            yorum:eskiyorumlar
                          }).catch(e=>{
                            console.log(e)
                          })
                          setYorumlar(eskiyorumlar)
                          toast.success('Değerlendirmeniz Başarıyla Güncellendi.',
                          { 
                            position: toast.POSITION.BOTTOM_CENTER ,
                            className: 'toast-message'
                          },

                          )
                          resetForm();
                        
                    }
                }
                else{
                    eskiyorumlar.push(values)
                    await updateDoc(doc(db,"Yorumlar",params.product_id),{
                        yorum:eskiyorumlar
                      }).catch(e=>{
                        console.log(e)
                      })
                      setYorumlar(eskiyorumlar)
                      toast.success('Yorumunuz İçin Teşekkür Ederiz.',
                      { 
                        position: toast.POSITION.BOTTOM_CENTER ,
                        className: 'toast-message'
                      },

                      )
                      resetForm();
                }
            }
            else 
            {        
                    let yorumdizisi = [];
                    yorumdizisi.push(values)
                    await setDoc(doc(db, "Yorumlar",params.product_id), {
                       yorum:yorumdizisi
                    }).catch(e => {
                      console.log(e)
                    })
                    setYorumlar(yorumdizisi);
                    toast.success('Yorumunuz İçin Teşekkür Ederiz.',
                    { position: toast.POSITION.BOTTOM_CENTER })
                    resetForm();

            }
        
         
        }
        else{
            toast.error(<div>Yorum yapabilmek için ürünü satın almanız gerekmektedir.</div>,
            {
                position: toast.POSITION.TOP_CENTER,
                className: 'error-toast-message'
            }
            )
            resetForm();
        }
        },

    });
 
    const SepeteEkle=async()=>{
        if(currentuser){

            const stok_check = await getDoc(doc(db,"urunler",params.product_id))
            if(stok_check.data().stok > 0){
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
            else{
                toast.dismiss();
                toast.error(<div style={{display:"flex",flexDirection:"column"}}><div>Üzgünüz Ürüne Ait Stok Bulunmamaktadır.</div><div>Ürün satın alınmış veya kaldırılmış olabilir.</div></div>,
                {
                    position: toast.POSITION.TOP_CENTER,
                    className: 'error-toast-message'
                }
                )
            }
           
        }
        else{
            navigate("/login")
        }
        
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
                            <LazyLoadImage effect="black-and-white" placeholderSrc={PlaceholderImage} width={350} src={Products.urun_resim} alt="product-img" />
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
                        
                        <h3 className="product-price">{Products.indirim==0 ?  Products.fiyat : parseFloat(Products.fiyat - Products.indirim).toFixed(2)} TL {Products.stok==0 && <div style={{color:"red",fontWeight:"bold",fontSize:25}}><RiErrorWarningFill size={25} color="red"/> Tükendi</div>} {Products.stok==1 && <div style={{color:"#DFBD69",fontWeight:"bold",fontSize:25}}><RiErrorWarningFill size={25} color="#DFBD69"/> Son 1 Ürün</div>}</h3>               
                        <p className="product-description my-4 ">
                          
                        </p>
            
                        <div className="cart">
                        <div className="quantity d-flex align-items-center"> 
                        <button onClick={()=>SepeteEkle()} className="btn btn-main btn-small" disabled={Products.stok > 0 ? SepetLoading==true ? true : "" : true}>{SepetLoading==false ? Sepet==false ?  "Sepete Ekle" : "Sepetten Çıkar" : "Yükleniyor"}</button>
                        </div>
                        </div>               
                        <div className="color-swatches mt-4 d-flex align-items-center">
                        <span className="font-weight-bold text-capitalize product-meta-title">Renk</span>
                        <ul className="list-inline mb-0">
                           <li>{Products.urun_renk}</li>                        
                        </ul>
                        </div>
                        <div className="color-swatches mt-4 d-flex align-items-center">
                        <span className="font-weight-bold text-capitalize product-meta-title">Stok</span>
                        <ul className="list-inline mb-0">
                           <li>{Products.stok > 0 ?  "Mevcut" : "Stokta Yok"}</li>                        
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
                        <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Değerlendirmeler ({Yorumlar.length})</a>
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
                        <div
                        className={classNames({
                            "col-lg-7": true,
                            "col-lg-7 degerlendirmeclass": Yorumlar.length==0
                        })} >
                        {Yorumlar.length > 0 ? 
                        Yorumlar.map((element,value)=>(
                            <div key={value} className="media review-block mb-4" ref={animationParent} >
                            <div className="media-body">
                                <h6>{element.namesurname}<span className="text-sm text-muted font-weight-normal ml-3">{element.yorumtarihi}</span></h6>
                                <p>{element.degerlendirme}</p>
                            </div>  
                            </div>
                        ))                    
                          : <div style={{width:"100%",textAlign:"center",fontWeight:"bold",fontSize:18,height:"50px"}}>Henüz Değerlendirme Yapılmamış</div>}
                            
                            
            
                        
                        </div>
            
            
                        <div className="col-lg-5">
                            <div className="review-comment mt-5 mt-lg-0">
                            <h4 className="mb-3">{currentuser ? "Yorum Ekleyin" :"Yorum eklemek için giriş yapın"}</h4>
            
                            <form onSubmit={handleSubmit}>
                                <div className="starrr"></div>
                                <div className="form-group">
                                <input
                                name='namesurname'
                                type="text"
                                className={classNames({
                                    "form-control": true,
                                    "form-control border border-danger": errors.namesurname && touched.namesurname
                                })}
                                placeholder="Adınız ve Soyadınız"
                                onChange={handleChange}
                                value={values.namesurname}
                                disabled={true}
                            />                        
                                </div>
                                <div className="form-group">
                                <input
                                name='email'
                                type="text"
                                className={classNames({
                                    "form-control": true,
                                    "form-control border border-danger": errors.email && touched.email
                                })}
                                placeholder="E-Mail Adresiniz"
                                onChange={handleChange}
                                value={values.email}
                                disabled={true}
                               /> 
                                </div>
                                <div className="form-group">
                                <textarea name="degerlendirme" id="comment"    
                                className={classNames({
                                    "form-control": true,
                                    "form-control border border-danger": errors.degerlendirme && touched.degerlendirme
                                })}
                                 cols="30" 
                                 rows="4" 
                                 placeholder="Değerlendirmeniz"
                                 onChange={handleChange}
                                 value={values.degerlendirme}
                                 disabled={currentuser ? false : true}
                                 ></textarea>
                                </div>
            
                                <button type="submit" to="/product-single" className="btn btn-main btn-small" disabled={values.degerlendirme!="" && values.email!="" && values.namesurname!="" ? false : true}>Gönder</button>
                            </form>
                            </div>
                        </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <div>
                <ToastContainer />
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