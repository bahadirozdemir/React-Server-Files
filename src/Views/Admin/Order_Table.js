import React, { useState } from 'react'
import { Formik, useFormik } from 'formik';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { AiFillDelete } from 'react-icons/ai';
import { RxUpdate } from 'react-icons/rx';
import { FaBox } from 'react-icons/fa';
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

export default function Product_Table(props) {
    const [animationParent] = useAutoAnimate()
    const DurumDegis = async (Onay_Tipi, Siparis_id, SiparisDizisi) => {
        await updateDoc(doc(db, "Siparisler", Siparis_id), {
            SiparisDurumu: Onay_Tipi
        })
        Swal.fire({
            title: 'Emin Misiniz?',
            text: "Sipariş Durumu "+Onay_Tipi + " Olarak Değiştirilecektir.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet'
        }).then((result) => {
            if (result.isConfirmed) {
                const search = props.Siparisler.find(data => data === SiparisDizisi)
                search.SiparisDurumu = Onay_Tipi;
                props.setSiparisler(props.Siparisler.filter(data => data !== SiparisDizisi))
                props.setSiparisler(data => [search, ...data]);
                console.log(search.data())
                Swal.fire(
                    'Başarılı!',
                    'Sipariş Durumu Güncellendi.',
                    'success'
                )
            }
        })    
    }
    return (
        <div className={classNames({
            "Pencere": props.visible == "Siparis_Guncelle",
            "Gizle": props.visible != "Siparis_Guncelle",
        })} >
            <MDBTable >
                <MDBTableHead dark>
                    <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Sipariş Numarası</th>
                        <th scope='col'>Sipariş Durumu</th>
                        <th scope='col'>Sipariş Sahibi</th>
                        <th scope='col'>İşlemler</th>

                    </tr>
                </MDBTableHead>
                <MDBTableBody ref={animationParent}>
                    {props.Siparisler.length > 0 && props.Siparisler.map((element, index) => (
                        <>
                            <tr>
                                <th scope='row'>{index + 1}</th>
                                <td>{props.SiparisNo[index]}</td>
                                <td>{element.SiparisDurumu}</td>
                                <td>{element.isim}</td>
                                <td>

                                    <FaBox size={25} cursor="pointer" onClick={() => DurumDegis("Sipariş Alındı.", props.SiparisNo[index], element)} />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <FaTruck size={25} cursor="pointer" onClick={() => DurumDegis("Kargoya Verildi.", props.SiparisNo[index], element)} />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <FcApproval size={25} cursor="pointer" onClick={() => DurumDegis("Teslim Edildi.", props.SiparisNo[index], element)} />

                                </td>

                            </tr>
                        </>

                    ))
                    }

                </MDBTableBody>
            </MDBTable>


        </div>
    )
}
