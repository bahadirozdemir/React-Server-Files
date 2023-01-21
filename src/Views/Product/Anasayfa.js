import React,{useEffect,useState} from 'react';
import '../css/Anasayfa.css'; 
import Loading from "../Loading/Loading";
import {collection,getDocs} from "firebase/firestore";
import {db} from '../../config/firebase';
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
const Anasayfa = ({navigation}) => {
  const [loading, setloading] = useState(true)
  const [product_list, setdata] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    const get_product_list = async()=>{
      const querySnapshot = await getDocs(collection(db, "urunler"));
      querySnapshot.forEach((doc) => {
        setdata(item => [doc.data(), ...item]);
      });
    }
    get_product_list();
    setTimeout(() => {
      setloading(false);
    },500);
    console.log(product_list);
   
  },[])
  

  if(loading==true)
  {
    return <Loading/>
  }
  return (
    product_list.length > 0 ? 
    <div style={{width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"center",flexDirection:"row",flexWrap:"wrap",gap:35,marginTop:50,padding:20}}>
      {
        product_list.map((element,value)=>(
          <MDBCard className='carddesign' key={value}>
          <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay' style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <MDBCardImage src={element.urun_resim} fluid alt='...' width="200" height="200"/>
            <a>
              <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
            </a>
          </MDBRipple>
          <MDBCardBody>
            <MDBCardTitle>{element.urun_markasi}</MDBCardTitle>
            <MDBCardText style={{fontSize:14}}>
              {element.aciklama}
            </MDBCardText>
            <MDBBtn onClick={()=>{
              navigate("/productdetail/"+element.urun_id+"/"+element.urun_markasi)
            }}
            >Ürün Detayına Git</MDBBtn>
          </MDBCardBody>
        </MDBCard>
        ))
      }
  
    </div>
    : 
    <div style={{width:"100%",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
    <h1>Ürün Eklendiğinde Burada Görünecek Şimdilik Boş</h1>
    </div>
  
  )
}

export default Anasayfa
