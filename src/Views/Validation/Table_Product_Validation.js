import * as Yup from 'yup'


const Table_Product_Validation=Yup.object().shape({
    urunadi:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    numara:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    cinsiyet:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    kargo:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    stok:Yup.number().typeError("Fiyat Sadece Sayılardan Oluşmalıdır")
    .required("Bu Alan Boş Geçilemez")
    .positive("Fiyat Pozitif Olmalıdır"),
    urun_renk:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    urun_turu:Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
    image: Yup.mixed().required('Bu Alanın Doldurulması Zorunludur').test("FILE_SIZE","Dosya Boyutu Çok Büyük",(value)=>value && value.size < 1024*1024)
    .test("FILE_TYPE","Lütfen Jpeg,jpg Veya Png Yükleyin.",(value)=>value && ['image/png','image/jpeg','image/jpg','image/webp'].includes(value.type)),
    urunaciklamasi:Yup.string().required('Bu Alanın Doldurulması Zorunludur').min(8,({min})=>"En Az "+min+" Karakter Uzunluğunda Olmalıdır"),
    fiyat:Yup.number().typeError("Fiyat Sadece Sayılardan Oluşmalıdır")
    .required("Bu Alan Boş Geçilemez")
    .positive("Fiyat Pozitif Olmalıdır"),
    kargofiyat: Yup.number().when("kargo_bool", {
        is: true,
        then: Yup.number().positive("Kargo Fiyatı Pozitif Olmalıdır").required("Bu Alan Gereklidir")
    })
  
})
export default Table_Product_Validation