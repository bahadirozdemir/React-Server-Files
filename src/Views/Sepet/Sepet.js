import 'animate.css';
import Swal from 'sweetalert2'
import { useNavigate, Link } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";
import { collection, doc, getDoc, getDocs, updateDoc,query,where} from "firebase/firestore";
import { AuthContext } from "../../Context/AuthProvider";
import { db } from "../../config/firebase";
import LoadingBasket from "../../Animation/sepet_loading.json";
import LoadingBasketImages from "../../Animation/image_loading.json";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Lottie from "lottie-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import "./Sepet.css"
import {
  MDBBadge
} from 'mdb-react-ui-kit';
export default function Sepet() {
  const [animationParent] = useAutoAnimate()
  const { currentuser, setBasketCount, SetPrice, basketCount } = useContext(AuthContext)
  const [sepetim, setSepetim] = useState([])
  const [Basketloading, setBasketLoading] = useState(true)
  const [ToplamFiyat, setFiyat] = useState(0)
  const [ImageLoading, setImageLoading] = useState(false)
  const [removedisabled, setremovedisabled] = useState(false)
  const [Kupon, setKupon] = useState("")
  const [KuponBilgileri, setKuponBilgileri] = useState({KuponFiyati:0,KuponKodu:""})
  const navigate = useNavigate();
  useEffect(() => {
    setSepetim([]);
    const sepetigetir = async () => {
      const veriler = await getDoc(doc(db, "sepet", currentuser.uid))
      if (veriler.data()) {
        let toplam = 0;
        let kargotoplam = 0;
        //console.log(veriler.data().sepetim.length)
        veriler.data().sepetim.forEach(async (element) => {
          const veriler = await getDoc(doc(db, "urunler", element))
          let sepetverileri = veriler.data()
          if (sepetverileri.fiyat.indexOf('.') != -1) {
            if (sepetverileri.fiyat.split('.')[0].length == 1) {
              sepetverileri.fiyat = Number(sepetverileri.fiyat) * Math.pow(10, sepetverileri.fiyat.split('.')[1].length)
            }
          }
          sepetverileri["amount"] = 1;
          setSepetim(sepetdata => [...sepetdata, sepetverileri])
          if (veriler.data().fiyat.indexOf('.') == 1) {
            if (veriler.data().fiyat.split('.')[0].length == 1) {
              toplam = toplam + Number(veriler.data().fiyat) * Math.pow(10, veriler.data().fiyat.split('.')[1].length)
            }
            else {
              toplam = parseFloat(toplam + parseFloat(veriler.data().fiyat))
            }
          }
          else {
            toplam = parseFloat(toplam + parseFloat(veriler.data().fiyat))
          }
          if (veriler.data().kargo_fiyat.indexOf('.') == 1) {
            if (veriler.data().kargo_fiyat.split('.')[0].length == 1) {
              kargotoplam = kargotoplam + Number(veriler.data().kargo_fiyat) * Math.pow(10, veriler.data().kargo_fiyat.split('.')[1].length)
            }
            else {
              kargotoplam = parseFloat(kargotoplam + parseFloat(veriler.data().kargo_fiyat))
            }
          }
          else {
            kargotoplam = parseFloat(kargotoplam + parseFloat(veriler.data().kargo_fiyat))
          }
          //console.log(toplam,kargotoplam)
          setFiyat({ tfiyat: toplam, tkargo: kargotoplam });
        });

      }

      setBasketLoading(false);
    }
    sepetigetir();



  }, [basketCount])
 
  const notify = () => {
    toast.success('Ürün Sepetten Kaldırıldı.',
      { position: toast.POSITION.TOP_LEFT })
  }
  if (basketCount == 0) {
    navigate("/")
  }
  const RemoveBasket = async (product_id) => {
    setremovedisabled(true);
    const found = sepetim.find(data => data.urun_id === product_id)
    let urunfiyati = found.fiyat;
    let kargofiyati = found.kargo_fiyat
    setFiyat({ tfiyat: ToplamFiyat.tfiyat - urunfiyati, tkargo: ToplamFiyat.tkargo - kargofiyati })
    const guncelsepet = await getDoc(doc(db, "sepet", currentuser.uid))
    let sepetdizi = guncelsepet.data().sepetim.filter(data => data != product_id)
    await updateDoc(doc(db, "sepet", currentuser.uid), {
      sepetim: sepetdizi
    }).catch(e => {
      console.log(e)
    })
    let yenisepet = sepetim.filter(data => data.urun_id != product_id)
    setSepetim(yenisepet);
    notify();
    setBasketCount(sepetim.length - 1);
    setTimeout(() => {
      setremovedisabled(false);
    }, 1000);


  }
  const urun_arttir = async (product_id) => {
    setremovedisabled(true);
    const orjinal_urun_verileri = await getDoc(doc(db, "urunler", product_id))
    let orjinal_fiyat = orjinal_urun_verileri.data().fiyat;
    const ara = sepetim.find(data => data.urun_id === product_id)
    if (orjinal_urun_verileri.data().stok >= ara.amount + 1) {
      ara.amount = ara.amount + 1;
      if (orjinal_fiyat.indexOf('.') != -1 && orjinal_fiyat.split('.')[0].length == 1) {
        orjinal_fiyat = Number(orjinal_fiyat) * Math.pow(10, orjinal_fiyat.split('.')[1].length)
        ToplamFiyat.tfiyat = (ToplamFiyat.tfiyat + Number(orjinal_fiyat))
        setFiyat({ tfiyat: ToplamFiyat.tfiyat, tkargo: ToplamFiyat.tkargo });
        ara.fiyat = Number(orjinal_fiyat) * ara.amount;
      }
      else {
        ToplamFiyat.tfiyat = (ToplamFiyat.tfiyat + Number(orjinal_fiyat))
        setFiyat({ tfiyat: ToplamFiyat.tfiyat, tkargo: ToplamFiyat.tkargo });
        ara.fiyat = orjinal_fiyat * ara.amount;
      }
      setTimeout(() => {
        setremovedisabled(false);
      }, 1000);
    }
    else {
      setremovedisabled(false);
      toast.warning(<div>Ürün stokta bulunmamakta.<br /><div style={{ fontSize: "11px" }}>Şu an için en fazla {ara.amount} Adet alabilirsiniz.</div></div>,
        {
          position: toast.POSITION.TOP_CENTER,
          className: 'toast-message'
        },

      )
    }
  }
  const urun_azalt = async (product_id) => {
    setremovedisabled(true);
    console.log(product_id)
    const orjinal_urun_verileri = await getDoc(doc(db, "urunler", product_id))
    let orjinal_fiyat = orjinal_urun_verileri.data().fiyat;
    const ara = sepetim.find(data => data.urun_id === product_id)
    ara.amount = ara.amount - 1;
    if (ara.amount == 0) {
      RemoveBasket(product_id);
    }
    else {
      if (orjinal_fiyat.indexOf('.') != -1 && orjinal_fiyat.split('.')[0].length == 1) {
        orjinal_fiyat = Number(orjinal_fiyat) * Math.pow(10, orjinal_fiyat.split('.')[1].length)
        ToplamFiyat.tfiyat = (ToplamFiyat.tfiyat - Number(orjinal_fiyat))
        setFiyat({ tfiyat: ToplamFiyat.tfiyat, tkargo: ToplamFiyat.tkargo });
        ara.fiyat = Number(orjinal_fiyat) * ara.amount;
      }
      else {
        ToplamFiyat.tfiyat = (ToplamFiyat.tfiyat - Number(orjinal_fiyat))
        setFiyat({ tfiyat: ToplamFiyat.tfiyat, tkargo: ToplamFiyat.tkargo });
        ara.fiyat = orjinal_fiyat * ara.amount;
      }
    }
    setTimeout(() => {
      setremovedisabled(false);
    }, 1000);


  }
  const Kupon_Uygulama = async()=>{
 
    if(Kupon!=""){
      let check = 0;
      const Check_Kupon = await getDocs(query(collection(db, "Kuponlar"),where("kullanici_id", "array-contains", currentuser.uid)));
      if(Check_Kupon.size > 0){
      Check_Kupon.docs.forEach((element,value) => {
         if(element.data().kupon_kodu == Kupon){
          toast.dismiss();
          toast.success('Kupon Uygulandı.',
          { position: toast.POSITION.TOP_CENTER , className: 'error-toast-message'})
   
          if(element.data().indirim.split("-")[1]=="TL"){
            setFiyat({ tfiyat: ToplamFiyat.tfiyat - element.data().indirim.split("-")[0], tkargo:ToplamFiyat.tkargo})
            setKuponBilgileri({KuponFiyati:element.data().indirim.split("-")[0],KuponKodu:element.data().kupon_kodu})
          }
          else{
            let yeni_fiyat = parseFloat((ToplamFiyat.tfiyat*element.data().indirim.split("-")[0])/100).toFixed(2);
            setKuponBilgileri({KuponFiyati:yeni_fiyat,KuponKodu:element.data().kupon_kodu})
            setFiyat({ tfiyat: ToplamFiyat.tfiyat - yeni_fiyat, tkargo:ToplamFiyat.tkargo})
          }
          check=check+1;
         }
        if(value==(Check_Kupon.size-1) && check==0){
            toast.dismiss();
            toast.error('Geçersiz Kupon.',
            { position: toast.POSITION.TOP_CENTER, className: 'error-toast-message' })
            setKupon("");       
        }
       
  
      });
                
      }
      else {
        toast.dismiss();
        toast.error('Geçersiz Kupon.',
        { position: toast.POSITION.TOP_CENTER, className: 'error-toast-message' })
        setKupon("");       
      }
    }
  }
  const Odeme_Yap = async () => {
    const veriler = await getDoc(doc(db, "sepet", currentuser.uid))
    const sepet_uzunlugu = veriler.data().sepetim.length;
    if (veriler.data()) {
      let toplam = 0;
      let kargotoplam = 0;
      let uyari = 0;
      let stokta_olmayanlar = [];
      let sepet_dizisi = veriler.data().sepetim;
      //console.log(veriler.data().sepetim.length)
      veriler.data().sepetim.forEach(async (element, index) => {
        const find = sepetim.find(data => data.urun_id === element)
        const veriler = await getDoc(doc(db, "urunler", element))
        if (veriler.data().stok >= find.amount) {
          if (veriler.data().fiyat.indexOf('.') == 1) {
            if (veriler.data().fiyat.split('.')[0].length == 1) {

              toplam = toplam + (Number(veriler.data().fiyat) * Math.pow(10, veriler.data().fiyat.split('.')[1].length) * find.amount)

            }
            else {
              toplam = parseFloat(toplam + (parseFloat(veriler.data().fiyat) * find.amount))
            }
          }
          else {
            toplam = parseFloat(toplam + (parseFloat(veriler.data().fiyat) * find.amount))

          }
          if (veriler.data().kargo_fiyat.indexOf('.') == 1) {
            if (veriler.data().kargo_fiyat.split('.')[0].length == 1) {
              kargotoplam = kargotoplam + Number(veriler.data().kargo_fiyat) * Math.pow(10, veriler.data().kargo_fiyat.split('.')[1].length)
            }
            else {
              kargotoplam = parseFloat(kargotoplam + parseFloat(veriler.data().kargo_fiyat))
            }
          }
          else {
            kargotoplam = parseFloat(kargotoplam + parseFloat(veriler.data().kargo_fiyat))

          }
          SetPrice({ tfiyat: (toplam-KuponBilgileri.KuponFiyati), tkargo: kargotoplam, Adetler: sepetim,Kupon_kodu:KuponBilgileri.KuponKodu});

        }
        else {
          uyari = uyari + 1;
          stokta_olmayanlar.push(veriler.data().urun_id)
        }
        if (index == (sepet_uzunlugu - 1) && uyari > 0) {

          Swal.fire({
            title: 'Custom animation with Animate.css',
            title: 'Dikkat',
            html:
              '<b>Sepetinizde stokta bulunmayan ürün mevcut.</b><br/><div>Ürün Az önce satın alınmış veya kaldırılmış olabilir.</div><div>Sizin için ürünün sepetinizden kaldırılmasını ister misiniz?</div>',
            icon: 'warning',
            showDenyButton: true,
            denyButtonText: 'Detaylar',
            showCancelButton: true,
            confirmButtonText: 'Evet',
            cancelButtonText: 'Hayır',
            reverseButtons: true,
            allowOutsideClick: false,
            showClass: {
              popup: 'animate__animated animate__backInUp'
            },
            hideClass: {
              popup: 'animate__animated animate__zoomOutDown'
            }
          }).then(async (result) => {
            if (result.isConfirmed) {
              let yeni_sepet = [];
              sepet_dizisi.forEach(element => {
                const find_product = stokta_olmayanlar.find(data => data === element)
                if (find_product) {
                  // console.log("Ürün vardı eklenmedi")
                }
                else {
                  yeni_sepet.push(element);
                }
              })
              console.log(yeni_sepet);
              await updateDoc(doc(db, "sepet", currentuser.uid), {
                sepetim: yeni_sepet
              }).catch(e => {
                console.log(e)
              })

              window.location.href = "/sepet"
            }
            else if (result.isDenied) {
              let olmayan_urunler = []
              stokta_olmayanlar.forEach(async (element, index) => {
                const veriler = await getDoc(doc(db, "urunler", element))
                if (veriler.exists()) {
                  olmayan_urunler.push(veriler.data());
                }
                if (index == stokta_olmayanlar.length - 1) {
                  Swal.fire({
                    title: 'Stok Bilgileri',
                    html:
                      '<b>Stokta Bulunmayan Ürünler.</b><br/>' + olmayan_urunler.map((datas,index) => ('<div style={{fontSize:10}}><b>'+(index+1)+' - )</b> '+datas.aciklama +'<br/><div>Kalan Stok : '+datas.stok+'</div>'+'</div>')),
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonText: 'Anladım',
                    allowOutsideClick: false,
                    showConfirmButton:false,
                    showClass: {
                      popup: 'animate__animated animate__backInUp'
                    },
                    hideClass: {
                      popup: 'animate__animated animate__zoomOutDown'
                    }
                  })
                }
              })
            }
          });
        }
        else if (index == (sepet_uzunlugu - 1) && uyari == 0) {
          setBasketCount(sepet_uzunlugu);
          navigate("/OdemeSayfasi")
        }

      });

    }


  }

  return (

    <div className="checkout-container">
      <section class="cart shopping page-wrapper">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-12">
              <div class="product-list">
                <form class="cart-form" >
                  <table class="table shop_table shop_table_responsive cart" cellspacing="0">
                    <thead>
                      <tr style={{ textAlign: "center" }}>
                        <th class="product-thumbnail"> </th>
                        <th class="product-name">Ürün</th>
                        <th class="product-price">Fiyat</th>
                        <th class="product-quantity">Miktar</th>
                        <th class="product-remove"> </th>
                      </tr>
                    </thead>

                    <tbody>
                      {sepetim.length > 0 ?
                        sepetim.map((element, value) => (
                          <tr class="cart_item" ref={animationParent}>
                            <td class="product-thumbnail" data-title="Thumbnail">
                              <Link to={"/SingleProduct/" + element.urun_id + "/" + element.urun_markasi}><img src={element.urun_resim} class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" /></Link>
                            </td>
                            <td class="product-name" data-title="Product">
                              <a href="#">{element.aciklama}</a>
                            </td>
                            <td class="product-price" data-title="Price">
                              <span class="amount"><span class="currencySymbol">
                                <pre wp-pre-tag-3=""></pre>
                              </span>{parseFloat(element.fiyat).toFixed(2)} TL</span>
                            </td>
                            <td class="product-quantity" data-title="Quantity">
                              <div class="quantity" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 15 }}>
                                <label class="sr-only" >Quantity</label>
                                <button onClick={() => { urun_azalt(element.urun_id) }} class={removedisabled == false ? "increment" : "increment_opacity"} disabled={removedisabled == true ? true : false}>-</button>
                                <input disabled type="number" id="quantity_5cc58182489a8" class="input-text qty text" step="1" min="1" max="9" value={element.amount} name="#" title="Qty" size="4" />
                                <button onClick={() => { urun_arttir(element.urun_id) }} class={removedisabled == false ? "increment" : "increment_opacity"} disabled={removedisabled == true ? true : false}>+</button>
                              </div>
                            </td>

                          </tr>
                        ))

                        : <div style={{ width: "100%", textAlign: "center" }}>Sepetiniz Boş</div>}
                      <tr>
                        <td colspan="6" class="actions">
                          {KuponBilgileri.KuponFiyati==0 &&
                          <div class="coupon">
                            <input type="text" name="coupon_code" class="input-text form-control" id="coupon_code" onChange={(e)=>setKupon(e.target.value)} value={Kupon} placeholder="Kupon Kodunuz" />
                            <button onClick={()=>Kupon_Uygulama()} type="button" class="btn btn-black btn-small" name="apply_coupon" value="Apply coupon">Kuponu Uygula</button>
                          </div>
                          }
                          <input type="hidden" id="woocommerce-cart-nonce" name="woocommerce-cart-nonce" value="27da9ce3e8" />
                          <input type="hidden" name="_wp_http_referer" value="/cart/" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
            </div>
          </div>
          <div class="row justify-content-end">
            
            <div class="col-lg-4">
              
              <div class="cart-info card p-4 mt-4">
                
                <h4 class="mb-4">Sepet Toplamı</h4>
                {KuponBilgileri.KuponFiyati!=0 &&
                <MDBBadge style={{display:"flex",justifyContent:"center",alignItems:"center",width:"300px",height:"30px",marginBottom:15}} color='Success' light><div>Kupon Uygulandı Kazancınız : {KuponBilgileri.KuponFiyati} TL</div></MDBBadge>}
                <ul class="list-unstyled mb-4">
                  
                  <li class="d-flex justify-content-between pb-2 mb-3">
                    
                    <h5>Ara Toplam</h5>
                    <span>{ToplamFiyat.tfiyat ? ToplamFiyat.tfiyat.toFixed(2) + " TL" : "Yükleniyor"}</span>
                  </li>
                  <li class="d-flex justify-content-between pb-2 mb-3">
                    <h5>Kargo</h5>
                    <span>{ToplamFiyat.tkargo == 0 ? "Kargo Bedava" : parseFloat(ToplamFiyat.tkargo).toFixed(2) + " TL"}</span>
                  </li>
                  <li class="d-flex justify-content-between pb-2">
                    <h5>Toplam</h5>
                    <span>{parseFloat(ToplamFiyat.tfiyat + ToplamFiyat.tkargo).toFixed(2)} TL</span>
                  </li>
                </ul>
                <button onClick={() => { Odeme_Yap() }} class="btn btn-main btn-small">Ödemeye git</button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ToastContainer />
        </div>
      </section>
    </div>

  )

}