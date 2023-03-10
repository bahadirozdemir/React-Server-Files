import * as Yup from 'yup'


const MessageValidation=Yup.object().shape({
    Admin_Mesaj:Yup.string().required('Bu Alanın Doldurulması Zorunludur'),
})
export default MessageValidation