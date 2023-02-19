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
import { useNavigate, useParams } from "react-router-dom";
import PaymentValidation from "../Validation/PaymentValidation";
import {doc,deleteDoc,addDoc, collection, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Swal from 'sweetalert2'
export default function Odeme() {
  const {currentuser,setBasketCount,basketCount,Price} = useContext(AuthContext)
  const [klavye, setklavye] = useState()
  const [Loading, setLoading] = useState(true)
  const [bilgisaklaniyor, setsaklaniyor] = useState(false)
  const [Bilgiler, setBilgiler] = useState(true)
  const navigate = useNavigate();
  useEffect(() => {
  
    const kullanici_bilgileri_getir=async()=>{
      const kullanici_bilgileri = await getDoc(doc(db,"users",currentuser.uid))
      if(kullanici_bilgileri.exists()){
        if(kullanici_bilgileri.data().bilgisakla==true){
          setsaklaniyor(true);
          setBilgiler(kullanici_bilgileri.data());
        }
      }
    }
    kullanici_bilgileri_getir();
   
   
  },[])
  if(Price.tfiyat==undefined){
    navigate("/sepet")
  }
  const [disable_form, setDisable_Form] = useState(false)
  const {handleChange,handleSubmit,values,errors,touched,setFieldValue} = useFormik({
    initialValues: {
      isim:"",
      Adres: '',
      email:"",
      telefon:"",
      BilgiSakla:false,
      OdemeYontemi:"Kredi Kartı",
      Kartisim:"",
      KartNo:"",
      St:"",
      CVV:"",
      Stok:true,

    },
    validationSchema:PaymentValidation
    ,
    onSubmit: async(values) => {
      const check_sepet = await getDoc(doc(db,"sepet",currentuser.uid))
      check_sepet.data().sepetim.forEach(async(element,index) => {
        const stok_check = await getDoc(doc(db,"urunler",element))
        if(stok_check.data().stok==0){
          values.Stok=false;
        }
        if(check_sepet.data().sepetim.length -1 ==index && values.Stok == true){
          if(check_sepet.exists() &&  check_sepet.data().sepetim.length==basketCount && values.Stok == true){
            setDisable_Form(true);
            setBasketCount(0);
            const urunler = await getDoc(doc(db,"sepet",currentuser.uid))
            let Siparis_Urunleri = [];
            urunler.data().sepetim.forEach(element => {
              const find = Price.Adetler.find(data => data.urun_id === element)
              Siparis_Urunleri.push({Urun_No:element,Adet:find.amount})
            });  
            await deleteDoc(doc(db, "sepet", currentuser.uid));
            const current = new Date();
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
            let Hours = current.getHours()
            let Minutes =current.getMinutes();
            if(Hours.toString().length==1){
              Hours = "0"+Hours;
            }
            if(Minutes.toString().length==1){
              Minutes="0"+Minutes;
            }
            await addDoc(collection(db, "Siparisler"), {
              isim:values.isim + values.Soyisim,
              adres:values.Adres,
              email:values.email,
              telefon:values.telefon,
              odenen:parseFloat(parseFloat(Price.tfiyat) + parseFloat(Price.tkargo)).toFixed(2),
              odemeyontemi:values.OdemeYontemi,
              siparisveren:currentuser.uid,
              siparistarihi:date+"."+month+"."+year+" "+Hours+":"+Minutes,
              sipariszamani:new Date().getTime(),
              Urunler:Siparis_Urunleri
            }).then(async()=>{
              if(values.BilgiSakla==true){
                await updateDoc(doc(db, "users",currentuser.uid), {
                  Adres:values.Adres,
                  email:values.email,
                  isim:values.isim,
                  soyisim:values.Soyisim,
                  telefon:values.telefon,
                  bilgisakla:true
                })
              }
              urunler.data().sepetim.forEach(async(element) => {
                const find = Price.Adetler.find(data => data.urun_id === element)
                const urunler = await getDoc(doc(db,"urunler",element))
                let urun_stok_bilgisi = urunler.data().stok - find.amount;
                await updateDoc(doc(db, "urunler",element), {
                   stok:urun_stok_bilgisi
                })
              });
              Swal.fire({
                title: 'Başarılı',
                text: "Siparişiniz Başarıyla Verildi.Siparişlerim Kısmından Geçmiş Siparişlere Bakabilirsiniz.",
                icon: 'success',
                confirmButtonColor: '#228B22',
                confirmButtonText:"Tamam",
                allowOutsideClick: false       
              }).then((result) => {   
                window.location.href="/" 
              })
            }).catch(err=>{
              console.log(err);
            })
          }
          else{
            Swal.fire({
              title: 'Dikkat',
              text: "Sepet İçeriği Değişti. Ana Sayfaya Yönlendirileceksiniz.",
              icon: 'warning',
              confirmButtonColor: '#228B22',
              confirmButtonText:"Tamam",
              allowOutsideClick: false       
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href="/"
              }  
            })
          }
        }
        else if(values.Stok==false) {
          Swal.fire({
            title: 'Dikkat',
            text: "Üzgünüz Sepetinizdeki Bir Ürünün Stoğu Bulunamamaktadır.Ürün Satın alınmış veya kaldırılmış olabilir.Sepete Yönlendiriliyorsunuz.",
            icon: 'warning',
            confirmButtonColor: '#228B22',
            confirmButtonText:"Tamam",
            allowOutsideClick: false       
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href="/sepet"
            }  
          })
        }
      });  
    
     
    },
  });
  if(bilgisaklaniyor==true){
     values.Adres=Bilgiler.Adres;
     values.isim=Bilgiler.isim_soyisim
     values.email=Bilgiler.email
     values.telefon=Bilgiler.telefon
     console.log("Bilgiler Ayarlandı")
  }
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
                  <MDBInput label="Adınız ve Soyadınız" id="form1" type="text" name="isim" value={bilgisaklaniyor==true ? Bilgiler.isim_soyisim : values.isim} onChange={handleChange} disabled={bilgisaklaniyor==true ? true :false} />
                </MDBCol>          
              </MDBRow>
              <div style={{ display: "flex", flexDirection: "row" }}>{touched.Adres && errors.Adres ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.Adres}</label></div> : null}</div>
              <MDBInput
                wrapperClass="mb-4"
                label="Adres"
                id="form3"
                type="text"
                name="Adres"
                value={bilgisaklaniyor==true ? Bilgiler.Adres : values.Adres}
                onChange={handleChange}
                disabled={bilgisaklaniyor==true ? true :false}
              />
              <div style={{ display: "flex", flexDirection: "row" }}>{touched.email && errors.email ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.email}</label></div> : null}</div>
              <MDBInput
                wrapperClass="mb-4"
                label="E-mail"
                id="form4"
                type="email"
                name="email"
                value={bilgisaklaniyor==true ? Bilgiler.email : values.email}
                onChange={handleChange}
                disabled={bilgisaklaniyor==true ?  true :false}
              />
              <div style={{ display: "flex", flexDirection: "row" }}>{touched.telefon && errors.telefon ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><label style={{ fontSize: 10, color: "red" }}>{errors.telefon}</label></div> : null}</div>
              <MDBInput
                wrapperClass="mb-4"
                label="Telefon"
                id="form5"
                type="text"
                name="telefon"
                maxLength={11}
                value={bilgisaklaniyor==true ? Bilgiler.telefon : values.telefon}
                onChange={(event)=>{
                  if(event.target.value.match(/[a-z]/i)){
                    event.target.value="";
                  }
                  handleChange(event);
                }}
                disabled={bilgisaklaniyor==true ? true :false}
              />

              <hr className="my-4" />
              {bilgisaklaniyor!=true &&
              <MDBCheckbox
                id="checkoutForm2"
                label="Bilgilerimi bir dahaki sefere sakla."
                name="BilgiSakla"
                onChange={handleChange}
                value={values.BilgiSakla}
              />
             }

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
              <button  type="submit" class="btn btn-main btn-small" disabled={disable_form == true ? "true" : ""}>Ödemeyi Tamamla</button>
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
                  <span>{Price.tfiyat ? Price.tfiyat.toFixed(2) : ""} TL</span>
                </MDBListGroupItem>
                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  Kargo
                  <span>{Price.tkargo==0 ? "Kargo Bedava" : parseFloat(Price.tkargo).toFixed(2)+" TL"}</span>
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
                    <strong>{parseFloat(parseFloat(Price.tfiyat) + parseFloat(Price.tkargo)).toFixed(2)} TL</strong>
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