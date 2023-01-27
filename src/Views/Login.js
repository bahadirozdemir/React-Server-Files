import React, { useContext } from 'react';
import { useFormik } from 'formik';
import {Link} from "react-router-dom"
import "./Login.css"
import LoginValidation from './Validation/LoginValidation';
import classNames from 'classnames'
import { AuthContext } from "../Context/AuthProvider";
 
 const Login = () => {
  const {giris} = useContext(AuthContext)
   const {handleChange,handleSubmit,values,errors,touched} = useFormik({
     initialValues: {
       email: '',
       password: '',
     },
     validationSchema:LoginValidation
     ,
     onSubmit: values => {
       giris(values.email,values.password)
     },
   });
   return (
 
    
   
    <div className="Auth-form-container">
    <form onSubmit={handleSubmit} className="Auth-form" >
      <div className="Auth-form-content">
        <h3 className="Auth-form-title">Giriş Yapın</h3>
        <div className="form-group mt-3">
          <label>E-Mail Adresiniz</label>
          <input
            name='email'
            type="text"
            className={classNames({
              "form-control mt-1" : true,
              "form-control mt-1 border border-danger":errors.email && touched.email
            })}
            placeholder="E-Mail Adresinizi Girin."
            onChange={handleChange}
            value={values.email}            
          />
             {touched.email && errors.email ? <div style={{marginTop:5,display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}><label style={{fontSize:15,color:"red"}}>{errors.email}</label></div> : null}
        </div>
        <div className="form-group mt-3" >
          <label>Şifreniz</label>
          <input
            type="password"
            className={classNames({
              "form-control mt-1" : true,
              "form-control mt-1 border border-danger":errors.password && touched.password
            })}
            placeholder="Şifrenizi Girin."
            value={values.password}
            onChange={handleChange}
            name="password"
          />
           {touched.password && errors.password ? <div style={{marginTop:5,display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}><label style={{fontSize:15,color:"red"}}>{errors.password}</label></div> : null}
        </div>
        <div className="d-grid gap-2 mt-3">
          <button type="submit" className="btn btn-primary">
            Giriş Yapın
          </button>

        </div>
        <p style={{display:"flex"}} className="sifreunut mt-2">
        <Link className='sifre' to="/home">Şifrenizi mi unuttunuz?</Link>     
        </p>
      </div>
    </form>
  </div>
   );
 };
 export default Login