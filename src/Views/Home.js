import { useState } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { db } from "../config/firebase";
import {addDoc,collection} from "firebase/firestore";
const Home=()=>{

 
    const ekle = async()=>{
      const zaman = new Date();
      await addDoc(collection(db, "Kuponlar"), {
        kupon_kodu:"UIYRTUIO",
        indirim:"350-TL",
        kupon_suresi:"6",
        olusturulma_zamani:zaman.getTime(),
        kategori:["Erkek","Kadın","Çocuk"],
        kullanici_id:[],
        aciklama:"",
      }).then(async()=>{
           alert("Kupon Eklendi")
      }).catch(err=>{
        console.log(err);
      })
    }
    const [animationParent] = useAutoAnimate()
    return (
    <>
       
      <button onClick={()=>ekle("selam")}>Ekle</button>
      </>
    )
}

export default Home