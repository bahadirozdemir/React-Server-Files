import React,{useEffect,useState} from "react";
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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

function DetailPage() {
  const params = useParams();
  const [productDetailState, setProductDetailState] = useState([])
  useEffect(() => {
    const getir = async () => {
      const docRef = doc(db, "urunler", params.product_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data())
        setProductDetailState(docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("Veri Bulunamadı");
      }
    }
    getir();
    console.log("veriler geldi")
  }, [])

 
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
                <MDBBtn color="primary">Sepete Ekle</MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default DetailPage;