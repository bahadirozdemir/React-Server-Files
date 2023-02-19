import {doc,collection, getDocs,where,query,orderBy,getDoc,updateDoc} from "firebase/firestore";
import { db } from '../../config/firebase';
import { AuthContext } from "../../Context/AuthProvider";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React,{ useContext,useEffect,useState} from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PlaceholderImage from "../../PlaceHolderİmages/FYKHA.jpg";
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
export default function Siparislerim() {
const [Siparisler, setSiparisler] = useState([])
const [Urunler, setUrunler] = useState([])
const [Loading, setLoading] = useState(true)
const {currentuser} = useContext(AuthContext)
useEffect(() => {
  const siparisleri_getir=async()=>{
    const querySnapshot = await getDocs(query(collection(db, "Siparisler"),where("siparisveren","==",currentuser.uid),orderBy('sipariszamani',"desc")));
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
    else{
      console.log("sipariş yok")
    }
  


  setLoading(false);

    
  }
  siparisleri_getir();
},[])
  function createData(
    urun_adeti="",
    siparis_tarihi= "",
    odeme_yontemi= "",
    fiyat= "",
    siparis_durumu="",
    dizim=[]
  ) {
 
    return {
      urun_adeti,
      siparis_tarihi,
      odeme_yontemi,
      fiyat,
      siparis_durumu,
      history:dizim,
      
    };
  }
  
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
  
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.urun_adeti}
          </TableCell>
          <TableCell align="right">{row.siparis_tarihi}</TableCell>
          <TableCell align="right">{row.odeme_yontemi}</TableCell>
          <TableCell align="right">{row.fiyat}</TableCell>
          <TableCell align="right">{row.siparis_durumu}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Sipariş Detayları
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ürün Resmi</TableCell>
                      <TableCell>Ürün Markası</TableCell>
                      <TableCell>Cinsiyet</TableCell>
                      <TableCell align="right">Adet</TableCell>
                      <TableCell align="right">Kargo Tutarı</TableCell>
                      <TableCell align="right">Adet Fiyatı</TableCell>
                      <TableCell align="right">Toplam Fiyat</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow,value) => {
                      return (
                        <TableRow key={value}>
                        <TableCell component="th" scope="row">
                        <LazyLoadImage effect="black-and-white" placeholderSrc={PlaceholderImage} width={80} height={80} src={historyRow.urun_resim} alt="product-img" />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {historyRow.urun_markasi}
                        </TableCell>
                        <TableCell>{historyRow.cinsiyet}</TableCell>
                        <TableCell align="right">{historyRow.adet}</TableCell>
                        <TableCell align="right">
                          {historyRow.kargo_fiyat==0 ? "Kargo Bedava" : historyRow.kargo_fiyat + " TL"}
                        </TableCell>
                        <TableCell align="right">
                          {historyRow.fiyat + " TL"}
                        </TableCell>
                        <TableCell align="right">
                          {parseFloat(historyRow.fiyat*historyRow.adet).toFixed(2) + " TL"}
                        </TableCell>
                      </TableRow>
                 
                    )})}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

    const rows=[];
    {Loading==false ?
      Siparisler.map(async(element,value)=>{
      let dizi = [];
      element.Urunler.forEach(async(urun_numaralari)=>{
        const veriler = await getDoc(doc(db,"urunler",urun_numaralari.Urun_No))
        let urun_bilgileri = veriler.data()
        urun_bilgileri["adet"]=urun_numaralari.Adet;
        dizi.push(urun_bilgileri)
      })
      rows.push(createData(element.Urunler.length, element.siparistarihi, element.odemeyontemi, element.odenen + " TL", "Hazırlanıyor",dizi))
    
    })      
    :<div style={{position:"absolute",width:"94%",display:"flex",textAlign:"center",justifyContent:"center",alignItems:"center"}}><div>Yükleniyor</div></div>}

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Ürün Sayısı</TableCell>
            <TableCell align="right">Sipariş Tarihi</TableCell>
            <TableCell align="right">Ödeme Yöntemi</TableCell>
            <TableCell align="right">Toplam Tutar</TableCell>
            <TableCell align="right">Sipariş Durumu</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}