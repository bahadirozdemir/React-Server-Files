import React, { useContext, useState, useEffect } from 'react';
import { Formik, useFormik } from 'formik';
import { Link } from "react-router-dom"
import classNames from 'classnames'
import { AuthContext } from "../Context/AuthProvider";
import PreviewImage from './PreviewImageAdmin/PreviewImage';
import Select from 'react-select'
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import uuid from 'react-uuid';
const Admin = () => {


  const [id, setid] = useState()
  const [KargoDurum, setKargoDurum] = useState(false)
  const [disable_form, setDisable_Form] = useState(false)
  const AdminValidation=Yup.object().shape({
    urunadi:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    numara:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    cinsiyet:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    kargo:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    urun_renk:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    urun_turu:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    image: Yup.mixed().required('Bu Alanın Doldurulması Zorunludur').test("FILE_SIZE","Dosya Boyutu Çok Büyük",(value)=>value && value.size < 1024*1024)
    .test("FILE_TYPE","Lütfen Jpeg,jpg Veya Png Yükleyin.",(value)=>value && ['image/png','image/jpeg','image/jpg','image/webp'].includes(value.type)),
    urunaciklamasi:Yup.string().required('Bu Alanın Doldurulması Zorunludur').min(8,({min})=>"En Az "+min+" Karakter Uzunluğunda Olmalıdır"),
    fiyat:Yup.number().typeError("Fiyat Sadece Sayılardan Oluşmalıdır")
    .required("Bu Alan Boş Geçilemez")
    .positive(),
    kargofiyat:Yup.number().when("kargo_bool",{
      is:true,
      then:Yup.number().positive().required("Bu Alan Gereklidir")
    })
  
})
  useEffect(() => {
    const vericek = async () => {
      let document_id = []
      let benzersiz_id = uuid();
      const querySnapshot = await getDocs(collection(db, "urunler"));
      querySnapshot.forEach((doc) => {
        document_id.push(doc.id);
      });
      while (true) {
        var find_id = document_id.find(data => data === benzersiz_id)
        if (find_id) {
          benzersiz_id = uuid();
        }
        else {
          console.log("benzersiz olan bulundu.")
          setid(benzersiz_id);
          break;
        }
      }


    }
    vericek();

  }, [])

  function refreshPage() {
    window.location.reload(false);
  }
  const [adres, seturl] = useState()
  const markalar = [
    { value: 'Nike', label: 'Nike' },
    { value: 'Adidas', label: 'Adidas' },
    { value: 'Puma', label: 'Puma' },
    { value: 'Converse', label: 'Converse' },
    { value: 'Vans', label: 'Vans' },
    { value: 'New Balance', label: 'New Balance' },
    { value: 'Under Armour', label: 'Under Armour' },
    { value: 'Hummel', label: 'Hummel' },

  ]
  const cinsiyetler = [
    { value: 'Erkek', label: 'Erkek' },
    { value: 'Kadın', label: 'Kadın' },
    { value: 'Çocuk', label: 'Çocuk' },
  ]
  const renkler = [
    { value: 'Kırmızı', label: 'Kırmızı' },
    { value: 'Mavi', label: 'Mavi' },
    { value: 'Siyah', label: 'Siyah' },
    { value: 'Beyaz', label: 'Beyaz' },
    { value: 'Turuncu', label: 'Turuncu' },
    { value: 'Pembe', label: 'Pembe' },
    { value: 'Mor', label: 'Mor' },
  ]

  const UrunTurleri = [
    { value: 'Bot', label: 'Bot' },
    { value: 'Spor Ayakkabı', label: 'Spor Ayakkabı' },
    { value: 'Günlük Ayakkabı', label: 'Günlük Ayakkabı' },
    { value: 'Sandalet', label: 'Sandalet' },
    { value: 'Babet', label: 'Babet' },
    { value: 'Topuklu Ayakkabı', label: 'Topuklu Ayakkabı' },
    { value: 'Çizme', label: 'Çizme' },
  ]
  const kargolar = [
    { value: 'Ücretsiz', label: 'Ücretsiz' },
    { value: 'Ücretli', label: 'Ücretli' },
    
  ]
  const numaralar = [
    { value: '28', label: '28' },
    { value: '29', label: '29' },
    { value: '30', label: '30' },
    { value: '31', label: '31' },
    { value: '32', label: '32' },
    { value: '33', label: '33' },
    { value: '34', label: '34' },
    { value: '35', label: '35' },
    { value: '36', label: '36' },
    { value: '36.5', label: '36.5' },
    { value: '37', label: '37' },
    { value: '37.5', label: '37.5' },
    { value: '38', label: '38' },
    { value: '38.5', label: '38.5' },
    { value: '39', label: '39' },
    { value: '40', label: '40' },
    { value: '41', label: '41' },
    { value: '42', label: '42' },
    { value: '42.5', label: '42.5' },
    { value: '43', label: '43' },
  ]

  const { handleChange, handleSubmit, values, errors, touched, setFieldValue } = useFormik({
    initialValues: {
      image: '',
      urunadi: '',
      cinsiyet: '',
      numara: '',
      urunaciklamasi: "",
      fiyat: "",
      urun_renk: "",
      urun_turu: "",
      kargo:"",
      kargofiyat:0,
      kargo_bool:false
    },
    validationSchema: AdminValidation
    ,
    onSubmit: async (values) => {
      setDisable_Form(true);
      const imageref = ref(storage, "urunresimleri/" + id + "/" + values.image.name)
      await uploadBytes(imageref, values.image)
      getDownloadURL(imageref).then(async (url) => {
        await setDoc(doc(db, "urunler", id), {
          urun_markasi: values.urunadi.value,
          numara: values.numara.value,
          cinsiyet: values.cinsiyet.value,
          aciklama: values.urunaciklamasi,
          fiyat: values.fiyat,
          urun_id: id,
          urun_resim: url,
          urun_renk:values.urun_renk.value,
          urun_cesidi:values.urun_turu.value,
          kargo:values.kargo.value,
          kargo_fiyat:values.kargofiyat
        })
      }).catch(e => {
        console.log(e)
      })

      console.log("Ürün Başarıyla Eklendi.");
      console.log("her şey tamamlandı.");
      Swal.fire({
        title: 'Uyarı',
        text: "Başarıyla Ürün Ekledin.",
        icon: 'success',
        confirmButtonColor: '#228B22',
        confirmButtonText: "Tamam"
      }).then((result) => {
        if (result.isConfirmed) {
          refreshPage();
        }
      })

    },
  });
  
  return (
    <div style={{ display: "flex" }}>
      <div className="Auth-form-container">
        <form onSubmit={handleSubmit} className="Auth-form" style={{ overflow: "hidden", marginTop: 50 }}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Ürün Ekleyin.</h3>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>{values.image && <>Ürün Resminiz : </>}{values.image && <PreviewImage file={values.image} />}</div>
            <div className="form-group mt-1" >
              <div style={{ display: "flex", flexDirection: "row" }}><label>Ürün Resmi</label> {touched.image && errors.image ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.image}</label></div> : null}</div>
              <input
                type="file"
                onChange={(event) => { setFieldValue("image", event.target.files[0]) }}
                className={classNames({
                  "form-control mt-1": true,
                  "form-control mt-1 border border-danger": errors.image && touched.image
                })}
                name="image"
              />


            </div>
            <div className="form-group mt-1">
              <div style={{ display: "flex", flexDirection: "row" }}><label>Ürün Markası</label> {touched.urunadi && errors.urunadi ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.urunadi}</label></div> : null}</div>
              <Select
                options={markalar}
                onChange={(event) => { setFieldValue("urunadi", event) }}
                name="urunadi"
                placeholder="Ürün Markası Seçin."
                value={values.urunadi}
              />

            </div>
            <div className="form-group mt-3">
              <div style={{ display: "flex", flexDirection: "row" }}><label>Numara</label> {touched.numara && errors.numara ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.numara}</label></div> : null}</div>
              <Select
                options={numaralar}
                onChange={(event) => { setFieldValue("numara", event) }}
                name="numara"
                placeholder="Numara Seçin."
                value={values.numara}
              />

            </div>
            <div className="form-group mt-3">
              <div style={{ display: "flex", flexDirection: "row" }}><label>Cinsiyet</label> {touched.cinsiyet && errors.cinsiyet ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.cinsiyet}</label></div> : null}</div>
              <Select
                options={cinsiyetler}
                onChange={(event) => { setFieldValue("cinsiyet", event) }}
                name="cinsiyet"
                placeholder="Cinsiyet Seçin."
                value={values.cinsiyet}
              />

            </div>
            <div className="form-group mt-3">
              <div style={{ display: "flex", flexDirection: "row" }}><label>Renk</label> {touched.urun_renk && errors.urun_renk ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.urun_renk}</label></div> : null}</div>
              <Select
                options={renkler}
                onChange={(event) => { setFieldValue("urun_renk", event) }}
                name="urun_renk"
                placeholder="Renk Seçin."
                value={values.urun_renk}
              />

            </div>
            <div className="form-group mt-3">
              <div style={{ display: "flex", flexDirection: "row" }}><label>Ürün Türü</label> {touched.urun_turu && errors.urun_turu ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.urun_turu}</label></div> : null}</div>
              <Select
                options={UrunTurleri}
                onChange={(event) => { setFieldValue("urun_turu", event) }}
                name="urun_turu"
                placeholder="Ürün Türünü Seçin."
                value={values.urun_turu}
              />

            </div>
            <div className="form-group mt-3">
              <div style={{ display: "flex", flexDirection: "row" }}><label>Kargo</label> {touched.kargo && errors.kargo ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.kargo}</label></div> : null}</div>
              <Select
                options={kargolar}
                onChange={(event) => {
                  if(event.value=="Ücretli"){
                    setKargoDurum(true);
                    values.kargo_bool=true;
                  } 
                  else{
                    setKargoDurum(false);
                    values.kargo_bool=false;
                  }
                  setFieldValue("kargo", event) 
                }}
                name="kargo"
                placeholder="Kargo Seçin."
                value={values.kargo}
              />

            </div>
            {KargoDurum==true && 
            <div className="form-group mt-3">
              <div style={{ display: "flex", flexDirection: "row" }}><label>Kargo Fiyatı</label> {touched.kargofiyat && errors.kargofiyat ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.kargofiyat}</label></div> : null}</div>
              <input
                name='kargofiyat'
                className={classNames({
                  "form-control mt-1": true,
                  "form-control mt-1 border border-danger": errors.kargofiyat && touched.kargofiyat
                })}
                placeholder="Kargo Fiyatını Girin."
                onChange={handleChange}
                value={values.kargofiyat}
              />

            </div>
            }
            <div className="form-group mt-3">
              <div style={{ display: "flex", flexDirection: "row" }}><label>Ürün Açıklaması</label> {touched.urunaciklamasi && errors.urunaciklamasi ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.urunaciklamasi}</label></div> : null}</div>
              <textarea
                name='urunaciklamasi'
                type="text"
                rows="5"
                cols="60"
                className={classNames({
                  "form-control mt-1": true,
                  "form-control mt-1 border border-danger": errors.urunaciklamasi && touched.urunaciklamasi
                })}
                placeholder="Ürün Açıklamasını Girin."
                onChange={handleChange}
                value={values.urunaciklamasi}
              />

            </div>
            <div className="form-group mt-3">
              <div style={{ display: "flex", flexDirection: "row" }}><label>Fiyat</label> {touched.fiyat && errors.fiyat ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.fiyat}</label></div> : null}</div>
              <input
                name='fiyat'
                className={classNames({
                  "form-control mt-1": true,
                  "form-control mt-1 border border-danger": errors.fiyat && touched.fiyat
                })}
                placeholder="Ürün Fiyatını Girin."
                onChange={handleChange}
                value={values.fiyat}
              />

            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary" disabled={disable_form == true ? "true" : ""}>
                Gönder
              </button>

            </div>
          </div>
        </form>

      </div>
    </div>
    
  );
};
export default Admin