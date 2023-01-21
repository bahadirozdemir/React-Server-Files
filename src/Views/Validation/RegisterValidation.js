import * as Yup from 'yup'


const RegisterValidation=Yup.object().shape({
    name:Yup.string().required("İsim Boş Geçilemez"),
    surname:Yup.string().required("Soyisim Boş Geçilemez"),
    password:Yup.string().required('Şifre Boş Geçilemez').min(8,({min})=>'Şifre En az '+min+" karakter olmalıdır").matches(/\w*[a-z]\w*/,'En az 1 adet küçük harf kullanınız.').matches(/\w*[A-Z]\w*/,'En az 1 adet büyük harf kullanınız.').matches(/\d/,'En az 1 adet rakam kullanınız.').max(12,({max})=>"Şifre En Fazla "+max+" Karakter Olabilir."),
    email:Yup.string().required("E-Mail Boş Geçilemez").email('Geçerli Bir E-Mail Adresi Giriniz.'),
    confirmpassword:Yup.string().required("Doğrulama Boş Geçilemez").oneOf([Yup.ref('password')],'Şifreler Eşleşmiyor'),
})
export default RegisterValidation