import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Container, Form } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BillPage.css';
import logo from './logoUrl.png'; // Import the logo image

const BillPage = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://online-billing-app.vercel.app/bills')
      .then(response => {
        console.log('Fetched bills:', response.data); // Log fetched data
        setBills(response.data);
        setFilteredBills(response.data);
      })
      .catch(error => console.error('Error fetching bills:', error));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };


  const handlePrint = (bill, index) => {
    const logoUrl = logo; // Use the imported logo image
    const createdAt = new Date(bill.createdAt).toLocaleString(); // Ensure correct formatting


    // const createdAt = formatDate(bill.createdAt); // Format date
    console.log('Bill Date:', bill.createdAt); // Log raw date for debugging

    const printWindow = window.open('', '', 'height=600,width=800');
    const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Print Bill</title>
    </head>
   <style>
   td, th {
    text-align: center;
    padding: 6px; /* Add padding to create space between cells */
}
   h3, h6{
    text-align: center;
   }
   #amt {
    margin-top: 30px;
}
   </style>
    <body>
      <div>
          <h3>குமரன் பவன்</h3>
          <h6>15/15, தாழையாத்தம் பஜார்,<br>(சௌத் இண்டியன் பேங்க் எதிரில்) குடியாத்தம்.</h6>
          <h3>Bill Amount</h3>
          <table>
          <thead>
              <tr>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Price</th>
                  
                  <th>Qty</th>
                  <th>Total</th>
              </tr>
          </thead>
          <tbody>
              ${bill.selectedProducts.map((product, index) => `
                  <tr>
                      <td>${index + 1}</td>
                      <td>${product.name}</td>
                      <td>${product.price.toFixed(2)}</td>
                      
                      <td>${product.quantity}</td>
                      <td>${(product.total * product.quantity).toFixed(2)}</td>
                  </tr>
              `).join('')}
              <tr>
                  <td colspan="2">Total:</td>
                  <td><b>${bill.totalAmount}</b></td>
              </tr>
          </tbody>
      </table>
      
      </div>
    </body>
    </html>
    
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    printWindow.onload = () => {
      const printDocument = printWindow.document;
      const pTags = printDocument.querySelectorAll('p'); // Select all <p> tags
      pTags.forEach((pTag, index) => {
        console.log(`Paragraph ${index + 1}:`, pTag.textContent); // Log the text content of each <p> tag
      });
      printWindow.print();
    };


  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = bills.filter(bill => {
      return bill.customerName.toLowerCase().includes(searchTerm);
    });
    setFilteredBills(filtered);
  };

  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="d-flex">
      <Sidebar showSidebar={showSidebar} />
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: showSidebar ? '250px' : '0', transition: 'margin-left 0.3s ease' }}>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="flex-grow-1 bg-dark billdetails">
          <Container className="mt-4">
            <h2 style={{ color: "white", marginBottom: '15px' }}>Customer Details</h2>
            <Form.Group controlId="search" className="mb-4">
              <Form.Control
                type="text"
                placeholder="Search by customer name"
                value={searchTerm}
                onChange={handleSearch}
              />
            </Form.Group>
            {filteredBills.length > 0 ? (
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Serial No.</th>
                    {/* <th>Customer Name</th>
                    <th>Contact Number</th> */}
                    <th>Total Amount</th>
                    <th>Date and Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill, index) => (
                    <tr key={bill._id}>
                      <td>{index + 1}</td>
                      {/* <td>{bill.customerName}</td>
                      <td>{bill.contactNumber}</td> */}
                      <td>${bill.totalAmount.toFixed(2)}</td>
                      <td>{formatDate(bill.createdAt)}</td> {/* Display date and time */}
                      <td>
                        <Button
                          variant="info"
                          onClick={() => handlePrint(bill, index)}
                          className="btn-sm"
                        >
                          <i className="bi bi-eye"></i> View & Print
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No bills found.</p>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default BillPage;
