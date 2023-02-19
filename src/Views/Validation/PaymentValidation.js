import * as Yup from 'yup'


const PaymentValidation=Yup.object().shape({
    isim:Yup.string().required('Bu Alanın Doldurulması Zorunludur'),
    Adres:Yup.string().required('Bu Alanın Doldurulması Zorunludur'),
    email:Yup.string().required("E-Mail Adresi Boş Geçilemez").email('Geçerli Bir E-Mail Adresi Giriniz.'),
    telefon:Yup.string().required('Bu Alanın Doldurulması Zorunludur'),
    Kartisim:Yup.string().required('Bu Alanın Doldurulması Zorunludur'),
    KartNo:Yup.string().min(19,({min})=>'Eksik Kart Numarası').required('Eksik Kart Numarası'),
    St:Yup.string().required('Bu Alanın Doldurulması Zorunludur'),
    CVV:Yup.string().min(3,({min})=>'Eksik CVV').required('Eksik CVV'),

  
})
export default PaymentValidation