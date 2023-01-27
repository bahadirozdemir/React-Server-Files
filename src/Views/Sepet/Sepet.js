import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBListGroup,
    MDBListGroupItem,
    MDBRipple,
    MDBRow,
    MDBTooltip,
    MDBTypography,
    } from "mdb-react-ui-kit";
    import {useNavigate} from "react-router-dom";
    import React,{useEffect,useContext,useState} from "react";
    import {doc, getDoc,updateDoc } from "firebase/firestore";
    import { AuthContext } from "../../Context/AuthProvider";
    import { db } from "../../config/firebase";
    import LoadingBasket from "../../Animation/sepet_loading.json";
    import LoadingBasketImages from "../../Animation/image_loading.json";
    import { LazyLoadImage } from 'react-lazy-load-image-component';
    import 'react-lazy-load-image-component/src/effects/blur.css';
    import Lottie from "lottie-react";
    import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import "./Sepet.css"
    export default function Sepet() {
    const {currentuser,setBasketCount,SetPrice}=useContext(AuthContext)
    const [sepetim, setSepetim] = useState([])
    const [Basketloading, setBasketLoading] = useState(true)
    const [ToplamFiyat, setFiyat] = useState(0)
    const [ImageLoading, setImageLoading] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
      const sepetigetir = async () =>{
        const veriler = await getDoc(doc(db,"sepet",currentuser.uid))
        if(veriler.data()){
          let toplam = 0;
          let kargotoplam = 0;
          //console.log(veriler.data().sepetim.length)
           veriler.data().sepetim.forEach(async (element) => {
              const veriler = await getDoc(doc(db,"urunler",element))
              let sepetverileri = veriler.data()
              if(sepetverileri.fiyat.indexOf('.')!= -1){    
                if(sepetverileri.fiyat.split('.')[0].length==1){
                  sepetverileri.fiyat =Number(sepetverileri.fiyat)*Math.pow(10,sepetverileri.fiyat.split('.')[1].length)    
                }
              }
              sepetverileri["amount"]=1;
              setSepetim(sepetdata =>[...sepetdata,sepetverileri])
              if(veriler.data().fiyat.indexOf('.')==1){          
                if(veriler.data().fiyat.split('.')[0].length==1){
                  toplam = toplam + Number(veriler.data().fiyat)*Math.pow(10,veriler.data().fiyat.split('.')[1].length)
                }
                else{
                  toplam = parseFloat(toplam + parseFloat(veriler.data().fiyat))
                }
              }
              else{
                toplam = parseFloat(toplam + parseFloat(veriler.data().fiyat))
              }    
              if(veriler.data().kargo_fiyat.indexOf('.')==1){          
                if(veriler.data().kargo_fiyat.split('.')[0].length==1){
                  kargotoplam = kargotoplam + Number(veriler.data().kargo_fiyat)*Math.pow(10,veriler.data().kargo_fiyat.split('.')[1].length)
                }
                else{
                  kargotoplam = parseFloat(kargotoplam + parseFloat(veriler.data().kargo_fiyat))
                }
              }
              else{
                kargotoplam = parseFloat(kargotoplam + parseFloat(veriler.data().kargo_fiyat))
              }        
              //console.log(toplam,kargotoplam)
              setFiyat({tfiyat:toplam,tkargo:kargotoplam});
           });
        
        }
  
          setBasketLoading(false);
      
      }
      sepetigetir();

      

    }, [])
    const notify = ()=>{
      toast.success('Ürün Sepetten Kaldırıldı.',
         {position: toast.POSITION.TOP_LEFT})
  }
  const RemoveBasket=async (product_id)=>{
    setBasketCount(sepetim.length - 1);
    const found = sepetim.find(data => data.urun_id===product_id)
    let urunfiyati = found.fiyat;
    let kargofiyati = found.kargo_fiyat
    setFiyat({tfiyat:ToplamFiyat.tfiyat-urunfiyati,tkargo:ToplamFiyat.tkargo-kargofiyati})
    const guncelsepet = await getDoc(doc(db,"sepet",currentuser.uid))
    let sepetdizi = guncelsepet.data().sepetim.filter(data => data != product_id)
    await updateDoc(doc(db,"sepet",currentuser.uid),{
      sepetim:sepetdizi
    }).catch(e=>{
      console.log(e)
    })
    let yenisepet = sepetim.filter(data => data.urun_id != product_id)
    setSepetim(yenisepet);
    notify();
    console.log("Ürün Kaldırıldı")

   
  }
  const urun_arttir = async (product_id)=>{
    const orjinal_urun_verileri = await getDoc(doc(db,"urunler",product_id))
    let orjinal_fiyat = orjinal_urun_verileri.data().fiyat;
    const ara = sepetim.find(data => data.urun_id === product_id)
    ara.amount = ara.amount + 1; 
    if(orjinal_fiyat.indexOf('.')!= -1 && orjinal_fiyat.split('.')[0].length==1){       
      orjinal_fiyat =Number(orjinal_fiyat)*Math.pow(10,orjinal_fiyat.split('.')[1].length)     
      ToplamFiyat.tfiyat = (ToplamFiyat.tfiyat + Number(orjinal_fiyat)) 
      setFiyat({tfiyat:ToplamFiyat.tfiyat,tkargo:ToplamFiyat.tkargo});
      ara.fiyat = Number(orjinal_fiyat) * ara.amount;
    }
    else{  
      ToplamFiyat.tfiyat = (ToplamFiyat.tfiyat + Number(orjinal_fiyat)) 
      setFiyat({tfiyat:ToplamFiyat.tfiyat,tkargo:ToplamFiyat.tkargo});
      ara.fiyat = orjinal_fiyat * ara.amount;   
    }
    
  }
  const urun_azalt= async (product_id)=>{
    const orjinal_urun_verileri = await getDoc(doc(db,"urunler",product_id))
    let orjinal_fiyat = orjinal_urun_verileri.data().fiyat;
    const ara = sepetim.find(data => data.urun_id === product_id)
    if(ara.fiyat==orjinal_fiyat)
    {
      RemoveBasket(product_id);
    }
    else{
        ara.amount = ara.amount - 1; 
    if(orjinal_fiyat.indexOf('.')!= -1 && orjinal_fiyat.split('.')[0].length==1){       
      orjinal_fiyat =Number(orjinal_fiyat)*Math.pow(10,orjinal_fiyat.split('.')[1].length)     
      ToplamFiyat.tfiyat = (ToplamFiyat.tfiyat - Number(orjinal_fiyat)) 
      setFiyat({tfiyat:ToplamFiyat.tfiyat,tkargo:ToplamFiyat.tkargo});
      ara.fiyat = Number(orjinal_fiyat) * ara.amount;
    }
    else{  
      ToplamFiyat.tfiyat = (ToplamFiyat.tfiyat - Number(orjinal_fiyat)) 
      setFiyat({tfiyat:ToplamFiyat.tfiyat,tkargo:ToplamFiyat.tkargo});
      ara.fiyat = orjinal_fiyat * ara.amount;   
    }
    }
  
    
  }
    return (
    sepetim.length > 0  ? 
    <section className="h-100 gradient-custom">
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center my-4">
          <MDBCol md="8">
            <MDBCard className="mb-4">
              {Basketloading== false &&
              <MDBCardHeader className="py-3">
                <MDBTypography tag="h5" className="mb-0">
                  Sepet - {sepetim.length} Ürün
                </MDBTypography>
              </MDBCardHeader>
              }
              <MDBCardBody>
              {Basketloading== true ?<div style={{display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"center"}}> <Lottie animationData={LoadingBasket} style={{width:80,height:80}} loop={true} ></Lottie><div>Sepetiniz Yükleniyor...</div></div>:
              sepetim.map((element,value)=>(
                <div key={value}>
                    <MDBRow >
                    <MDBCol lg="3" md="12" className="mb-4 mb-lg-0">
                      <MDBRipple rippleTag="div" rippleColor="light"
                        className="bg-image rounded hover-zoom hover-overlay" style={{width:150,heigth:150,display:"flex",justifyContent:"center",alignItems:"center"}}>
                         <LazyLoadImage
                          effect="blur"
                          src={element.urun_resim}        
                          afterLoad={()=>{setImageLoading(true)}}
                          className="w-100" />
                        <a href="#!">
                          <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" , }}>
                          </div>
                        </a>
                    
                      
                        {ImageLoading==false &&                                                 
                          <Lottie animationData={LoadingBasketImages} style={{width:80,height:80}} loop={true} />          
                        }
                      </MDBRipple>
                    </MDBCol>
      
                    <MDBCol lg="5" md="6" className=" mb-4 mb-lg-0">
                      <p>
                        <strong>{element.aciklama}</strong>
                      </p>
                      <p>Renk: {element.urun_renk}</p>
                      <p>Numara : {element.numara} </p>
                      <div style={{display:"flex",flexDirection:"row"}}>
                      <div onClick={()=>{RemoveBasket(element.urun_id)}}>
                      <MDBTooltip wrapperProps={{ size: "sm" }} wrapperClass="me-1 mb-2"
                         title="Sepetten Kaldır">
                        <MDBIcon fas icon="trash"/>
                      </MDBTooltip>
                      </div>
                      <div>
                      <MDBTooltip wrapperProps={{ size: "sm" , color: "danger" }} wrapperClass="me-1 mb-2"
                        title="Favorilere Ekle">
                        <MDBIcon fas icon="heart" />
                      </MDBTooltip>
                      </div>
                      </div>
                    </MDBCol>
                    <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
                      <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                        <MDBBtn className="px-3 me-2" onClick={()=>{urun_azalt(element.urun_id)}}>
                          <MDBIcon fas icon="minus" />
                        </MDBBtn>
      
                        <MDBInput value={element.amount} min={0} type="number" label="Adet"  disabled/>
      
                        <MDBBtn className="px-3 ms-2" onClick={()=>{urun_arttir(element.urun_id)}}>
                          <MDBIcon fas icon="plus" />
                        </MDBBtn>
                      </div>
      
                      <p className="text-start text-md-center">
                        <strong>Fiyat : {parseFloat(element.fiyat).toFixed(2)} TL</strong>
                      </p>
                    </MDBCol>
                  </MDBRow>
      
                  <hr className="my-4" />
                  </div>
      
              ))}
          
               
              </MDBCardBody>
            </MDBCard>
    
            <MDBCard className="mb-4">
              <MDBCardBody>
                <p>
                  <strong>Tahmini Kargo Teslim Tarihi</strong>
                </p>
                <p className="mb-0">12.10.2020 - 14.10.2020</p>
              </MDBCardBody>
            </MDBCard>
    
            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody>
                <p>
                  <strong>Kabul Edilen Ödeme Türleri</strong>
                </p>
                <MDBCardImage className="me-2" width="45px"
                  src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                  alt="Visa" />
                <MDBCardImage className="me-2" width="45px"
                  src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
                  alt="American Express" />
                <MDBCardImage className="me-2" width="45px"
                  src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                  alt="Mastercard" />
                <MDBCardImage className="me-2" width="45px"
                  src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce/includes/gateways/paypal/assets/images/paypal.png"
                  alt="PayPal acceptance mark" />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="4">
            <MDBCard className="mb-4">
              <MDBCardHeader>
                <MDBTypography tag="h5" className="mb-0">
                  Sepet Özeti
                </MDBTypography>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBListGroup>
                  <MDBListGroupItem
                    className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Ürün Toplamı
                    <span>{parseFloat(ToplamFiyat.tfiyat).toFixed(2)} TL</span>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center px-0">
                    Kargo
                    <span>{ToplamFiyat.tkargo==0 ? "Kargo Bedava " : parseFloat(ToplamFiyat.tfiyat).toFixed(2) + " TL"} </span>
                  </MDBListGroupItem>
                  <MDBListGroupItem
                    className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <div>
                      <strong>Toplam Fiyat </strong>
                      <strong>
                        <p className="mb-0">(KDV DAHİL)</p>
                      </strong>
                    </div>
                    <span>
                      <strong>{parseFloat(parseFloat(ToplamFiyat.tkargo) + parseFloat(ToplamFiyat.tfiyat)).toFixed(2)} TL</strong>
                    </span>
                  </MDBListGroupItem>
                </MDBListGroup>
    
                <MDBBtn block size="lg" onClick={()=>{
                   SetPrice({UrunToplam:parseFloat(ToplamFiyat.tfiyat).toFixed(2),KargoToplam:parseFloat(ToplamFiyat.tkargo).toFixed(2)})
                   navigate("/OdemeSayfasi")
                }}>
                  Sepeti Onayla
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>  
      <div>
        <ToastContainer />
      </div>
      
    </section>
    : <div className="ortaladiv"><h1 style={{color:"black",fontSize:26}}>Sepetiniz Boş Görünüyor.</h1>  <MDBBtn style={{textTransform: 'Capitalize'}} rounded className='mx-2 butonum'  color='secondary'
     onClick={()=>{navigate("/")}}>
      Alışverişe Başla
    </MDBBtn>
    </div>
    );
    }