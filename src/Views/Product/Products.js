import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, doc, getDocs, query, orderBy, limit, startAt, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import LoadingBasket from "../../Animation/74644-add-to-basket.json";
import Lottie from "lottie-react";
import LoadingAnimation from "../../Animation/9965-loading-spinner.json";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import PlaceholderImage from "../../PlaceHolderİmages/FYKHA.png";
function Products() {
    const params = useParams();
    const [RenkFiltre, setRenkFiltre] = useState([])
    const [Renkler, setRenkler] = useState([])
    const [Numaralar, setNumaralar] = useState([])
    const [ProductsData, setProductData] = useState([])
    const [DataSize, setDataSize] = useState()
    const [KolonSayısı, setKolonSayısı] = useState([])
    const [aktifbutton, setAktifButton] = useState()
    const [Loading, setLoading] = useState(true)
    const [NumaraFiltre, setNumaraFiltre] = useState([])
    const [FilterCheck, setFilterCheck] = useState(false)
    useEffect(() => {
        setLoading(true);
        setProductData([]);
        setDataSize(0);
        setKolonSayısı([]);
        let dizi = []
        let renkler = [];
        setAktifButton(params.page.split('=')[1]);
        const getproducts = async () => {
            //console.log(params)
            const datasize = await getDocs(query(collection(db, "urunler"), where("cinsiyet", "==", params.Cinsiyet)));
            setDataSize(datasize.size);
            let after = datasize.docs[(params.page.split('=')[1] * 12) - 12];
            const querySnapshot = await getDocs(query(collection(db, "urunler"), where("cinsiyet", "==", params.Cinsiyet), orderBy("urun_id"), startAt(after), limit(12)));
            //console.log(querySnapshot.size)
            querySnapshot.forEach((doc, index) => {
                setProductData(data => [...data, doc.data()])
                let ara = dizi.find(x => x===doc.data().numara)   
                if(ara){
                    //console.log("Numara var");
                }
                else{
                    dizi.push(doc.data().numara);
                }
                ara = renkler.find(x => x===doc.data().urun_renk)   
                if(ara){
                    //console.log("Renk var");
                }
                else{
                    renkler.push(doc.data().urun_renk);
                }

            });
            dizi.sort(function(a, b){return a - b});
            setNumaralar(dizi);
            setRenkler(renkler)
            for (let index = 1; index < (Math.ceil(datasize.size / 12) + 1); index++) {
                setKolonSayısı(data => [...data, index]);
            }
            setLoading(false);
        }
        getproducts();
  
    }, [params])
    const FiltreEkle_Numara=(key)=>{
        const find_no = NumaraFiltre.find(data => data === key)
        if(find_no){
            setNumaraFiltre([...NumaraFiltre.filter(data => data !== key)])
            console.log("Numara Çıkarıldı")
        }
        else{
            setNumaraFiltre(data => [...data, key]);
            console.log("Numara Eklendi")
        }
       
    }
    const FiltreEkle_Renk=(color)=>{
        const find_no = RenkFiltre.find(data => data === color)
        if(find_no){
            setRenkFiltre([...RenkFiltre.filter(data => data !== color)])
            console.log("Renk çıkarıldı")
        }
        else{
            setRenkFiltre(data => [...data, color]);
            console.log("Renk Eklendi")
        }
    }
    const Filtrele = async ()=>{
        setLoading(true);
        setProductData([])
        setDataSize(0);
        setKolonSayısı([]);
        let filtrelidizi = [];
        if(RenkFiltre.length!=0 && NumaraFiltre.length!=0){
            const querySnapshot = await getDocs(query(collection(db, "urunler"),where("cinsiyet","==",params.Cinsiyet), where("numara", "in",NumaraFiltre),orderBy('urun_id')));
            querySnapshot.forEach(element => {
                filtrelidizi.push(element.data())
            });
            console.log("Hem Numara Hem Renk Seçildi")
            let yenidizi =[];
            RenkFiltre.forEach(renk_kodu => {
        
                filtrelidizi.filter(item => item.urun_renk===renk_kodu).forEach(elemenlar => {
                   yenidizi.push(elemenlar);
               });
            });      
                setProductData(yenidizi);
                setDataSize(yenidizi.length);
        }
        else if(NumaraFiltre.length!=0 && RenkFiltre.length==0) {
            const querySnapshot = await getDocs(query(collection(db, "urunler"),where("cinsiyet","==",params.Cinsiyet), where("numara", "in",NumaraFiltre),orderBy('urun_id')));
            querySnapshot.forEach(element => {
                filtrelidizi.push(element.data())
            });
            console.log("Sadece Numara Seçildi")
            setProductData(filtrelidizi);
            setDataSize(filtrelidizi.length);
        }
        else{
            console.log("Sadece Renk Seçildi")
            const querySnapshot = await getDocs(query(collection(db, "urunler"),where("cinsiyet","==",params.Cinsiyet), where("urun_renk", "in",RenkFiltre),orderBy('urun_id')));
            querySnapshot.forEach(element => {
                filtrelidizi.push(element.data())
            });
            setProductData(filtrelidizi);
            setDataSize(filtrelidizi.length);
            
        }
      
        setTimeout(() => {
            setLoading(false); 
         },3000);
    }
    return (
        <div className="shop-container">
            <section className="products-shop section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="row align-items-center">
                                <div className="col-lg-12 mb-4 mb-lg-0">
                                    <div className="section-title">
                                        <h2 className="d-block text-left-sm">Ürünler / {params.Cinsiyet}</h2>

                                        <div className="heading d-flex justify-content-between mb-5">
                                            {Loading == false ? <p className="result-count mb-0">{DataSize} Ürün listeleniyor</p> : <p>Ürünler Getiriliyor</p>}
                                            <form className="ordering " method="get">
                                                <select defaultValue="Default sorting" name="orderby" className="orderby form-control" aria-label="Shop order" >
                                                    <option value="">En Yeniler</option>
                                                    <option value="">En Yüksek Fiyat</option>
                                                    <option value="">En Düşük Fiyat</option>
                                                </select>
                                                <input type="hidden" name="paged" value="1" />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                {ProductsData.length > 0 && Loading == false ?
                                    ProductsData.map((element, value) => {
                                        const logo = `/assets/images/${element.urun_markasi}.png`
                                        return (
                                            <div key={value} className="col-lg-4 col-12 col-md-6 col-sm-6 mb-5 border border-dark-0">
                                                <div className="product">
                                                    <div className="product-wrap">
                                                        <Link to={"/SingleProduct/"+element.urun_id+"/"+element.urun_markasi}><LazyLoadImage placeholderSrc={PlaceholderImage} width={250} height={350} src={element.urun_resim} alt="product-img" /></Link>
                                                        <Link to={"/SingleProduct/"+element.urun_id+"/"+element.urun_markasi}><div className="div"><img className="img-second" width="100%" height={150} src={logo} alt="product-img" /></div></Link>
                                                    </div>
                                                    <div className="product-info">
                                                        <h2 className="product-title h5 mb-0"><a href="/product-single">{element.aciklama}</a></h2>
                                                        <span className="price">
                                                            {element.fiyat} TL
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    : Loading==true ? 
                                    <div style={{ width: "100%", height: "100vh", display: "flex",flexDirection:"column", justifyContent: "center", alignItems: "center" }}>
                                          <Lottie animationData={LoadingAnimation} style={{width:200,height:200}} />
                                         <h5>Sizin İçin Ürünleri Getiriyoruz.</h5>
                                    </div> 
                                    : 
                                     <div style={{ width: "100%", height: "100vh", display: "flex",flexDirection:"column", justifyContent: "center", alignItems: "center" }}>                                
                                         <br/>
                                         <h5>Üzgünüz Veri Bulunamadı.</h5>
                                      </div>
                                }












                                <div className="col-12">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination">

                                            {
                                                
                                                Loading==false && KolonSayısı.map((element, index) => (
                                                    element == aktifbutton ?
                                                        <li key={index} className="page-item active"><Link className="page-link">{element}</Link></li>
                                                        :
                                                        <li key={index} className="page-item"><Link className="page-link" to={"/Urunler/" + params.Cinsiyet + "/page=" + element}>{element}</Link></li>
                                                ))}

                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">




                            <form className="mb-5">



                                <section className="widget widget-colors mb-5">
                                    <h3 className="widget-title h4 mb-4">Renge Göre Filtrele</h3>
                                    <ul className="list-inline">
                                    {Renkler.map((element,index) => {
                                        return (
                                        <li key={index} className="list-inline-item mr-4">
                                        <div className="custom-control custom-checkbox color-checkbox">
                                            <input onClick={()=>FiltreEkle_Renk(element)} type="checkbox" className="custom-control-input" id={element} />
                                            <label 
                                             className={`custom-control-label ${element}`} htmlFor={element}></label>
                                        </div>                            
                                        </li>    
                                        )})}                             
                                    </ul>
                                </section>


                                <section className="widget widget-sizes mb-5">
                                    
                                    <h3 className="widget-title h4 mb-4">Numaraya Göre Filtrele</h3>
                                    {Numaralar.map((element,index) => (
                                    <div key={index} className="custom-control custom-checkbox">
                                        <input onClick={()=>FiltreEkle_Numara(element)} type="checkbox" className="custom-control-input" id={element} />
                                        <label className="custom-control-label" htmlFor={element}>{element}</label>
                                    </div>
                                    ))}
                                </section>

                                <button type="button" onClick={()=>Filtrele()}  disabled={RenkFiltre.length > 0 || NumaraFiltre.length > 0 ? "" : true}  className="btn btn-black btn-small">Filtrele</button>
                            </form>

                        </div>
                    </div>
                </div>
            </section>
            {setFilterCheck==true && <div>Veri Yok gardaş</div>}
        </div>
    )
}
export default Products;