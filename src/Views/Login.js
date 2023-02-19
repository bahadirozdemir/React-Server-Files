import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { Link } from "react-router-dom"
import LoginValidation from './Validation/LoginValidation';
import classNames from 'classnames';
import { AuthContext } from "../Context/AuthProvider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Login() {
    const { giris } = useContext(AuthContext)
    const { handleChange, handleSubmit, values, errors, touched } = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginValidation
        ,
        onSubmit: values => {
            giris(values.email, values.password).then((result)=>{
                if(result== -1){
                    toast.dismiss();
                    toast.error('E-Mail veya Şifre Hatalı.',
                    { position: toast.POSITION.TOP_CENTER, className: 'error-toast-message' }
                    )
                }
            })
        },
    });
    return (
        <div className="login-container">
            <div className="account section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="login-form border p-5">
                                <div className="text-center heading">
                                    <h2 className="mb-2">Giriş Yap</h2>
                                    <p className="lead">Bir hesabınız yok mu? <Link to={"/kayitol"}>Hesap oluşturun</Link></p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-4">
                                        <label>E-Mail Adresi</label>
                                        <input
                                            name='email'
                                            type="text"
                                            className={classNames({
                                                "form-control mt-1": true,
                                                "form-control mt-1 border border-danger": errors.email && touched.email
                                            })}
                                            placeholder="E-Mail Adresinizi Girin."
                                            onChange={handleChange}
                                            value={values.email}
                                        />
                                        {touched.email && errors.email ? <div style={{marginTop:5,display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}><label style={{fontSize:15,color:"red"}}>{errors.email}</label></div> : null}
                                    </div>
                                    <div className="form-group">
                                        <label>Şifre</label>
                                        <a className="float-right" href="">Şifrenizi mi unuttunuz?</a>
                                        <input
                                            type="password"
                                            className={classNames({
                                                "form-control mt-1": true,
                                                "form-control mt-1 border border-danger": errors.password && touched.password
                                            })}
                                            placeholder="Şifrenizi Girin."
                                            value={values.password}
                                            onChange={handleChange}
                                            name="password"
                                        />
                                        {touched.password && errors.password ? <div style={{marginTop:5,display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}><label style={{fontSize:15,color:"red"}}>{errors.password}</label></div> : null}
                                    </div>

                                    <button  type='submit' className="btn btn-main mt-3 btn-block">Giriş Yap</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div><ToastContainer/></div>
        </div>
    )
}
export default Login