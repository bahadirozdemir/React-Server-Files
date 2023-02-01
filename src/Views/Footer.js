function Footer() {
    return (
        <div className="footer-container">
            <footer className="footer">
                <div className="container">
                <div className="row">
                        <div className="col-md-6 col-lg-4 col-sm-6 mb-5 mb-lg-0 text-center text-sm-left mr-auto">
                        <div className="footer-widget">
                                <h4 className="mb-4">FYKHA</h4>
                                <p className="lead">Bir Dünya Markası.</p>
                                
                                <div className="">
                                    <p className="mb-0"><strong>Konum : </strong>Türkiye,Küçükçekmece</p>
                                    <p><strong>Destek Adresi : </strong> FYHKA@info.com</p>
                                </div>
                        </div>
                        </div>
            
                        <div className="col-md-6 col-lg-2 col-sm-6 mb-5 mb-lg-0 text-center text-sm-left">
                            <div className="footer-widget">
                            <h4 className="mb-4">Kategoriler</h4>
                            <ul className="pl-0 list-unstyled mb-0">
                            <li><a href="#">Erkek Modası</a></li>
                            <li><a href="#">Kadın Modası</a></li>
                            <li><a href="#">Çocuk Modası</a></li>
                            </ul>
                        </div>
                        </div>
            
                        <div className="col-md-6 col-lg-2 col-sm-6 mb-5 mb-lg-0 text-center text-sm-left">
                            <div className="footer-widget">
                            <h4 className="mb-4">Hakkımızda</h4>
                            <ul className="pl-0 list-unstyled mb-0">
                            <li><a href="#">Biz Kimiz?</a></li>
                            <li><a href="#">İletişim</a></li>
                            </ul>
                                </div>
                        </div>
            
                        <div className="col-md-6 col-lg-3 col-sm-6 text-center text-sm-left">
                            <div className="footer-widget">
                            <h4 className="mb-4">Çalışma Saatlerimiz</h4>
                            <ul className="pl-0 list-unstyled mb-5">
                            <li className="d-lg-flex justify-content-between">Pazartesi-Cuma <span>09.00-18.00</span></li>
                            <li className="d-lg-flex justify-content-between">Cumartesi <span>Kapalı</span></li>
                            <li className="d-lg-flex justify-content-between">Pazar <span>Kapalı</span></li>
                            </ul>
            
                            <h5>Şimdi Arayın : (212) 555-67-58</h5>
                        </div>
                        </div>
                    </div>
                </div>
            </footer>
            
            
            <div className="footer-btm py-4 ">
                <div className="container">
                <div className="row ">
                        <div className="col-lg-6">
                            <p className="copyright mb-0 ">@ Tüm Hakları Saklıdır <a href="">FYKHA LİMİTED A.Ş</a></p>
                        </div>
                        <div className="col-lg-6">
                            <ul className="list-inline mb-0 footer-btm-links text-lg-right mt-2 mt-lg-0">
                            <li className="list-inline-item"><a href="#">Gizlilik Politikası</a></li>
                            <li className="list-inline-item"><a href="#">Şartlar &amp; Koşullar</a></li>
                            <li className="list-inline-item"><a href="#">Çerez Politikası</a></li>
                            <li className="list-inline-item"><a href="#">Satış Şartları</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   );
}
export default Footer;