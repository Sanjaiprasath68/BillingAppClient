import React from 'react';
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark mb-4 mt-2  d-flex justify-content-between custom-navbar">
      {/* <div style={{ marginLeft: 20 }}>
        <FontAwesomeIcon icon={faBars} onClick={toggleSidebar} style={{ cursor: 'pointer', color:'white'}} />
      </div> */}
      <div >
        <FontAwesomeIcon icon={faCartShopping} className='trallyicon'/>
      </div>
    </nav>
  );
};

export default Navbar;
