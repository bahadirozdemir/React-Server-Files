import * as Yup from 'yup'


const DegerlendirmeValidation=Yup.object().shape({
    namesurname:Yup.string().required("İsim Alanı Boş Geçilemez"),
    email:Yup.string().required("E-Mail Adresi Boş Geçilemez").email('Geçerli Bir E-Mail Adresi Giriniz.'),
    degerlendirme:Yup.string().required("Değerlendirme Alanı Boş Geçilemez"),
})
export default DegerlendirmeValidation