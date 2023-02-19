import * as Yup from 'yup'


const LoginValidation=Yup.object().shape({
    password:Yup.string().required('Şifre Alanı Boş Geçilemez'),
    email:Yup.string().required("E-Mail Adresi Boş Geçilemez").email('Geçerli Bir E-Mail Adresi Giriniz.')
})
export default LoginValidation