import * as Yup from 'yup'


const ProfileValidation=Yup.object().shape({
    isim_soyisim:Yup.string().required("Lütfen Bu Alanı Doldurun"),
    email:Yup.string().required("Lütfen Bu Alanı Doldurun").email('Geçerli Bir E-Mail Adresi Giriniz.'),
    telefon:Yup.string().required("Lütfen Bu Alanı Doldurun"),
    telefon:Yup.string().required("Lütfen Bu Alanı Doldurun"),
    Adres:Yup.string().required("Lütfen Bu Alanı Doldurun"),

})
export default ProfileValidation