import React, { useContext, useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import { AuthContext } from "../../Context/AuthProvider";
import classNames from "classnames";
import { useFormik } from "formik";
import ProfileValidation from './ProfileValidation'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import "./Profile.css"
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBBreadcrumb,
    MDBBreadcrumbItem,
    MDBProgress,
    MDBProgressBar,
    MDBInput,
    MDBCheckbox,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem
} from 'mdb-react-ui-kit';


export default function ProfilePage() {
    const { currentuser } = useContext(AuthContext)
    const [Bilgiler, setBilgiler] = useState([])
    const [Visible, setVisible] = useState(false)
    const [Loading, setLoading] = useState(true)
    const [Update_Time, setUpdateTime] = useState(true)
    const [Zaman, setZaman] = useState("Yükleniyor")
    const { handleChange, handleSubmit, values, errors, touched, setFieldValue,dirty } = useFormik({
        initialValues: {
            isim_soyisim: "",
            email: "",
            telefon: "",
            Adres: "",
            Odeme: ""
        },
        validationSchema: ProfileValidation
        ,
        onSubmit: async (values) => {
            window.scrollTo({top:0,left: 0, behavior: 'smooth'});
            setVisible(false);
            await updateDoc(doc(db,"users",currentuser.uid),{
                isim_soyisim:values.isim_soyisim,
                email:values.email,
                telefon:values.telefon,
                bilgisakla:values.Odeme,
                Adres:values.Adres,
                guncelleme_zamani:new Date().getTime()
              }).then(()=>{      
                toast.dismiss();
                toast.success(<div style={{display:"flex",flexDirection:"column"}}><div>Güncelleme Başarıyla Tamamlandı.</div></div>,
                {
                    position: toast.POSITION.TOP_CENTER,
                    className: 'profile-success-toast-message'
                }
                )
                setUpdateTime(true);
                zamani_azalt(new Date().getTime());    
              }).catch(e=>{
                console.log(e)          
              })  
        }
    });
    const zamani_azalt=(fark)=>{
        var x = setInterval(()=>{
    
           // Find the distance between now and the count down date
            var now = new Date().getTime();
            var distance = now - fark;
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setZaman((4-minutes+" Dakika ") + (60-seconds)+ " Saniye Kaldı")
            console.log(minutes)
            // If the count down is over, write some text 
            if ((4-minutes < 0)) {
              clearInterval(x);
              setZaman("Yükleniyor");
              setUpdateTime(false);
            }
          }, 1000);
    }
    useEffect(() => {

        const get_data = async () => {
            const User_Bilgileri = await getDoc(doc(db, "users", currentuser.uid))
            setBilgiler(User_Bilgileri.data())
            values.isim_soyisim = User_Bilgileri.data().isim_soyisim;
            values.email = User_Bilgileri.data().email;
            values.telefon = User_Bilgileri.data().telefon;
            values.Adres = User_Bilgileri.data().Adres;
            values.Odeme = User_Bilgileri.data().bilgisakla;
            zamani_azalt(User_Bilgileri.data().guncelleme_zamani);
            setLoading(false);
        }
        get_data();
    }, [])


    return (
        <section style={{ backgroundColor: '#fff' }}>
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol>
                        <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
                            <MDBBreadcrumbItem>
                                <a>Profil Bilgileri</a>
                            </MDBBreadcrumbItem>
                        </MDBBreadcrumb>
                    </MDBCol>
                </MDBRow>

                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    src="/assets/images/logo.png"
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: '150px' }}
                                    fluid />
                                <p className="text-muted mb-1">FYKHA Üyesi</p>
                                <p className="text-muted mb-4">Türkiye</p>
                                <div className="d-flex justify-content-center mb-2">
                                    <button disabled={Update_Time==true ? true : false} onClick={() =>setVisible(!Visible)} type='submit' className="btn btn-main mt-3 btn-block">{Update_Time==true ? Zaman : Visible == false ? "Bilgileri Güncelle" : "Gizle"}</button>
                                </div>
                            </MDBCardBody>
                        </MDBCard>


                    </MDBCol>
                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Adınız ve Soyadınız</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{Bilgiler.isim_soyisim ? Bilgiler.isim_soyisim : "Yükleniyor"}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>E-mail</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{Bilgiler.email ? Bilgiler.email : "Yükleniyor"}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Telefon</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{Bilgiler.telefon ? Bilgiler.telefon : "Yükleniyor"}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Adres</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{Bilgiler.Adres ? Bilgiler.Adres : "Yükleniyor"}</MDBCardText>

                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Ödeme Bilgileri</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{Bilgiler.bilgisakla == true ? "Evet" : "Hayır"}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                        <MDBRow>
                            <MDBCol md="12">
                                <MDBCard className={classNames({
                                    "mb-4 mb-md-0 Profil_Bilgileri": Visible == true,
                                    "mb-4 mb-md-0 Profil_Bilgileri_Hidden": Visible == false,
                                })} >
                                    <MDBCardBody>
                                        <form onSubmit={handleSubmit}>


                                            <MDBInput name="isim_soyisim" wrapperClass='mb-4' label={touched.isim_soyisim && errors.isim_soyisim ? <div className="profile_error"><div>Adınız ve Soyadınız</div><div style={{ color: "red" }}>({errors.isim_soyisim})</div></div> : 'Adınız ve Soyadınız'} onChange={handleChange} value={values.isim_soyisim} />
                                            <MDBInput name="email" wrapperClass='mb-4' onChange={handleChange} label={touched.email && errors.email ? <div className="profile_error"><div>E-Mail Adresiniz</div><div style={{ color: "red" }}>({errors.email})</div></div> : 'E-Mail Adresiniz'} value={values.email} />
                                            <MDBInput name="telefon" wrapperClass='mb-4'maxLength={10} onChange={(event) => {
                                            if (event.target.value.match(/[a-z]/i)) {
                                                event.target.value = "";
                                            }
                                            handleChange(event);
                                            }} label={touched.telefon && errors.telefon ? <div className="profile_error"><div>Telefon</div><div style={{ color: "red" }}>({errors.telefon})</div></div> : 'Telefon'} value={values.telefon} />
                                            <MDBInput name="Adres" wrapperClass='mb-4' onChange={handleChange} label={touched.Adres && errors.Adres ? <div className="profile_error"><div>Adres</div><div style={{ color: "red" }}>({errors.Adres})</div></div> : 'Adres'} value={values.Adres} />
                                            <MDBCheckbox
                                                wrapperClass='d-flex justify-content mb-4'
                                                label='Ödeme Bilgilerimde Bu Bilgileri Kullan'
                                                name="Odeme"
                                                onChange={handleChange}
                                                value={values.Odeme}
                                                checked={values.Odeme}
                                               
                                            />
                                            <button type='submit' className="btn btn-main mt-3 btn-block" >Kaydet</button>
                                        </form>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>

                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            <div>
                <ToastContainer />
               </div>
        </section>
    );
}