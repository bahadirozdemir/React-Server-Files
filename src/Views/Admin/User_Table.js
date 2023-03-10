import React, { useState } from 'react'
import { Formik, useFormik } from 'formik';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { AiFillDelete } from 'react-icons/ai';
import { ImBlocked } from 'react-icons/im';
import classNames from 'classnames'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage';
import { doc, setDoc, collection, getDocs, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from '../../config/firebase';
import PreviewImage from '../PreviewImageAdmin/PreviewImage';
import Swal from 'sweetalert2'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { getAuth, deleteUser } from "firebase/auth";
export default function Order_Table(props) {
    const [animationParent] = useAutoAnimate()
    const Kullanici_Sil = (id, dizi) => {
        Swal.fire({
            title: 'Emin Misiniz?',
            text: "Kullanıcı silinecektir.Emin misiniz?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const auth = getAuth();
                const user = auth.currentUser;
                deleteUser(user).then(() => {
                    
                }).catch((error) => {
                    console.log(error)
                });
                await deleteDoc(doc(db, "users", id))
                props.setKullanicilar(props.Kullanicilar.filter(data => data !== dizi))
                Swal.fire(
                    'Başarılı!',
                    'Kullanıcı Silindi.',
                    'success'
                )
            }
        })


    }
    const Kullanici_Engelle = () => {

    }
    return (
        <div className={classNames({
            "Pencere": props.visible == "Kullanicilari_Listele",
            "Gizle": props.visible != "Kullanicilari_Listele",
        })} >
            <MDBTable >
                <MDBTableHead dark>
                    <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Kullanıcı No</th>
                        <th scope='col'>İsim Soyisim</th>
                        <th scope='col'>E-Mail Adresi</th>
                        <th scope='col'>Telefon Numarası</th>
                        <th scope='col'>Son Aktiflik</th>
                        <th scope='col'>İşlemler</th>

                    </tr>
                </MDBTableHead>
                <MDBTableBody ref={animationParent}>
                    {props.Kullanicilar.length > 0 && props.Kullanicilar.map((element, index) => (
                        <>
                            <tr>
                                <th scope='row'>{index + 1}</th>
                                <td>{props.KullaniciNo[index]}</td>
                                <td>{element.isim_soyisim}</td>
                                <td>{element.email}</td>
                                <td>{element.telefon}</td>
                                <td>{element.son_aktiflik}</td>
                                <td>

                                    <AiFillDelete size={25} cursor="pointer" onClick={() => Kullanici_Sil(props.KullaniciNo[index], element)} />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <ImBlocked size={25} cursor="pointer" color='red' onClick={() => Kullanici_Engelle(props.KullaniciNo[index])} />

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
