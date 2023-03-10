import React, { useState } from 'react'
import { Formik, useFormik } from 'formik';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { AiFillDelete } from 'react-icons/ai';
import { RxUpdate } from 'react-icons/rx';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'
import classNames from 'classnames'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage';
import { doc, setDoc, collection, getDocs, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from '../../config/firebase';
import PreviewImage from '../PreviewImageAdmin/PreviewImage';
import Swal from 'sweetalert2'
import Table_Product_Validation from '../Validation/Table_Product_Validation';
import "./Table_Product.css"
export default function Product_Table(props) {
    const numaralar = props.numaralar;
    const markalar = props.markalar;
    const cinsiyetler = props.cinsiyetler;
    const UrunTurleri = props.UrunTurleri;
    const kargolar = props.kargolar;
    const renkler = props.renkler;
    const [show, setShow] = useState(false);
    const [KargoDurum, setKargoDurum] = useState(false)
    const Urun_Sil = async (urun_id) => {
        Swal.fire({
            title: 'Uyarı',
            text: "Ürünü kaldırmak istediğinizden emin misiniz?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet',
            cancelButtonText: "Hayır"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteDoc(doc(db, "urunler", urun_id));
                const storage = getStorage();
                const desertRef = ref(storage, 'urunresimleri/' + urun_id + "/image");
                deleteObject(desertRef).then(() => {
                    console.log("Resim Başarıyla Silindi")
                }).catch((error) => {
                    console.log(error);
                });
                props.setUrunler(props.Urunler.filter(data => data.urun_id !== urun_id))
                Swal.fire(
                    'Başarılı',
                    'Ürün Başarıyla Silindi',
                    'success'
                )
            }
        })
    }
    const { handleChange, handleSubmit, values, errors, touched, setFieldValue } = useFormik({
        initialValues: {
            orijin_image:'',
            image:'',
            urunadi: '',
            cinsiyet: '',
            numara: '',
            urunaciklamasi: "",
            fiyat: "",
            urun_renk: "",
            urun_turu: "",
            kargo: "",
            kargofiyat: 0,
            stok: "",
            kargo_bool: false,
            urun_no: "",
            indirim: "",
        },
        validationSchema: Table_Product_Validation
        ,
        onSubmit: async (values) => {
            //console.log(values);
            const imageref = ref(storage, "urunresimleri/" + values.urun_no + "/" + "image")
            await uploadBytes(imageref, values.image)
            getDownloadURL(imageref).then(async (url) => {
                await updateDoc(doc(db, "urunler", values.urun_no), {
                    urun_markasi: values.urunadi,
                    numara: values.numara,
                    cinsiyet: values.cinsiyet,
                    aciklama: values.urunaciklamasi,
                    fiyat: values.fiyat,
                    urun_resim: url,
                    urun_renk: values.urun_renk,
                    urun_cesidi: values.urun_turu,
                    kargo: values.kargo,
                    kargo_fiyat: values.kargofiyat.toString(),
                    stok: values.stok,
                    indirim: 0,
                })
            }).catch(e => {
                console.log(e)
            })


            Swal.fire({
                title: 'Uyarı',
                text: "Başarıyla Güncelledi.",
                icon: 'success',
                confirmButtonColor: '#228B22',
                confirmButtonText: "Tamam"
            }).then((result) => {
                if (result.isConfirmed) {
                    const search = props.Urunler.find(data => data.urun_id === values.urun_no)
                    search.stok = values.stok;
                    props.setUrunler(props.Urunler.filter(data=>data.urun_id !== values.urun_no))
                    props.setUrunler(data => [search,...data]);
                    setShow(false);
                }
            })

        },
    });

    const Guncelle_Modal_Ac = async (urun_id) => {
        const docSnap = await getDoc(doc(db, "urunler", urun_id));
        if (docSnap.exists()) {
            values.urunaciklamasi = docSnap.data().aciklama;
            values.urunadi = docSnap.data().urun_markasi;
            values.cinsiyet = docSnap.data().cinsiyet;
            values.numara = docSnap.data().numara;
            values.fiyat = docSnap.data().fiyat;
            values.orijin_image = docSnap.data().urun_resim;
            values.urun_renk = docSnap.data().urun_renk;
            values.urun_turu = docSnap.data().urun_cesidi;
            values.stok = docSnap.data().stok;
            values.kargo = docSnap.data().kargo;
            values.kargofiyat = docSnap.data().kargo_fiyat;
            values.urun_no = docSnap.data().urun_id;
            values.indirim = docSnap.data().indirim;
            values.image=""
            if(docSnap.data().kargo_fiyat==0){
                setKargoDurum(false);
            }
            else{
                setKargoDurum(true);
            }
            setShow(true);
        } else {
            console.log("No such document!");
        }


    }
    return (
        <div className={classNames({
            "Pencere": props.visible == "Guncelle_Modal_Ac",
            "Gizle": props.visible != "Guncelle_Modal_Ac",
        })}>
            <MDBTable>
                <MDBTableHead dark>
                    <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Urun Numarası</th>
                        <th scope='col'>Stok Bilgisi</th>
                        <th scope='col'>İşlemler</th>

                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {props.Urunler.length > 0 && props.Urunler.map((element, index) => (
                        <>
                            <tr>
                                <th scope='row'>{index + 1}</th>
                                <td>{element.urun_id}</td>
                                <td>{element.stok}</td>
                                <td>

                                    <AiFillDelete size={25} cursor="pointer" onClick={() => { Urun_Sil(element.urun_id) }} />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <RxUpdate size={25} cursor="pointer" onClick={() => { Guncelle_Modal_Ac(element.urun_id) }} />

                                </td>

                            </tr>
                        </>

                    ))
                    }

                </MDBTableBody>
            </MDBTable>

            <Modal size='xl' show={show} fullscreen={true} onHide={Guncelle_Modal_Ac}>
                <Modal.Header>
                    <Modal.Title>Ürün Güncelle</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                                <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Ürün Açıklaması</Form.Label>{touched.urunaciklamasi && errors.urunaciklamasi ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.urunaciklamasi}</label> : null}</div> </div>
                                <Form.Control
                                    style={{ height: 59, borderRadius: 5 }}
                                    value={values.urunaciklamasi}
                                    onChange={handleChange}
                                    name='urunaciklamasi'
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                                <Form.Label>Ürün Numarası</Form.Label>
                                <Form.Control
                                    style={{ height: 59, borderRadius: 5 }}
                                    value={values.urun_no}
                                    disabled={true}

                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                                <Form.Label>Cinsiyet</Form.Label>
                                <Select
                                    options={cinsiyetler}
                                    name="cinsiyet"
                                    value={values.cinsiyet}
                                    placeholder={values.cinsiyet}
                                    onChange={(event) => { setFieldValue("cinsiyet", event.value) }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                                <Form.Label>Ürün Türü</Form.Label>
                                <Select
                                    options={UrunTurleri}
                                    name="urun_turu"
                                    value={values.urun_turu}
                                    placeholder={values.urun_turu}
                                    onChange={(event) => { setFieldValue("urun_turu", event.value) }}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                                <Form.Label>Ürün Markası</Form.Label>
                                <Select
                                    options={markalar}
                                    name="urun_adi"
                                    value={values.urun_adi}
                                    placeholder={values.urunadi}
                                    onChange={(event) => {setFieldValue("urun_adi", event.value) }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                            <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Stok</Form.Label>{touched.stok && errors.stok ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.stok}</label> : null}</div> </div>
                                <Form.Control
                                    style={{ height: 59, borderRadius: 10 }}
                                    value={values.stok}
                                    onChange={handleChange}
                                    name="stok"

                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                                <Form.Label>Ürün Rengi</Form.Label>
                                <Select
                                    options={renkler}
                                    onChange={(event) => { setFieldValue("urun_renk", event.value) }}
                                    name="urun_renk"
                                    placeholder={values.urun_renk}
                                    value={values.urun_renk}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                            <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Fiyat</Form.Label>{touched.fiyat && errors.fiyat ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.fiyat}</label> : null}</div> </div>
                                <Form.Control
                                    style={{ height: 59, borderRadius: 10 }}
                                    value={values.fiyat}
                                    onChange={handleChange}
                                    name="fiyat"

                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                            <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>İndirim</Form.Label>{touched.indirim && errors.indirim ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.indirim}</label> : null}</div> </div>
                                <Form.Control
                                    style={{ height: 59, borderRadius: 10 }}
                                    value={values.indirim}
                                    onChange={handleChange}
                                    name="indirim"

                                />
                            </Form.Group>
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                                <Form.Label>Numara</Form.Label>
                                <Select
                                    options={numaralar}
                                    onChange={(event) => { setFieldValue("numara", event.value) }}
                                    name="numara"
                                    placeholder={values.numara}
                                    value={values.numara}
                                />
                            </Form.Group>


                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                                <Form.Label>Kargo Türü</Form.Label>
                                <Select
                                    options={kargolar}
                                    onChange={(event) => {
                                        if (event.value == "Ücretli") {
                                            setKargoDurum(true);
                                            values.kargo_bool = true;
                                        }
                                        else {
                                            setKargoDurum(false);
                                            values.kargo_bool = false;
                                        }
                                        setFieldValue("kargo", event.value)
                                    }}
                                    name="kargo"
                                    placeholder={values.kargo}
                                    value={values.kargo}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="" controlId="exampleForm.ControlInput1">
                            <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Kargo Fiyatı</Form.Label>{touched.kargofiyat && errors.kargofiyat ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.kargofiyat}</label> : null}</div> </div>
                                {KargoDurum == true ? <Form.Control onChange={handleChange} value={values.kargofiyat} name='kargofiyat' style={{ height: 59, borderRadius: 10 }} /> : <Form.Control name='kargofiyat' value="Kargo Bedava" style={{ height: 59, borderRadius: 10 }} disabled={true} />}
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">

                            <div className="form-group mt-1 m-3">
                                <div style={{ display: "flex", flexDirection: "row" }}><label>Ürün Resmi</label> {touched.image && errors.image ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.image}</label></div> : null}</div>
                                <div style={{ display: "flex", flexDirection: "row",gap:50}}>
                                <input
                                    type="file"
                                    onChange={(event) => { setFieldValue("image", event.target.files[0]) }}
                                    className={classNames({
                                        "form-control mt-1": true,
                                        "form-control mt-1 border border-danger": errors.image && touched.image
                                    })}
                                    name="image"
                           
                                />
                                {values.image=="" && <img src={values.orijin_image} width="100px" />}
                                </div>


                            </div>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}>{values.image  && <PreviewImage file={values.image} />}</div>
                        </Row>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShow(false)}>
                                Vazgeç
                            </Button>
                            <Button variant="primary" type='submit'>
                                Güncelle
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}
