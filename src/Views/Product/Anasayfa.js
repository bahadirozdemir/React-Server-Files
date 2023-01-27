import React,{useEffect,useState} from 'react';
import '../css/Anasayfa.css'; 
import Loading from "../Loading/Loading";
import {collection,getDocs,limit, query,orderBy, startAt, QuerySnapshot, startAfter} from "firebase/firestore";
import {db} from '../../config/firebase';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import MoonLoader from "react-spinners/MoonLoader";
import UseDebounce from '../Debounce/Debounce';
import Lottie from "lottie-react";
import groovyWalkAnimation from "../../Animation/95088-success.json";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBRipple
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import LoadingBasketImages from "../../Animation/image_loading.json";
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
const Anasayfa = () => {

  const callback=async()=>{
    setSayi(Math.random()); 
  }

  useBottomScrollListener(callback);
  const [loading, setloading] = useState(true)
  const [product_list, setdata] = useState([])
  const [start, setstart] = useState()
  const [DocumentSize, setDocumentSize] = useState()
  const [GetDataLoading, setGetDataLoading] = useState(false)
  const [DataEnd, setDataEnd] = useState(false)
  const [sayi, setSayi] = useState()
  const navigate = useNavigate();
  const [ImageLoading, setImageLoading] = useState(false)
  useEffect(() => {
    const get_product_list = async()=>{
      const citiesRef = collection(db, "urunler");
      const lenghtCollection=await getDocs(citiesRef);
      setDocumentSize(lenghtCollection.size)
      const q = query(citiesRef, orderBy("urun_id","asc"), limit(10));
      const querySnapshot = await getDocs(q);
      let counter = 0;
      querySnapshot.forEach((element) => {
        setdata(x => [element.data(),...x]);
        if(counter==9)
        {
          setstart(element.data().urun_id)
        }
        else
        {
          counter++;
        }
      });
    }
    get_product_list();
    setTimeout(() => {
      setloading(false);
    },500);
     
   
  },[])
  const gecikme = UseDebounce(sayi,500)
  useEffect(() => {

    if(gecikme)
    { 
       dataget();   
    }
    else 
    {
      console.log("yok")
    }
  }, [gecikme])
  
 
  const dataget=async()=>{
 
    if(DocumentSize!=product_list.length)
    {
      const citiesRef = collection(db, "urunler");
      const q = query(citiesRef, orderBy("urun_id","asc"), startAfter(start),limit(15));
      const querySnapshot = await getDocs(q);
      let counter=0;
         querySnapshot.forEach((element) => {
          setdata(veriler=>[...veriler,element.data()]);
          if(counter==(querySnapshot.size-1))
          {
            setstart(element.data().urun_id)
            console.log(element.data().urun_id)
          }
          else{
            counter++;
          }
        });
      
    }
    else{
      setDataEnd(true)
      return(
        <div>Veriler Bitti</div>
      )
    }

    setGetDataLoading(false);
  }
  if(loading==true)
  {
    return <Loading/>
  }
  return (
    product_list.length > 0  ? 
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:50,padding:20}}>
      <div style={{padding:40,display:"flex",width:"100%",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",gap:35,flexWrap:"wrap"}}>
      {
        product_list.map((element,value)=>( 
       
          <MDBCard className='carddesign' key={value}>
          <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay' style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <LazyLoadImage effect="" placeholderSrc={require('../../images/FYKHA.png')} src={element.urun_resim} alt='...' width="220px" height="270px"/>
            <a>
              <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
            </a>

          </MDBRipple>
          <MDBCardBody style={{display:"flex",justifyContent:"flex-end",alignItems:"flex-start",flexDirection:"column"}}>
            <MDBCardTitle>{element.urun_markasi}</MDBCardTitle>
            <MDBCardText style={{fontSize:14}}>
              {element.aciklama}
            </MDBCardText>
            <button className='btn btn-outline ' onClick={()=>{
              navigate("/productdetail/"+element.urun_id+"/"+element.urun_markasi)
            }}
            >Ürün Detayına Git</button>
          </MDBCardBody>
        </MDBCard>
        ))
      }
    {GetDataLoading==true ?  <div style={{width:"100%",position:"relative",flexDirection:"column",display: "flex", justifyContent: "center", alignItems: "center" }}>
    <MoonLoader color="#36d7b7" />
    Veriler Getiriliyor
    </div>   : ""}
    {
      DataEnd==true ?<div style={{width:"100%",flexDirection:"column",display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Lottie animationData={groovyWalkAnimation} style={{width:250,height:250}} loop={false} />
      <div style={{fontWeight:"bold"}}>Tüm Ürünleri Gördünüz.</div>
      </div>  : ""
    }
  
    </div>
    </div>
    : 
    
    <div style={{width:"100%",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
    <h1></h1>
    </div>
    
   
  )
}

export default Anasayfa
