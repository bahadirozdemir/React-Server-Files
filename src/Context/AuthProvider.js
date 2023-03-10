import { createContext,useState } from "react"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2'
import { auth } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const AuthContext =createContext();
export const AuthProvider = ({children})=>{
 const navigate = useNavigate();
 const [currentuser, setUser] = useState()
 const [basketCount, setBasketCount] = useState(0)
 const [Price, SetPrice] = useState(0)
    return ( 
    <AuthContext.Provider value={{
      
      currentuser,setUser,setBasketCount,basketCount,Price,SetPrice,
      register:async(email,password,values) =>{
    
        try{
         const new_user = await createUserWithEmailAndPassword(auth,email, password);
            await setDoc(doc(db, "users",new_user.user.uid), {
              Adres:"",
              email:values.email,
              isim_soyisim:values.namesurname,
              telefon:"",
              bilgisakla:false,
              guncelleme_zamani:0,
              son_aktiflik:0,
              ban_suresi:0,
            }).then(()=>{
              navigate("/")   
            })          
        }
        catch(err)
        {
           return -1
        }
      },
      giris:async(email,password) =>{

        try{
          await signInWithEmailAndPassword(auth,email, password);
          navigate("/")
        }
        catch(err)
        {
           return -1;
        }
      },
      logout:async()=>{
        try{
          await signOut(auth);
          setUser(null);       
          navigate("/")

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

