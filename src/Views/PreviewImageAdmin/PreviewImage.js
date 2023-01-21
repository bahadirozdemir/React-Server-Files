import { useState } from "react"
export default function PreviewImage({file}){
   const [preview, setpreview] = useState({})
   if(file){
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload=()=>{
        setpreview(reader.result)
    
    }
   }
   return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <img style={{width:"70px"}} src={preview} alt=""/>
    </div>
   )
}