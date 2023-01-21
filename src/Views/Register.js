import React, { useContext } from 'react';
import { useFormik } from 'formik';
import {Link} from "react-router-dom"
import "./Login.css"
import RegisterValidation from './Validation/RegisterValidation';
import classNames from 'classnames'
import { AuthContext } from "../Context/AuthProvider";
 const Login = () => {
  const {register} = useContext(AuthContext)
   const {handleChange,handleSubmit,values,errors,touched} = useFormik({
     initialValues: {
       namesurname:"",
       email: '',
       password: '',
       confirmpassword:""
     },
     validationSchema:RegisterValidation
     ,
     onSubmit: values => {
       register(values.email,values.password)
     },
   });
   return (
    <div className="Auth-form-container">
    <form onSubmit={handleSubmit} className="Auth-form" >
      <div className="Auth-form-content">
        <h3 className="Auth-form-title">Aramıza Katılın</h3>
        <div className="form-group mt-3">
          <label>Adınız ve Soyadınız</label>
          <input
            name='namesurname'
            type="text"
            className={classNames({
              "form-control mt-1" : true,
              "form-control mt-1 border border-danger":errors.namesurname && touched.namesurname
            })}
            placeholder="Adınızı ve Soyadınızı Girin."
            onChange={handleChange}
            value={values.namesurname}            
          />
             {touched.namesurname && errors.namesurname ? <div style={{marginTop:5,display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}><label style={{fontSize:15,color:"red"}}>{errors.namesurname}</label></div> : null}
        </div>
        <div className="form-group mt-3" >
          <label>E-Mail Adresiniz</label>
          <input
            name="email"
            type="text"
            className={classNames({
              "form-control mt-1" : true,
              "form-control mt-1 border border-danger":errors.email && touched.email
            })}
            placeholder="E-Mail Adresinizi Girin."
            value={values.email}
            onChange={handleChange}
          />
           {touched.email && errors.email ? <div style={{marginTop:5,display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}><label style={{fontSize:15,color:"red"}}>{errors.email}</label></div> : null}
        </div>
        <div className="form-group mt-3" >
          <label>Şifreniz</label>
          <input
            name="password"
            type="password"
            className={classNames({
              "form-control mt-1" : true,
              "form-control mt-1 border border-danger":errors.password && touched.password
            })}
            placeholder="Şifrenizi Girin."
            value={values.password}
            onChange={handleChange}
          />
           {touched.password && errors.password ? <div style={{marginTop:5,display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}><label style={{fontSize:15,color:"red"}}>{errors.password}</label></div> : null}
        </div>
        <div className="form-group mt-3" >
          <label>Tekrar Şifre</label>
          <input
            name="confirmpassword"
            type="password"
            className={classNames({
              "form-control mt-1" : true,
              "form-control mt-1 border border-danger":errors.confirmpassword && touched.confirmpassword
            })}
            placeholder="Şifrenizi Tekrar Girin."
            value={values.confirmpassword}
            onChange={handleChange}
          />
           {touched.confirmpassword && errors.confirmpassword ? <div style={{marginTop:5,display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}><label style={{fontSize:15,color:"red"}}>{errors.confirmpassword}</label></div> : null}
        </div>
        <div className="d-grid gap-2 mt-3">
          <button type="submit" className="btn btn-primary">
            Kayıt Olun
          </button>

        </div>
      </div>
    </form>
  </div>
   );
 };
 export default Login


 