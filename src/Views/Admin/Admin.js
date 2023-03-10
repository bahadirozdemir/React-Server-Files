import React, { useContext, useState, useEffect } from 'react';
import { Formik, useFormik } from 'formik';
import { Link } from "react-router-dom"
import classNames from 'classnames'
import PreviewImage from '../PreviewImageAdmin/PreviewImage';
import Select from 'react-select'
import { doc, setDoc, collection, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { db, storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage';
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import uuid from 'react-uuid';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import "./Windows.css"
import Product_Table from './Product_Table'
import Order_Table from './Order_Table'
import User_Table from './User_Table';
import Message_Table from './Message_Table'
const Admin = (props) => {
    const numaralar = props.numaralar;
    const markalar = props.markalar;
    const cinsiyetler = props.cinsiyetler;
    const UrunTurleri = props.UrunTurleri;
    const kargolar = props.kargolar;
    const renkler = props.renkler;
    const [id, setid] = useState()
    const [KargoDurum, setKargoDurum] = useState(false)
    const [UrunSayisi, setUrunSayisi] = useState(0)
    const [OnayBekleyen, setOnayBekleyen] = useState(0)
    const [Kazanc,setKazanc] = useState(0)
    const [Urunler, setUrunler] = useState([])
    const [Siparisler, setSiparisler] = useState([])
    const [Kullanicilar, setKullanicilar] = useState([])
    const [Mesajlar, setMesajlar] = useState([])
    const [KullaniciNo, setKullaniciNo] = useState([])
    const [SiparisNo, setSiparisNo] = useState([])
    const [disable_form, setDisable_Form] = useState(false)
    const [Visible, setVisible] = useState(false)
    const AdminValidation = Yup.object().shape({
        urunadi: Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
        numara: Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
        cinsiyet: Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
        kargo: Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
        urun_renk: Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
        stok: Yup.number().positive().required("Bu Alan Gereklidir"),
        urun_turu: Yup.mixed().required('Bu Alanın Doldurulması Zorunludur'),
        image: Yup.mixed().required('Bu Alanın Doldurulması Zorunludur').test("FILE_SIZE", "Dosya Boyutu Çok Büyük", (value) => value && value.size < 1024 * 1024)
            .test("FILE_TYPE", "Lütfen Jpeg,jpg Veya Png Yükleyin.", (value) => value && ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(value.type)),
        urunaciklamasi: Yup.string().required('Bu Alanın Doldurulması Zorunludur').min(8, ({ min }) => "En Az " + min + " Karakter Uzunluğunda Olmalıdır"),
        fiyat: Yup.number().typeError("Fiyat Sadece Sayılardan Oluşmalıdır")
            .required("Bu Alan Boş Geçilemez")
            .positive(),
        kargofiyat: Yup.number().when("kargo_bool", {
            is: true,
            then: Yup.number().positive().required("Bu Alan Gereklidir")
        })

    })
    useEffect(() => {
        const vericek = async () => {
            let document_id = []
            let benzersiz_id = uuid();
            const querySnapshot = await getDocs(collection(db, "urunler"));
            setUrunSayisi(querySnapshot.size);
            querySnapshot.forEach((doc) => {
                document_id.push(doc.id);
                setUrunler(data => [...data, doc.data()])
            });
            const get_Users = await getDocs(collection(db, "users"));
            get_Users.forEach((doc) => {
                setKullanicilar(data=>[...data,doc.data()]);
                setKullaniciNo(data=>[...data,doc.id]);
            });
            const get_Messages = await getDocs(collection(db, "Mesajlar"));
            get_Messages.forEach((doc) => {
                setMesajlar(data=>[...data,doc]);
            });
            const Bekleyen_Siparisler = await getDocs(collection(db, "Siparisler"));
            let kazanc_tutari = 0;
            let onay_bekleyen = 0;
            Bekleyen_Siparisler.forEach((doc) => {
                if(doc.data().SiparisDurumu=="Beklemede"){
                   onay_bekleyen++;          
                }

                setSiparisler(data=>[...data,doc.data()]);
                setSiparisNo(data=>[...data,doc.id]);
                kazanc_tutari=parseFloat(kazanc_tutari + parseFloat(doc.data().odenen));
               
            });
            setKazanc(kazanc_tutari)
            setOnayBekleyen(onay_bekleyen)
            while (true) {
                var find_id = document_id.find(data => data === benzersiz_id)
                if (find_id) {
                    benzersiz_id = uuid();
                }
                else {

                    setid(benzersiz_id);
                    break;
                }
            }


        }
        vericek();

    }, [])

    function refreshPage() {
        window.location.reload(false);
    }

    const { handleChange, handleSubmit, values, errors, touched, setFieldValue } = useFormik({
        initialValues: {
            image: '',
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
        },
        validationSchema: AdminValidation
        ,
        onSubmit: async (values) => {
            setDisable_Form(true);
            const imageref = ref(storage, "urunresimleri/" + id + "/" + "image")
            await uploadBytes(imageref, values.image)
            getDownloadURL(imageref).then(async (url) => {
                await setDoc(doc(db, "urunler", id), {
                    urun_markasi: values.urunadi.value,
                    numara: values.numara.value,
                    cinsiyet: values.cinsiyet.value,
                    aciklama: values.urunaciklamasi,
                    fiyat: values.fiyat,
                    urun_id: id,
                    urun_resim: url,
                    urun_renk: values.urun_renk.value,
                    urun_cesidi: values.urun_turu.value,
                    kargo: values.kargo.value,
                    kargo_fiyat: values.kargofiyat.toString(),
                    stok: values.stok,
                    indirim: 0,
                })
            }).catch(e => {
                console.log(e)
            })


            Swal.fire({
                title: 'Uyarı',
                text: "Başarıyla Ürün Ekledin.",
                icon: 'success',
                confirmButtonColor: '#228B22',
                confirmButtonText: "Tamam"
            }).then((result) => {
                if (result.isConfirmed) {
                    refreshPage();
                }
            })

        },
    });

 

    return (


        <div>

            <div id="wrapper">

                <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="#">
                        <div class="sidebar-brand-icon rotate-n-15">
                            <i class="fas fa-laugh-wink"></i>
                        </div>
                        <div class="sidebar-brand-text mx-3">FYKHA Admin</div>
                    </a>

                    <hr class="sidebar-divider my-0" />

                    <li class="nav-item active">
                        <a class="nav-link" href="#">
                            <i class="fas fa-fw fa-tachometer-alt"></i>
                            <span>Admin Panel</span></a>
                    </li>

                    <hr class="sidebar-divider" />

                    <div class="sidebar-heading">
                        İşlemler
                    </div>

                    <li class="nav-item">
                        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                            <i class="fas fa-fw fa-cog"></i>
                            <span>Ürün İşlemleri</span>
                        </a>
                        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                            <div class="bg-white py-2 collapse-inner rounded">
                                <h6 class="collapse-header">Ürün İşlemleri</h6>
                                <a style={{ cursor: "pointer" }} class="collapse-item" onClick={() => { setVisible("Urun_Ekle") }}>Ürün Ekle</a>
                                <a style={{ cursor: "pointer" }} class="collapse-item" onClick={() => { setVisible("Guncelle_Modal_Ac") }}>Ürün Kaldır veya Güncelle</a>
                            </div>
                        </div>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">
                            <i class="fas fa-fw fa-wrench"></i>
                            <span>Sipariş İşlemleri</span>
                        </a>
                        <div id="collapseUtilities" class="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
                            <div class="bg-white py-2 collapse-inner rounded">
                                <h6 class="collapse-header">Sipariş İşlemleri:</h6>
                                <a style={{ cursor: "pointer" }} class="collapse-item" onClick={() => { setVisible("Siparis_Guncelle") }}>Sipariş Bekleyen Ürünler</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilitie" aria-expanded="true" aria-controls="collapseUtilities">
                            <i class="fas fa-fw fa-wrench"></i>
                            <span>Kullanıcı İşlemleri</span>
                        </a>
                        <div id="collapseUtilitie" class="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
                            <div class="bg-white py-2 collapse-inner rounded">
                                <h6 class="collapse-header">Kullanıcı İşlemleri:</h6>
                                <a style={{ cursor: "pointer" }} class="collapse-item" onClick={() => { setVisible("Kullanicilari_Listele") }}>Kullanııcları Listele</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilitiem" aria-expanded="true" aria-controls="collapseUtilities">
                            <i class="fas fa-fw fa-wrench"></i>
                            <span>Mesaj İşlemleri</span>
                        </a>
                        <div id="collapseUtilitiem" class="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
                            <div class="bg-white py-2 collapse-inner rounded">
                                <h6 class="collapse-header">Mesaj İşlemleri</h6>
                                <a style={{ cursor: "pointer" }} class="collapse-item" onClick={() => { setVisible("Mesajlari_Listele") }}>Mesajları Listele</a>
                            </div>
                        </div>
                    </li>












                </ul>

                <div id="content-wrapper" class="d-flex flex-column">

                    <div id="content">

                        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                                <i class="fa fa-bars"></i>
                            </button>

                            {/* <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                                <div class="input-group">
                                    <input type="text" class="form-control bg-light border-0 small" placeholder="Ürün ismi veya ürün numarası ile ara" aria-label="Search" aria-describedby="basic-addon2" />
                                    <div class="input-group-append">
                                        <button class="btn btn-primary" type="button">
                                            <i class="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </form> */}

                            <ul class="navbar-nav ml-auto">

                                <li class="nav-item dropdown no-arrow d-sm-none">
                                    <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-search fa-fw"></i>
                                    </a>

                                    <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                                        <form class="form-inline mr-auto w-100 navbar-search">
                                            <div class="input-group">
                                                <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                                                <div class="input-group-append">
                                                    <button class="btn btn-primary" type="button">
                                                        <i class="fas fa-search fa-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </li>

                                <li class="nav-item dropdown no-arrow mx-1">
                                    <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-bell fa-fw"></i>

                                        <span class="badge badge-danger badge-counter">3+</span>
                                    </a>

                                    <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
                                        <h6 class="dropdown-header">
                                            Alerts Center
                                        </h6>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="mr-3">
                                                <div class="icon-circle bg-primary">
                                                    <i class="fas fa-file-alt text-white"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="small text-gray-500">December 12, 2019</div>
                                                <span class="font-weight-bold">A new monthly report is ready to download!</span>
                                            </div>
                                        </a>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="mr-3">
                                                <div class="icon-circle bg-success">
                                                    <i class="fas fa-donate text-white"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="small text-gray-500">December 7, 2019</div>
                                                $290.29 has been deposited into your account!
                                            </div>
                                        </a>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="mr-3">
                                                <div class="icon-circle bg-warning">
                                                    <i class="fas fa-exclamation-triangle text-white"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="small text-gray-500">December 2, 2019</div>
                                                Spending Alert: We've noticed unusually high spending for your account.
                                            </div>
                                        </a>
                                        <a class="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                                    </div>
                                </li>

                                <li class="nav-item dropdown no-arrow mx-1">
                                    <a class="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-envelope fa-fw"></i>

                                        <span class="badge badge-danger badge-counter">7</span>
                                    </a>

                                    <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="messagesDropdown">
                                        <h6 class="dropdown-header">
                                            Message Center
                                        </h6>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="dropdown-list-image mr-3">
                                                <img class="rounded-circle" src="https://source.unsplash.com/fn_BT9fwg_E/60x60" alt="" />
                                                <div class="status-indicator bg-success"></div>
                                            </div>
                                            <div class="font-weight-bold">
                                                <div class="text-truncate">Hi there! I am wondering if you can help me with a problem I've been having.</div>
                                                <div class="small text-gray-500">Emily Fowler · 58m</div>
                                            </div>
                                        </a>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="dropdown-list-image mr-3">
                                                <img class="rounded-circle" src="https://source.unsplash.com/AU4VPcFN4LE/60x60" alt="" />
                                                <div class="status-indicator"></div>
                                            </div>
                                            <div>
                                                <div class="text-truncate">I have the photos that you ordered last month, how would you like them sent to you?</div>
                                                <div class="small text-gray-500">Jae Chun · 1d</div>
                                            </div>
                                        </a>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="dropdown-list-image mr-3">
                                                <img class="rounded-circle" src="https://source.unsplash.com/CS2uCrpNzJY/60x60" alt="" />
                                                <div class="status-indicator bg-warning"></div>
                                            </div>
                                            <div>
                                                <div class="text-truncate">Last month's report looks great, I am very happy with the progress so far, keep up the good work!</div>
                                                <div class="small text-gray-500">Morgan Alvarez · 2d</div>
                                            </div>
                                        </a>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="dropdown-list-image mr-3">
                                                <img class="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60" alt="" />
                                                <div class="status-indicator bg-success"></div>
                                            </div>
                                            <div>
                                                <div class="text-truncate">Am I a good boy? The reason I ask is because someone told me that people say this to all dogs, even if they aren't good...</div>
                                                <div class="small text-gray-500">Chicken the Dog · 2w</div>
                                            </div>
                                        </a>
                                        <a class="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                                    </div>
                                </li>
                                <div class="topbar-divider d-none d-sm-block"></div>

                                <li class="nav-item dropdown no-arrow">
                                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span class="mr-2 d-none d-lg-inline text-gray-600 small">Hi Harjas</span>
                                        <img class="img-profile rounded-circle" src="https://source.unsplash.com/QAB-WJcbgJk/60x60" />
                                    </a>

                                    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                                        <a class="dropdown-item" href="#">
                                            <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Profile
                                        </a>
                                        <a class="dropdown-item" href="#">
                                            <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Settings
                                        </a>
                                        <a class="dropdown-item" href="#">
                                            <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Activity Log
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Logout
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </nav>

                        <div class="container-fluid">

                            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 class="h3 mb-0 text-gray-800">Hoşgeldiniz Bahadır Bey</h1>
                            </div>

                            <div class="row">

                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card border-left-primary shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Toplam Ürün</div>
                                                    <div class="h5 mb-0 font-weight-bold text-gray-800">{UrunSayisi ? UrunSayisi : "Yükleniyor"}</div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-calendar fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card border-left-success shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Toplam Kazanç</div>
                                                    <div class="h5 mb-0 font-weight-bold text-gray-800">{Kazanc ? Kazanc +" TL": "Yükleniyor"} </div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-lira-sign fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card border-left-info shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Onay Bekleyen Ürünler</div>
                                                    <div class="h5 mb-0 font-weight-bold text-gray-800">{OnayBekleyen}</div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card border-left-warning shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Kullanıcı Mesajları</div>
                                                    <div class="h5 mb-0 font-weight-bold text-gray-800">{Mesajlar.length}</div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-comments fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>
                    <Form className={classNames({
                        "mb-4 mb-md-0 Pencere": Visible == "Urun_Ekle",
                        "mb-4 mb-md-0 Gizle": Visible != "Urun_Ekle",
                    })} onSubmit={handleSubmit}>
                        <h1>Bir Ürün Ekleyin</h1>
                        <Form.Group controlId="formGridAddress2">
                            <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Ürün Açıklaması</Form.Label>{touched.urunaciklamasi && errors.urunaciklamasi ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.urunaciklamasi}</label> : null}</div> </div>
                            <Form.Control className={classNames({
                                "mb-3": true,
                                "mb-3 border border-danger": errors.urunaciklamasi && touched.urunaciklamasi
                            })} name='urunaciklamasi' onChange={handleChange} value={values.urunaciklamasi} />
                        </Form.Group>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Ürün Markası</Form.Label>{touched.urunadi && errors.urunadi ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.urunadi}</label> : null}</div> </div>
                                <Select
                                    options={markalar}
                                    onChange={(event) => { setFieldValue("urunadi", event) }}
                                    name="urunadi"
                                    placeholder="Ürün Markası Seçin."
                                    value={values.urunadi}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword">
                                <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Ürün Numarası</Form.Label>{touched.numara && errors.numara ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.numara}</label> : null}</div> </div>
                                <Select
                                    options={numaralar}
                                    onChange={(event) => { setFieldValue("numara", event) }}
                                    name="numara"
                                    placeholder="Numara Seçin."
                                    value={values.numara}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Cinsiyet</Form.Label>{touched.cinsiyet && errors.cinsiyet ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.cinsiyet}</label> : null}</div> </div>
                                <Select
                                    options={cinsiyetler}
                                    onChange={(event) => { setFieldValue("cinsiyet", event) }}
                                    name="cinsiyet"
                                    placeholder="Cinsiyet Seçin."
                                    value={values.cinsiyet}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword">
                                <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Ürün Türü</Form.Label>{touched.urun_turu && errors.urun_turu ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.urun_turu}</label> : null}</div> </div>
                                <Select
                                    options={UrunTurleri}
                                    onChange={(event) => { setFieldValue("urun_turu", event) }}
                                    name="urun_turu"
                                    placeholder="Ürün Türünü Seçin."
                                    value={values.urun_turu}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Cinsiyet</Form.Label>{touched.kargo && errors.kargo ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.kargo}</label> : null}</div> </div>
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
                                        setFieldValue("kargo", event)
                                    }}
                                    name="kargo"
                                    placeholder="Kargo Seçin."
                                    value={values.kargo}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword">
                                <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Kargo Fiyatı</Form.Label>{touched.kargofiyat && errors.kargofiyat ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.kargofiyat}</label> : null}</div> </div>
                                {KargoDurum == true ? <Form.Control onChange={handleChange} value={values.kargofiyat} name='kargofiyat' style={{ height: 59, borderRadius: 10 }} /> : <Form.Control name='kargofiyat' value="Kargo Bedava" style={{ height: 59, borderRadius: 10 }} disabled={true} />}
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                                <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Stok Adeti</Form.Label>{touched.stok && errors.stok ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.stok}</label> : null}</div> </div>
                                <Form.Control name="stok" value={values.stok} onChange={handleChange} style={{ height: 59, borderRadius: 10 }} />
                            </Form.Group>


                            <Form.Group as={Col} controlId="formGridZip">
                                <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Renk</Form.Label>{touched.urun_renk && errors.urun_renk ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.urun_renk}</label> : null}</div> </div>
                                <Select
                                    options={renkler}
                                    onChange={(event) => { setFieldValue("urun_renk", event) }}
                                    name="urun_renk"
                                    placeholder="Renk Seçin."
                                    value={values.urun_renk}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <div className="form-group mt-1" >
                                <div style={{ display: "flex", flexDirection: "row" }}><label>Ürün Resmi</label> {touched.image && errors.image ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 15 }}><label style={{ fontSize: 10, color: "red" }}>{errors.image}</label></div> : null}</div>
                                <input
                                    type="file"
                                    onChange={(event) => { setFieldValue("image", event.target.files[0]) }}
                                    className={classNames({
                                        "form-control mt-1": true,
                                        "form-control mt-1 border border-danger": errors.image && touched.image
                                    })}
                                    name="image"
                                />


                            </div>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>{values.image && <PreviewImage width="250" height="250" file={values.image} />}</div>

                        </Row>

                        <Form.Group controlId="formGridAddress2">
                            <div style={{ display: "flex", flexDirection: "row" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><Form.Label>Ürün Fiyat</Form.Label>{touched.fiyat && errors.fiyat ? <label style={{ fontSize: 10, color: "red", marginLeft: 15 }}>{errors.fiyat}</label> : null}</div> </div>
                            <Form.Control className={classNames({
                                "mb-3": true,
                                "mb-3 border border-danger": errors.urunaciklamasi && touched.urunaciklamasi
                            })} name='fiyat' onChange={handleChange} value={values.fiyat} />
                        </Form.Group>

                        <Button variant="primary" onClick={() => { values.islem = 0 }} type="submit" disabled={disable_form == true ? "true" : ""}>
                            İşlemi Tamamla
                        </Button>
                    </Form>


                 
                     <Product_Table numaralar={numaralar} kargolar={kargolar} UrunTurleri={UrunTurleri} renkler={renkler} cinsiyetler={cinsiyetler} markalar={markalar} Urunler={Urunler} setUrunler={setUrunler} visible={Visible}/>
                     <Order_Table SiparisNo={SiparisNo} setSiparisler={setSiparisler} Siparisler={Siparisler} visible={Visible}/>
                     <User_Table setKullanicilar={setKullanicilar} KullaniciNo={KullaniciNo} Kullanicilar={Kullanicilar} visible={Visible}/>
                     <Message_Table setMesajlar={setMesajlar} Mesajlar={Mesajlar} visible={Visible} />




                    <footer class="sticky-footer bg-white">
                        <div class="container my-auto">
                            <div class="copyright text-center my-auto">
                                <span>Copyright &copy; FYKHA Admin Paneli 2023</span>
                            </div>
                        </div>
                    </footer>

                </div>

            </div>


            <a class="scroll-to-top rounded" href="#page-top">
                <i class="fas fa-angle-up"></i>
            </a>

            <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <a class="btn btn-primary" data-dismiss="modal" href="#">Logout</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Admin;