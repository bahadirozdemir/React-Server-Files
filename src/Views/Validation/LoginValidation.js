import * as Yup from 'yup'


const LoginValidation=Yup.object().shape({
    password:Yup.string().required('Şifre Alanı Boş Geçilemez').min(8,({min})=>'Şifre En az '+min+" karakter olmalıdır").matches(/\w*[a-z]\w*/,'En az 1 adet küçük harf kullanınız.').matches(/\w*[A-Z]\w*/,'En az 1 adet büyük harf kullanınız.').matches(/\d/,'En az 1 adet rakam kullanınız.').max(12,({max})=>"Şifre En Fazla "+max+" Karakter Olabilir."),
    email:Yup.string().required("E-Mail Adresi Boş Geçilemez").email('Geçerli Bir E-Mail Adresi Giriniz.')
})
export default LoginValidation