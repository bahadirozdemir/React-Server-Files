import React, { useState } from 'react'
import { Formik, useFormik } from 'formik';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { AiFillDelete } from 'react-icons/ai';
import { RxUpdate } from 'react-icons/rx';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import { FaTruck } from 'react-icons/fa';
import { FcApproval } from 'react-icons/fc';
import classNames from 'classnames'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage';
import { doc, setDoc, collection, getDocs, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from '../../config/firebase';
import PreviewImage from '../PreviewImageAdmin/PreviewImage';
import Swal from 'sweetalert2'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import moment from 'moment/moment';
import Modal from 'react-bootstrap/Modal';
import MessageValidation from '../Validation/MessageValidation';
export default function Message_Table(props) {
    const [Show, SetShow] = useState(false);
    const [Dizi, setDizi] = useState([]);
    const [MessageContent, setMessageContent] = useState("");
    const { handleChange, handleSubmit, values, errors, touched, setFieldValue } = useFormik({
        initialValues: {
            Admin_Mesaj: ""
        },
        validationSchema: MessageValidation
        ,

        onSubmit: async (values) => {
            props.setMesajlar(props.Mesajlar.filter(data => data !== Dizi))
            Swal.fire(
                'Başarılı!',
                'Yanıtınız İletildi.',
                'success'
            )
            values.Admin_Mesaj = "";
            await deleteDoc(doc(db, "Mesajlar",Dizi.id))
            SetShow(false);
        }
    

 
    });
const Read_Message = async (element) => {
    setMessageContent(element.data().message)
    setDizi(element);
    SetShow(true);
}
return (
    <div className={classNames({
        "Pencere": props.visible == "Mesajlari_Listele",
        "Gizle": props.visible != "Mesajlari_Listele",
    })} >
        <MDBTable >
            <MDBTableHead dark>
                <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>İsim Soyisim</th>
                    <th scope='col'>E-Mail Adresi</th>
                    <th scope='col'>Mesaj Tarihi</th>
                    <th scope='col'>İşlemler</th>

                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {props.Mesajlar.length > 0 && props.Mesajlar.map((element, index) => {
                    const a = { startDate: element.data().message_time, timeEnd: Date.now() }
                    const startDate = moment(a.startDate);
                    const timeEnd = moment(a.timeEnd);
                    const diff = timeEnd.diff(startDate);
                    const diffDuration = moment.duration(diff);
                    return (

                        <tr>
                            <th scope='row'>{index + 1}</th>
                            <td>{element.data().name_surname}</td>
                            <td>{element.data().email}</td>
                            <td>{diffDuration.days() == 0 ? "Bugün" : diffDuration.days() + " Gün Önce"}</td>
                            <td>
                                <FaEnvelopeOpenText size={25} cursor="pointer" onClick={() => Read_Message(element)} />
                            </td>

                        </tr>


                    )
                })
                }

            </MDBTableBody>
        </MDBTable>
        <Modal show={Show}>
            <Modal.Header>
                <Modal.Title>Mesaj İçeriği</Modal.Title>
            </Modal.Header>
            <Modal.Body>{MessageContent}</Modal.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                >
                    <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Yanıtınız</Form.Label>{touched.Admin_Mesaj && errors.Admin_Mesaj ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.Admin_Mesaj}</label> : null}</div> </div>
                    <Form.Control name="Admin_Mesaj" value={values.Admin_Mesaj} onChange={handleChange} as="textarea" rows={3} />
                </Form.Group>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => SetShow(false)}>
                        Kapat
                    </Button>
                    <Button type='submit' variant="primary">
                        Gönder
                    </Button>
                </Modal.Footer>
            </Form>

        </Modal>

    </div>
)
}
