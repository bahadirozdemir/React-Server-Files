import * as Yup from 'yup'


const ContactValidation=Yup.object().shape({
    isim_soyisim:Yup.string().required("Lütfen Bu Alanı Doldurun"),
    email:Yup.string().required("Lütfen Bu Alanı Doldurun").email('Geçerli Bir E-Mail Adresi Giriniz.'),
    mesajiniz:Yup.string().required("Lütfen Bu Alanı Doldurun"),
})
export default ContactValidation