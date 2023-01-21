import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {AuthProvider} from '../src/Context/AuthProvider'
import RouteContoller from './Routes/RouteContoller';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <BrowserRouter>
    <AuthProvider>
     <RouteContoller/>
    </AuthProvider>
    </BrowserRouter>
 
);

 
