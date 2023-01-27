import React from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

export default function App() {
  return (
    <MDBTable align='middle'>
      <MDBTableHead>
        <tr>
          <th scope='col'>Sipariş Tarihi</th>
          <th scope='col'>Sipariş Özeti</th>
          <th scope='col'>Alıcı</th>
          <th scope='col'>Tutar</th>
          <th scope='col'>Detay</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>
            <div className='d-flex align-items-center'>
             
              <div className='ms-3'>
                <p className='fw-bold mb-1'>27.01.2023</p>
              </div>
            </div>
          </td>
          <td>
            <p className='fw-normal mb-1'>2 Ürün</p>
          </td>
          <td>
             Bahadır Özdemir
          </td>
          <td>1290 TL</td>
          <td>
            <MDBBtn color='link' rounded size='sm'>
              Detaylar
            </MDBBtn>
          </td>
        </tr>
        
        
       
      </MDBTableBody>
    </MDBTable>
  );
}