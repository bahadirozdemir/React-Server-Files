import React,{useContext, useEffect,useState} from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
  MDBBtn,
  MDBRipple,
} from "mdb-react-ui-kit";
import { Link, useParams } from "react-router-dom";
import { collection, doc, getDoc,setDoc,updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { AuthContext } from "../../Context/AuthProvider";
import LoadingBasket from "../../Animation/74644-add-to-basket.json";
import Lottie from "lottie-react";
function DetailPage() {
  const {currentuser,setBasketCount,basketCount}=useContext(AuthContext)
  const params = useParams();
  const [productDetailState, setProductDetailState] = useState([])
  const [CheckBasketButton, setCheckBasketButton] = useState(false)
  const [addLoading, setaddLoading] = useState(false)
  useEffect(() => {
    const getir = async () => {
      let docRef = doc(db, "urunler", params.product_id);
      let docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        //console.log(docSnap.data())
        setProductDetailState(docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("Veri Bulunamadı");
      }
      const veriler = await getDoc(doc(db,"sepet",currentuser.uid))
      if(veriler.data()){
        setBasketCount(veriler.data().sepetim.length);
        const ara = veriler.data().sepetim.find(sepetverileri => sepetverileri===params.product_id)
        if(ara)
        {
          setCheckBasketButton(true)
        }      
      }

    }
    getir();
    console.log("veriler geldi")
  }, [])
 const AddBasket=async()=>{
       setaddLoading(true);
       const veriler = await getDoc(doc(db,"sepet",currentuser.uid))
    
        if(veriler.data()){
          let sepetdizi = veriler.data().sepetim; 
          const ara = sepetdizi.find(sepetverileri => sepetverileri===params.product_id)
          if(ara){
            sepetdizi=[...sepetdizi.filter(data => data !== params.product_id)]
            console.log("sepetten kaldırdık")
            setBasketCount(basketCount-1);
            setCheckBasketButton(false);
            await updateDoc(doc(db,"sepet",currentuser.uid),{
              sepetim:sepetdizi
            }).catch(e=>{
              console.log(e)
            })
          }
          else{
            sepetdizi.push(params.product_id);
            console.log("güncelledik")
            setBasketCount(basketCount+1);
            setCheckBasketButton(true);
            await updateDoc(doc(db,"sepet",currentuser.uid),{
              sepetim:sepetdizi
            }).catch(e=>{
              console.log(e)
            })
          }
          
        }
        else{
          let sepetdizi = [];
          sepetdizi.push(params.product_id);
          console.log("sıfırdan ekledik")
          setBasketCount(basketCount+1);
          setCheckBasketButton(true);
          await setDoc(doc(db, "sepet",currentuser.uid), {
            sepetim:sepetdizi
          }).catch(e=>{
            console.log(e)
          })
        }
       
      setTimeout(() => {
        setaddLoading(false);
      },2000);
  
      
     
 }
 
  return (
    <MDBContainer fluid className="my-5">
      <MDBRow className="justify-content-center">
        <MDBCol md="8" lg="6" xl="4">
          <MDBCard style={{ borderRadius: "15px" }}>
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image rounded hover-overlay"
              style={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
              }}
            >
              <MDBCardImage
                src={setProductDetailState.length > 0 && productDetailState.urun_resim}
                fluid
                className="w-50"
                style={{        
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                }}
              />
              <a href="#!">
                <div className="mask"></div>
              </a>
            </MDBRipple>
            <MDBCardBody className="pb-0">
              <div className="d-flex justify-content-between">
                <div>
                  <p>
                    <a href="#!" className="text-dark">
                    {setProductDetailState.length > 0 && productDetailState.urun_markasi}
                    </a>
                  </p>
                  <p className="small text-muted">{setProductDetailState.length > 0 && productDetailState.urun_cesidi }</p>
                </div>
                <div>
                  <div className="d-flex flex-row justify-content-end mt-1 mb-4 text-danger">
                    <MDBIcon fas icon="star" />
                    <MDBIcon fas icon="star" />
                    <MDBIcon fas icon="star" />
                    <MDBIcon fas icon="star" />
                  </div>
                  <p className="small text-muted">{setProductDetailState.length > 0 && productDetailState.kargo=="Ücretli" ? 'Kargo Ücreti : '+productDetailState.kargo_fiyat +' TL':"Kargo Bedava"  }</p>
                </div>
              </div>
            </MDBCardBody>
            <hr className="my-0" />
            <MDBCardBody className="pb-0">
              <div className="d-flex justify-content-between">
                <p>
                  <a href="#!" className="text-dark">
                  {setProductDetailState.length > 0 && productDetailState.fiyat } TL
                  </a>
                </p>
                <p className="text-dark">{setProductDetailState.length > 0 && productDetailState.urun_renk }</p>
              </div>
              <p className="small text-muted">Online Kredi ve Banka Kartı</p>
            </MDBCardBody>
            <hr className="my-0" />
            <MDBCardBody className="pb-0">
              <div className="d-flex justify-content-between align-items-center pb-2 mb-4">
                <Link to="/" className="text-dark fw-bold">
                  Geri Dön
                </Link>
                {addLoading==true ? <Lottie animationData={LoadingBasket} style={{width:80,height:80}} loop={true} />
                 : 
                 <MDBBtn color="primary" onClick={()=>{AddBasket()}}>{CheckBasketButton==true ? "Sepetten Çıkar" : "Sepete Ekle"}</MDBBtn>
                }
              
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default DetailPage;