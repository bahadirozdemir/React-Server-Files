import React, { useEffect, useContext, useState } from 'react';
import {
    MDBCard,
    MDBCardTitle,
    MDBCardText,
    MDBCardBody,
    MDBCardHeader,
    MDBBadge
} from 'mdb-react-ui-kit';
import { RiCouponLine } from 'react-icons/ri';
import classNames from "classnames";
import "./Kuponlar.css"
import { db } from "../../config/firebase";
import { query, getDocs, collection, where } from "firebase/firestore";
import { AuthContext } from "../../Context/AuthProvider";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import Lottie from "lottie-react";
import LoadingAnimation from "../../Animation/9965-loading-spinner.json";
export default function App() {
    const { currentuser } = useContext(AuthContext)
    const [Kuponlar, setKuponlar] = useState([])
    const [Loading, setLoading] = useState(true)
    const [KullaniciSayisi, setKullaniciSayisi] = useState(0)
    useEffect(() => {
        document.title="Kuponlarım";
        const kuponlari_getir = async () => {
            const get_users = await getDocs(collection(db,"users"));
            setKullaniciSayisi(get_users.size);
            const SizeOzel = await getDocs(query(collection(db, "Kuponlar"),where("kullanici_id", "array-contains", currentuser.uid)));
            SizeOzel.forEach(element => {
                let veriler = element.data()
                var zaman = new Date();
                let distance =zaman.getTime()-element.data().olusturulma_zamani;
                let TotalDays = Math.ceil(distance / (1000 * 60 * 60 * 24)); 
                if((TotalDays) <= element.data().kupon_suresi){
                   veriler.kupon_suresi = parseInt(element.data().kupon_suresi - (TotalDays-1))
                   setKuponlar(data => [...data, veriler])
                }
                else {
                  console.log("data not found")
              
                }
         
              
            });
            setLoading(false);
        }
        kuponlari_getir();

    },[])
    return (
        <div className='kuponlar_kapsayici'>
            <div className={classNames({
                "kuponlar_kapsayicisi": true,
                "kuponlar_kapsayicisi middle": Kuponlar.length==0
            })}>
                {Kuponlar.length > 0 && Loading==false ? Kuponlar.map((element, index) => (
                    element.kupon_suresi!=false && 
                    <div>
                    <MDBCard background='light' className='mb-3' style={{ width: "250px", height: "250px"}}>
                        <MDBCardHeader className='private'><div style={{color:"white"}}>Kupon için son {element.kupon_suresi} gün</div>{element.kullanici_id.length < KullaniciSayisi && <MDBBadge className='blink_me' style={{display:"flex",justifyContent:"center",alignItems:"center"}} color='warning' light><div>Size Özel</div></MDBBadge>}</MDBCardHeader>
                        <MDBCardBody>
                            <MDBCardTitle>{element.kupon_kodu}</MDBCardTitle>
                            {/* {element.kategori.map(cinsiyetler=>(
                             <MDBBadge className='mr-1' color='secondary' light>{cinsiyetler}</MDBBadge>
                            ))} */}
                 
                            <MDBCardText>
                                
                                {
                                element.aciklama == "" ?
                                <div>Bu Kupon ile tüm kategorilerde geçerli {element.indirim.split("-")[0]+element.indirim.split("-")[1]} indirim uygulanır.</div>
                                :
                                element.aciklama
                                }
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                    </div>
                    
                ))
              :Loading==false && Kuponlar.length==0 ?
              <div className="no_data_found"><RiCouponLine size={45}/><h5> Herhangi Bir Kuponunuz Bulunmamaktadır.</h5></div>
              :
              <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <Lottie animationData={LoadingAnimation} style={{ width: 200, height: 200 }} />
              </div>
              }

            </div>
        </div>
    );
}