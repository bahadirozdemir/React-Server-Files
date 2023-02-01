import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { Link } from "react-router-dom"
import RegisterValidation from './Validation/RegisterValidation';
import classNames from 'classnames'
import { AuthContext } from "../Context/AuthProvider";
function SignUp() {
  const { register } = useContext(AuthContext)
  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      namesurname: "",
      email: '',
      password: '',
      confirmpassword: ""
    },
    validationSchema: RegisterValidation
    ,
    onSubmit: values => {
      register(values.email, values.password)
    },
  });
  return (
    <div classname="signUp-container">
      <div className="account section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="login-form border p-5">
                <div className="text-center heading">
                  <h2 className="mb-2">Kayıt Ol</h2>
                  <p className="lead">Zaten bir hesabınız var mı? <a href="/login"> Giriş Yapın</a></p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-4">
                    <label>Adınız ve Soyadınız</label>
                    <input
                      name='namesurname'
                      type="text"
                      className={classNames({
                        "form-control mt-1": true,
                        "form-control mt-1 border border-danger": errors.namesurname && touched.namesurname
                      })}
                      placeholder="Adınızı ve Soyadınızı Girin."
                      onChange={handleChange}
                      value={values.namesurname}
                    />
                    {touched.namesurname && errors.namesurname ? <div style={{ marginTop: 5, display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}><label style={{ fontSize: 15, color: "red" }}>{errors.namesurname}</label></div> : null}
                  </div>
                  <div className="form-group mb-4">
                    <label>E-Mail Adresiniz</label>
                    <input
                      name="email"
                      type="text"
                      className={classNames({
                        "form-control mt-1": true,
                        "form-control mt-1 border border-danger": errors.email && touched.email
                      })}
                      placeholder="E-Mail Adresinizi Girin."
                      value={values.email}
                      onChange={handleChange}
                    />
                    {touched.email && errors.email ? <div style={{ marginTop: 5, display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}><label style={{ fontSize: 15, color: "red" }}>{errors.email}</label></div> : null}
                  </div>
                  <div className="form-group mb-4">
                    <label>Şifreniz</label>
                    <input
                      name="password"
                      type="password"
                      className={classNames({
                        "form-control mt-1": true,
                        "form-control mt-1 border border-danger": errors.password && touched.password
                      })}
                      placeholder="Şifrenizi Girin."
                      value={values.password}
                      onChange={handleChange}
                    />
                    {touched.password && errors.password ? <div style={{ marginTop: 5, display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}><label style={{ fontSize: 15, color: "red" }}>{errors.password}</label></div> : null}
                  </div>
                  <div className="form-group">
                    <label>Tekrar Şifre</label>
                    <input
                      name="confirmpassword"
                      type="password"
                      className={classNames({
                        "form-control mt-1": true,
                        "form-control mt-1 border border-danger": errors.confirmpassword && touched.confirmpassword
                      })}
                      placeholder="Şifrenizi Tekrar Girin."
                      value={values.confirmpassword}
                      onChange={handleChange}
                    />
                    {touched.confirmpassword && errors.confirmpassword ? <div style={{ marginTop: 5, display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}><label style={{ fontSize: 15, color: "red" }}>{errors.confirmpassword}</label></div> : null}
                  </div>
                  <button type='submit' className="btn btn-main mt-3 btn-block">Kayıt Ol</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SignUp



