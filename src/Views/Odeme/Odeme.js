import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCheckbox,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBRadio,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import { useFormik } from 'formik';
import { useContext,useEffect,useState} from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import PaymentValidation from "../Validation/PaymentValidation";
import {doc,deleteDoc,addDoc, collection, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Swal from 'sweetalert2'
export default function Odeme() {
  const {currentuser,setBasketCount} = useContext(AuthContext)
  const [klavye, setklavye] = useState()
  const navigate = useNavigate();
  useEffect(() => {
   if(Price==0){
    navigate("/sepet")
   }
  },[])
  

  const {Price} = useContext(AuthContext)
  const [disable_form, setDisable_Form] = useState(false)
  const {handleChange,handleSubmit,values,errors,touched,setFieldValue} = useFormik({
    initialValues: {
      isim:"",
      Soyisim: '',
      Adres: '',
      email:"",
      telefon:"",
      OdenenFiyat:parseFloat(parseFloat(Price.UrunToplam) + parseFloat(Price.KargoToplam)).toFixed(2),
      BilgiSakla:false,
      OdemeYontemi:"Kredi Kartı",
      Kartisim:"",
      KartNo:"",
      St:"",
      CVV:"",

    },
    validationSchema:PaymentValidation
    ,
    onSubmit: async(values) => {
      setDisable_Form(true);
      setBasketCount(0);
      const urunler = await getDoc(doc(db,"sepet",currentuser.uid))
      await deleteDoc(doc(db, "sepet", currentuser.uid));
      const current = new Date();
      const date = `${current.getDate()}.${current.getMonth()+1}.${current.getFullYear()}`;
      await addDoc(collection(db, "Siparisler"), {
        isim:values.isim + values.Soyisim,
        adres:values.Adres,
        email:values.email,
        telefon:values.telefon,
        odenen:values.OdenenFiyat,
        odemeyontemi:values.OdemeYontemi,
        siparisveren:currentuser.uid,
        siparistarihi:date,   
        Urunler:urunler.data().sepetim  
      }).then(x=>{
        Swal.fire({
          title: 'Başarılı',
          text: "Siparişiniz Başarıyla Verildi.Siparişlerim Kısmından Geçmiş Siparişlere Bakabilirsiniz.",
          icon: 'success',
          confirmButtonColor: '#228B22',
          confirmButtonText:"Tamam",
          allowOutsideClick: false       
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/")
          }  
        })
      }).catch(err=>{
        console.log(err);
      })
    },
  });
  return (
    <MDBContainer className="py-5">
      <MDBRow>
        <MDBCol md="8" className="mb-4">
          <MDBCard className="mb-4">
            <MDBCardHeader className="py-3">
              <h5 className="mb-0">Ödeme Detayları</h5>
            </MDBCardHeader>
            <form  onSubmit={handleSubmit} >
            <MDBCardBody>
              <MDBRow className="mb-4">
              
                <MDBCol>
                <div style={{ display: "flex", flexDirection: "row" }}>{touched.isim && errors.isim ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.isim}</label></div> : null}</div>
                  <MDBInput label="Adınız" id="form1" type="text" name="isim" value={values.isim} onChange={handleChange} />
                </MDBCol>
              
                <MDBCol>
                <div style={{ display: "flex", flexDirection: "row" }}>{touched.Soyisim && errors.Soyisim ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.Soyisim}</label></div> : null}</div>
                  <MDBInput label="Soyadınız" id="form2" type="text" name="Soyisim" value={values.Soyisim} onChange={handleChange}/>
                </MDBCol>
              </MDBRow>
              <div style={{ display: "flex", flexDirection: "row" }}>{touched.Adres && errors.Adres ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.Adres}</label></div> : null}</div>
              <MDBInput
                wrapperClass="mb-4"
                label="Adres"
                id="form3"
                type="text"
                name="Adres"
                value={values.Adres}
                onChange={handleChange}
              />
              <div style={{ display: "flex", flexDirection: "row" }}>{touched.email && errors.email ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.email}</label></div> : null}</div>
              <MDBInput
                wrapperClass="mb-4"
                label="E-mail"
                id="form4"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
              <div style={{ display: "flex", flexDirection: "row" }}>{touched.telefon && errors.telefon ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.telefon}</label></div> : null}</div>
              <MDBInput
                wrapperClass="mb-4"
                label="Telefon"
                id="form5"
                type="text"
                name="telefon"
                maxLength={11}
                value={values.telefon}
                onChange={(event)=>{
                  if(event.target.value.match(/[a-z]/i)){
                    event.target.value="";
                  }
                  handleChange(event);
                }}
              />

              <hr className="my-4" />
               
              <MDBCheckbox
                id="checkoutForm2"
                label="Bilgilerimi bir dahaki sefere sakla."
                name="BilgiSakla"
                onChange={handleChange}
                value={values.BilgiSakla}
              />

              <hr className="my-4" />

              <h5 className="mb-4">Ödeme Türü</h5>
              
              <MDBRadio
                id="flexRadioDefault1"
                label="Kredi Kartı"
                checked={values.OdemeYontemi==="Kredi Kartı"}
                name="OdemeYontemi"
                onChange={()=>{
                  setFieldValue("OdemeYontemi", "Kredi Kartı")
                }}
              />

              <MDBRadio
                id="flexRadioDefault2"
                label="Banka Kartı"
                checked={values.OdemeYontemi==="Banka Kartı"}
                name="OdemeYontemi"
                onChange={()=>{
                  setFieldValue("OdemeYontemi", "Banka Kartı")
                }}
              /> 
              <br/>
                

              <MDBRow>
                <MDBCol>
                <div style={{ display: "flex", flexDirection: "row" }}>{touched.Kartisim && errors.Kartisim ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.Kartisim}</label></div> : null}</div>
                  <MDBInput
                    label="Kartın Üzerindeki İsim"
                    id="form6"
                    type="text"
                    wrapperClass="mb-4"
                    name="Kartisim"
                    value={values.Kartisim}
                    onChange={handleChange}
                  />
                </MDBCol>
                <MDBCol>
                <div style={{ display: "flex", flexDirection: "row" }}>{touched.KartNo && errors.KartNo ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.KartNo}</label></div> : null}</div>
                  <MDBInput
                    
                    label="Kart Numarası"
                    id="form7"                  
                    wrapperClass="mb-4"
                    maxLength={19}
                    onKeyDown={(event)=>{
                      setklavye(event.key);
                    }}
                    name="KartNo"
                    value={values.KartNo}
                    onChange={(event)=>{
                      if(event.target.value.match(/[a-z]/i)){
                        event.target.value="";
                      }
                      let kartnumarasi = event.target.value.replace(/-/g, '')
                      if(kartnumarasi.length % 4 ==0 && event.target.value.length!=0 && kartnumarasi.length!=16 && klavye!="Backspace"){
                        event.target.value = event.target.value + "-";
                      }                
                      handleChange(event);
                    }}
                  />
                </MDBCol>
              </MDBRow>

              <MDBRow>
                <MDBCol md="3">
                <div style={{ display: "flex", flexDirection: "row" }}>{touched.St && errors.St ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.St}</label></div> : null}</div>
                  <MDBInput
                    label="Son Kullanma Tarihi"
                    id="form8"
                    type="text"
                    wrapperClass="mb-4"
                    onKeyDown={(event)=>{
                      setklavye(event.key);
                    }}
                    maxLength={5}
                    name="St"
                    value={values.St}
                    onChange={(event)=>{
                      if(event.target.value.match(/[a-z]/i)){
                        event.target.value="";
                      }
                      if(event.target.value.length == 2 && klavye!="Backspace"){
                        event.target.value= event.target.value + "/"
                      }
                      handleChange(event);
                    }}
                  />
                </MDBCol>
                <MDBCol md="3">
                <div style={{ display: "flex", flexDirection: "row" }}>{touched.CVV && errors.CVV ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.CVV}</label></div> : null}</div>
                  <MDBInput
                    label="CVV"
                    id="form8"
                    type="text"
                    wrapperClass="mb-4"
                    name="CVV"
                    maxLength={3}
                    value={values.CVV}
                    onChange={(event)=>{
                      if(event.target.value.match(/[a-z]/i)){
                        event.target.value="";
                      }                 
                      handleChange(event);
                    }}
                  />
                </MDBCol>
              </MDBRow>

              <MDBBtn size="lg"  disabled={disable_form == true ? "true" : ""}>
                Ödemeyi Tamamla
              </MDBBtn>
            </MDBCardBody>
            </form>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard className="mb-4">
            <MDBCardHeader className="py-3">
              <h5 className="mb-0">Ödeme Bilgileri</h5>
            </MDBCardHeader>
            <MDBCardBody>
              <MDBListGroup >
                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  Ürün Toplamı
                  <span>{Price.UrunToplam} TL</span>
                </MDBListGroupItem>
                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  Kargo
                  <span>{Price.KargoToplam==0 ? "Kargo Bedava" : Price.KargoToplam}</span>
                </MDBListGroupItem>
                <hr className="my-2"></hr>
                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  <div>
                    <strong>Toplam</strong>
                    <strong>
                      <p className="mb-0">(KDV DAHİL)</p>
                    </strong>
                  </div>
                  <span>
                    <strong>{parseFloat(parseFloat(Price.UrunToplam) + parseFloat(Price.KargoToplam)).toFixed(2)} TL</strong>
                  </span>
                </MDBListGroupItem>
              </MDBListGroup>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}