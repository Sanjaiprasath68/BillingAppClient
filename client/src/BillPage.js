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
    <!DOCTYPE html>
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Print Bill</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <style>
    @media print {
      body {
        width: 3in;
        margin: 0;
        padding: 0;
        font-size: 0.75em; /* Scale down font size for small paper */
        font-family: 'Arial', sans-serif; /* Ensure consistent font */
      }
      .no-print {
        display: none;
      }
    }
    .logo {
      max-width: 2.5in; /* Adjusted to fit 3-inch width */
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    h3 {
      text-align: center;
      margin-top: -10px;
      font-weight: 600; /* Semi-bold font weight */
    }
    h6 {
      text-align: center;
      margin-bottom: 0; /* Removes default margin at the bottom */
    }
    .seal-space {
      height: 0.5in;
    }
    .footer {
      text-align: center;
      margin-top: 0.5in;
      font-size: 0.75em;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.6em; /* Adjust font size for small paper */
    }
    th, td {
      padding: 0.05in; /* Reduced padding to fit content */
      text-align: center;
    }
    th {
      background-color: #f8f9fa;
      font-weight: 600; /* Semi-bold font weight */
    }
    .table-bordered th, .table-bordered td {
      border: 1px solid black;
    }
    #amt {
      font-weight: 800; /* Bold font weight for total amount */
    }
    @media print {
      table {
        font-size: 0.6em; /* Further reduce font size if needed */
      }
      th, td {
        padding: 0.05in; /* Reduce padding to fit content */
      }
    }
  </style>
</head>
<body>
  <div class="container mt-2">
    <img src="${logoUrl}" alt="Logo" class="logo"/>
    <h3>குமரன் பவன்</h3>
    <h6>15/15, தாழையாத்தம் பஜார்,<br>(சௌத் இண்டியன் பேங்க் எதிரில்) குடியாத்தம்.</h6>
    <h3 class="mt-2">Bill Amount</h3>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Ser No.</th>
          <th>Product</th>
          <th>Price</th>
          <th>Total (Unit)</th>
          <th>Qty</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${bill.selectedProducts.map((product, productIndex) => `
          <tr>
            <td>${productIndex + 1}</td>
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>${product.total.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>${(product.total * product.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
        <tr>
          <td colspan="5" class="text-end fw-bold">Total Amount:</td>
          <td id="amt">${bill.totalAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
    <p><strong>Date and Time:</strong> ${createdAt}</p>
    <div class="seal-space"></div>
    <div class="footer">
      ***Thank You***
    </div>
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
