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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? new Date().toLocaleString() 
      : date.toLocaleString();
  };

  const handlePrint = (bill, index) => {
    const logoUrl = logo; // Use the imported logo image// Replace with your logo URL

    const printWindow = window.open('', '', 'height=600,width=800');
    const printContent = `
      <html>
      <head>
        <title>Print Bill</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
          @media print {
            .no-print {
              display: none;
            }
          }
          .logo {
            max-width: 300px;
            display: block;
            margin-left: auto;
            margin-right: auto;
            margin-top:-45px;
          }
          h3{
            text-align: center;
            margin-top:-25px;
          }
        </style>
      </head>
      <body>
        <div class="container mt-5">
          <img src="${logoUrl}" alt="Logo" class="logo"/>
          <h3>Store Name</h3>
          <p><strong>Serial No:</strong> ${index + 1}</p>
          <p><strong>Customer Name:</strong> ${bill.customerName}</p>
          <p><strong>Contact Number:</strong> ${bill.contactNumber}</p>
          <p><strong>Date and Time:</strong> ${formatDateTime(bill.date)}</p>
          <h2 class="mt-4">Selected Products</h2>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Serial No.</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>GST Amount</th>
                <th>Total (per unit)</th>
                <th>Quantity</th>
                <th>Total for this Product</th>
              </tr>
            </thead>
            <tbody>
              ${bill.selectedProducts.map((product, productIndex) => `
                <tr>
                  <td>${productIndex + 1}</td>
                  <td>${product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>${product.gst.toFixed(2)}</td>
                  <td>${product.total.toFixed(2)}</td>
                  <td>${product.quantity}</td>
                  <td>${(product.total * product.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="6" class="text-end fw-bold">Total Amount:</td>
                <td>${bill.totalAmount.toFixed(2)}</td>
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
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = bills.filter(bill => {
      return bill.customerName.toLowerCase().includes(searchTerm) || formatDateTime(bill.date).includes(searchTerm);
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
            <h2 style={{ color: "white", marginBottom: '15px' }}>Customers Details</h2>
            <Form.Group controlId="search" className="mb-4">
              <Form.Control
                type="text"
                placeholder="Search by customer name or date"
                value={searchTerm}
                onChange={handleSearch}
              />
            </Form.Group>
            {filteredBills.length > 0 ? (
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Serial No.</th>
                    <th>Date</th>
                    <th>Customer Name</th>
                    <th>Contact Number</th>
                    <th>Total Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill, index) => (
                    <tr key={bill._id}>
                      <td>{index + 1}</td>
                      <td>{formatDateTime(bill.date)}</td>
                      <td>{bill.customerName}</td>
                      <td>{bill.contactNumber}</td>
                      <td>${bill.totalAmount.toFixed(2)}</td>
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
