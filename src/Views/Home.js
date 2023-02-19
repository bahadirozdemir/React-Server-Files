import { useState } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react'
const Home=()=>{

 
    const [deneme, setDeneme] = useState(["yahe"])
    const ekle = (key)=>{
      setDeneme(data=> [...data,key])
    }
    const [animationParent] = useAutoAnimate()
    return (
    <>
      <ul ref={animationParent}>
        {deneme.map((element,value)=>(
            <div key={value} ref={animationParent}>{element}</div>
        ))}
      </ul>
      <button onClick={()=>ekle("selam")}>Ekle</button>
      </>
    )
}

export default Home