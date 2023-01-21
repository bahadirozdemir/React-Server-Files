import BounceLoader from "react-spinners/BounceLoader";
import React from 'react'
export default function Loading() {
    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <BounceLoader color="#36d7b7" />
        </div>



    )
}
