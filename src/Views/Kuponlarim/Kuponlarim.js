import React,{ useContext,useEffect,useState} from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import {doc,collection, getDocs,where,query,orderBy,getDoc} from "firebase/firestore";
import { db } from '../../config/firebase';
import { AuthContext } from "../../Context/AuthProvider";
export default function App() {
  const [Siparisler, setSiparisler] = useState([])
  const [Urunler, setUrunler] = useState([])
  const [Loading, setLoading] = useState(true)
  const {currentuser} = useContext(AuthContext)
  useEffect(() => {
    const siparisleri_getir=async()=>{
 
      const querySnapshot = await getDocs(query(collection(db, "Siparisler"),where("siparisveren","==",currentuser.uid),orderBy('siparistarihi',"desc")));
      if(querySnapshot.size!=0){
          querySnapshot.forEach((siparis_verileri) => {
            setSiparisler(data=> [...data,siparis_verileri.data()]);
            siparis_verileri.data().Urunler.forEach(async(urun_numaralari) => {
                const veriler = await getDoc(doc(db,"urunler",urun_numaralari))
                if(veriler.exists()){
                  setUrunler(data=> [...data,veriler.data()]);
                }            
            });
        });
      }

    setLoading(false);

      
    }
    siparisleri_getir();
  },[])
  return (
    <div style={{padding:50}}>
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th scope='col'>Ürün Markası</th>
          <th scope='col'>Cinsiyet</th>
          <th scope='col'>Ürün Adeti</th>
          <th scope='col'>Sipariş Tarihi</th>
          <th scope='col'>Tutar</th>
          <th scope='col'>Sipariş Durumu</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
      {Loading==false ?
      Siparisler.map((element,value)=>(
        <tr key={value}>
        <td>{Urunler[value] ? Urunler[value].urun_markasi : ""}</td>
        <td>{Urunler[value] ? Urunler[value].cinsiyet : ""}</td>
        <td>{element.Urunler.length}</td>
        <td>{element.siparistarihi}</td>
        <td>{element.odenen} TL</td>
        <td>Hazırlanıyor</td>
        </tr>
      ))      
      :<div style={{position:"absolute",width:"94%",display:"flex",textAlign:"center",justifyContent:"center",alignItems:"center"}}><div>Yükleniyor</div></div>}
      </MDBTableBody>
      
    </MDBTable>
    </div>
  );
}