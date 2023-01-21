import { createContext,useState } from "react"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2'
import { auth } from "../config/firebase";
export const AuthContext =createContext();
export const AuthProvider = ({children})=>{
 const navigate = useNavigate();
 const [currentuser, setUser] = useState()
    return ( 
    <AuthContext.Provider value={{
      currentuser,setUser,
      register:async(email,password) =>{
        try{
          await createUserWithEmailAndPassword(auth,email, password);
          Swal.fire({
            title: 'Uyarı',
            text: "Başarıyla Kayıt Oldunuz Yönlendiriliyorsunuz.",
            icon: 'success',
            confirmButtonColor: '#228B22',
            confirmButtonText:"Tamam"
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/home")
            }  
          })
        }
        catch(err)
        {
          Swal.fire({
            title: 'Uyarı',
            text: "Böyle Bir Kullanıcı Zaten Mevcut",
            icon: 'warning',
            confirmButtonColor: '#228B22',
            confirmButtonText:"Tamam"
          }) 
        }
      },
      giris:async(email,password) =>{
        try{
          await signInWithEmailAndPassword(auth,email, password);
          Swal.fire({
            title: 'Uyarı',
            text: "Başarıyla Giriş Yaptınız Yönlendiriliyorsunuz.",
            icon: 'success',
            confirmButtonColor: '#228B22',
            confirmButtonText:"Tamam"
          }).then((result) => {
            if (result.isConfirmed) {
              if(email=="root@gmail.com")
              {
                navigate("/admin")
              }
              else
              {
                navigate("/home")
              }
          
            }  
          })
        }
        catch(err)
        {
          Swal.fire({
            title: 'Uyarı',
            text: "Üzgünüz E-Mail veya Şifreniz Hatalı",
            icon: 'warning',
            confirmButtonColor: '#228B22',
            confirmButtonText:"Tamam"
          }) 
        }
      },
      logout:async()=>{
        try{
          await signOut(auth);
          Swal.fire({
            title: 'Uyarı',
            text: "Başarıyla Çıkış Yaptınız.",
            icon: 'success',
            confirmButtonColor: '#228B22',
            confirmButtonText:"Tamam"
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/home")

            }  
          })
        }
        catch(err)
        {
          console.log(err);
        }
      }
      }}>
    
    {children}
    </AuthContext.Provider>

    )

}

