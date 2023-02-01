import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
  MDBRipple,
  MDBRow,
  MDBTooltip,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useNavigate,Link } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../../Context/AuthProvider";
import { db } from "../../config/firebase";
import LoadingBasket from "../../Animation/sepet_loading.json";
import LoadingBasketImages from "../../Animation/image_loading.json";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Lottie from "lottie-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Sepet.css"
export default function Sepet() {
  const { currentuser, setBasketCount, SetPrice } = useContext(AuthContext)
  const [sepetim, setSepetim] = useState([])
  const [Basketloading, setBasketLoading] = useState(true)
  const [ToplamFiyat, setFiyat] = useState(0)
  const [ImageLoading, setImageLoading] = useState(false)
  const [removedisabled, setremovedisabled] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
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



  }, [])
  console.log(ToplamFiyat)
  const notify = () => {
    toast.success('Ürün Sepetten Kaldırıldı.',
      { position: toast.POSITION.TOP_LEFT })
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
    console.log("Ürün Kaldırıldı")
    setBasketCount(sepetim.length - 1);
    setTimeout(() => {
      setremovedisabled(false);
    },1000);

  }
  const urun_arttir = async (product_id) => {
    setremovedisabled(true);
    const orjinal_urun_verileri = await getDoc(doc(db, "urunler", product_id))
    let orjinal_fiyat = orjinal_urun_verileri.data().fiyat;
    const ara = sepetim.find(data => data.urun_id === product_id)
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
    },1000);
  }
  const urun_azalt = async (product_id) => {
    setremovedisabled(true);
    console.log(product_id)
    const orjinal_urun_verileri = await getDoc(doc(db, "urunler", product_id))
    let orjinal_fiyat = orjinal_urun_verileri.data().fiyat;
    const ara = sepetim.find(data => data.urun_id === product_id)
    ara.amount = ara.amount - 1;
    console.log(ara.fiyat,orjinal_fiyat)
    if (ara.amount==0) {
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
    },1000);


  }
  return (

    <div className="checkout-container">
      <section class="cart shopping page-wrapper">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-12">
              <div class="product-list">
                <form class="cart-form">
                  <table class="table shop_table shop_table_responsive cart" cellspacing="0">
                    <thead>
                      <tr style={{textAlign:"center"}}>
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
                          <tr class="cart_item">
                            <td class="product-thumbnail" data-title="Thumbnail">
                              <a href="/product-single"><img src={element.urun_resim} class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="" /></a>
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
                              <div class="quantity" style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"row",gap:15}}>
                                <label class="sr-only" >Quantity</label>
                                <button onClick={()=>{urun_azalt(element.urun_id)}}  class={removedisabled==false ? "increment" : "increment_opacity"} disabled={removedisabled==true ? true : false}>-</button>
                                <input disabled type="number" id="quantity_5cc58182489a8" class="input-text qty text" step="1" min="1" max="9" value={element.amount} name="#" title="Qty" size="4" />
                                <button onClick={()=>{urun_arttir(element.urun_id)}}  class={removedisabled==false ? "increment" : "increment_opacity"} disabled={removedisabled==true ? true : false}>+</button>
                              </div>
                            </td>
 
                          </tr>
                        ))

                        : <div style={{width:"100%",textAlign:"center"}}>Sepetiniz Boş</div>}
                      <tr>
                        <td colspan="6" class="actions">
                          <div class="coupon">
                            <input type="text" name="coupon_code" class="input-text form-control" id="coupon_code" value="" placeholder="Kupon Kodunuz" />
                            <button type="button" class="btn btn-black btn-small" name="apply_coupon" value="Apply coupon">Kuponu Uygula</button>
                            {/* <span class="float-right mt-3 mt-lg-0">
                              <button type="button" class="btn btn-dark btn-small" name="update_cart" value="Update cart" disabled="">Update cart</button>
                            </span> */}
                          </div>
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
                <ul class="list-unstyled mb-4">
                  <li class="d-flex justify-content-between pb-2 mb-3">
                    <h5>Ara Toplam</h5>
                    <span>{ToplamFiyat.tfiyat ? ToplamFiyat.tfiyat.toFixed(2)+" TL"   : "Yükleniyor"}</span>
                  </li>
                  <li class="d-flex justify-content-between pb-2 mb-3">
                    <h5>Kargo</h5>
                    <span>{ToplamFiyat.tkargo==0 ? "Kargo Bedava"   : parseFloat(ToplamFiyat.tkargo).toFixed(2)+" TL"}</span>
                  </li>
                  <li class="d-flex justify-content-between pb-2">
                    <h5>Toplam</h5>
                    <span>{parseFloat(ToplamFiyat.tfiyat + ToplamFiyat.tkargo).toFixed(2)} TL</span>
                  </li>
                </ul>
                <Link onClick={()=>{SetPrice(ToplamFiyat)}} class="btn btn-main btn-small" to={"/OdemeSayfasi"}>Ödemeye git</Link>
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