import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../css/Contact.css'
import { Formik, useFormik } from 'formik';
import ContactValidation from '../Validation/ContactValidation';
import { db } from '../../config/firebase';
import {addDoc, collection, doc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React,{useState} from 'react';
function BasicExample() {
    const [Disabled,setDisabled] = useState(false);
    const { handleChange, handleSubmit, values, errors, touched, setFieldValue } = useFormik({
        initialValues: {
          isim_soyisim:"",
          email:"",
          mesajiniz:""
        },
        validationSchema:ContactValidation
        ,
        onSubmit: async (values,{ resetForm }) => {
            setDisabled(true);
            const time = new Date();
            await addDoc(collection(db, "Mesajlar"), {
                name_surname:values.isim_soyisim,
                email:values.email,
                message:values.mesajiniz,
                message_time:time.getTime(),
              }).then(()=>{
                toast.dismiss();
                toast.success('En Kısa Sürede Size Ulaşacağız.Teşekkürler.',
                { position: toast.POSITION.TOP_CENTER, className: 'error-toast-message' }
                )
                 resetForm(); 
                 setDisabled(false);
              })
         
        },
      });
  return (
    <div className='container_contact'>
 <div className='contact-div'>
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
      <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Adınız ve Soyadınız </Form.Label>{touched.isim_soyisim && errors.isim_soyisim ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.isim_soyisim}</label> : null}</div> </div>
        <Form.Control name='isim_soyisim' value={values.isim_soyisim} onChange={handleChange} placeholder="Adınızı ve Soyadınızı girin" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
      <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>E-Mail Adresi </Form.Label>{touched.email && errors.email ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.email}</label> : null}</div> </div>
        <Form.Control name="email" value={values.email} onChange={handleChange} placeholder="E-Mail Adresinizi Girin." />
        <Form.Text className="text-muted">
          E-Mail adresinizi kimseyle paylaşmayacağız.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
      <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Mesajınız</Form.Label>{touched.mesajiniz && errors.mesajiniz ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.mesajiniz}</label> : null}</div> </div>
        <Form.Control name="mesajiniz" value={values.mesajiniz} onChange={handleChange} as="textarea" rows={4} />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={Disabled}>
        Gönder
      </Button>
    </Form>
    </div>
    <div className='contact-div'><img width="100%" height="100%" src={require('../../../src/Images/Thank.png')}/></div>
    <div><ToastContainer/></div>
    </div>
  );
}

export default BasicExample;