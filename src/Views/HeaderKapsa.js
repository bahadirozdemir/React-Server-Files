import { Outlet } from "react-router-dom"; 
import Header from '../Views/Header'
import Footer from '../Views/Footer'
const HeaderKapsa = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default HeaderKapsa;