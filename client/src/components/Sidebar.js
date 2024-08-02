import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaHome, FaMoneyBill, FaBox, FaUser } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css'; // Import the custom CSS

const Sidebar = ({ showSidebar }) => {
  return (
    <div
      className={`bg-dark mt-2  text-white p-4 sidebar ${showSidebar ? 'show' : 'hide '} custom-sidebar`}
      style={{marginLeft:"8px" ,width: '250px', minHeight: '98vh', position: 'fixed', top: 0, left: 0, transition: 'transform 0.3s ease' }}
    >
      <a href='/' style={{textDecoration:"none",color: "white"}}><h4 className="mb-5">Dashboard</h4></a>
      <Nav className="flex-column">
        <Nav.Link href="/home" className="text-white mb-2 mt-3 ">
          <FaHome className="mr-2" /> Home
        </Nav.Link>
        <Nav.Link href="/billpage" className="text-white mb-2">
          <FaMoneyBill className="mr-2" /> BillList
        </Nav.Link>
        <Nav.Link href="/items" className="text-white mb-2">
          <FaBox className="mr-2" /> Items
        </Nav.Link>
        
        <Nav.Link href="/" className="text-white">
          <FaUser className="mr-2" /> Logout
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
