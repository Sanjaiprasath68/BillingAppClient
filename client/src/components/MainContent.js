import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainContent.css';
import { Modal, Button } from 'react-bootstrap';
import logo from './logoUrl.png'; // Ensure this path matches the actual location of your logo

const MainContent = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    axios.get('https://online-billing-app.vercel.app/items')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product) => {
    if (!selectedProducts.some(p => p._id === product._id)) {
      setSelectedProducts(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveClick = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p._id !== productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setSelectedProducts(prev => prev.map(p =>
      p._id === productId ? { ...p, quantity: Math.max(newQuantity, 1) } : p
    ));
  };

  const totalAmount = selectedProducts.reduce((sum, product) =>
    sum + (product.total * product.quantity), 0
  ).toFixed(2);

  const handleCreateBill = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleGenerateBill = () => {
    const serialNumber = new Date().getTime(); // Generating a unique serial number based on timestamp
    const currentDateTime = new Date().toLocaleString(); // Current date and time
    
    const billData = {
      customerName,
      contactNumber,
      selectedProducts,
      totalAmount,
      serialNumber,
      dateTime: currentDateTime,
      printDetails: generatePrintContent({ customerName, contactNumber, selectedProducts, totalAmount, serialNumber, dateTime: currentDateTime })
    };
    console.log('Bill Data:', billData); // Log the bill data

    axios.post('https://online-billing-app.vercel.app/bills', billData)
      .then(response => {
        console.log('Bill stored successfully:', response.data);
        handlePrint(billData);
      })
      .catch(error => console.error('Error storing bill:', error));

    setShowModal(false);
  };

  const generatePrintContent = (billData) => {
    return `
      <html>
      <head>
        <title>Print</title>
        <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
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
        <div class="container">
          <img src="${logo}" alt="Logo" class="logo"/> <!-- Use the imported logo -->
          <h3>Store Name</h3>
          <p><strong>Serial Number:</strong> ${billData.serialNumber}</p>
          <p><strong>Date and Time:</strong> ${billData.dateTime}</p>
          <p><strong>Customer Name:</strong> ${billData.customerName}</p>
          <p><strong>Contact Number:</strong> ${billData.contactNumber}</p>
          <h2>Selected Products</h2>
          <table class="table table-dark table-striped">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>GST Amount</th>
                <th>Total (per unit)</th>
                <th>Quantity</th>
                <th>Total for this Product</th>
              </tr>
            </thead>
            <tbody>
              ${billData.selectedProducts.map((product, index) => `
                <tr>
                  <td>${index + 1}</td>
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
                <td>${billData.totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = (billData) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const printContent = generatePrintContent(billData);

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="main bg-dark text-light p-3">
      <div className="container">
        <div className="search-bar-container mb-3">
          <div className="input-group mt-5">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search for a product..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ maxWidth: '600px', width: '100%' }}
            />
          </div>
        </div>

        <div className="product-list mb-3">
          {filteredProducts.length > 0 ? (
            <ul className="list-group">
              {filteredProducts.map((product) => (
                <li
                  key={product._id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleProductClick(product)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No products found. Please try a different search.</p>
          )}
        </div>

        <div className="selected-products">
          <h5>Selected Products</h5>
          {selectedProducts.length > 0 ? (
            <>
              <table className="table table-dark table-striped mb-3">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>GST Amount</th>
                    <th>Total (per unit)</th>
                    <th>Quantity</th>
                    <th>Total for this Product</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map(product => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>${product.gst.toFixed(2)}</td>
                      <td>${product.total.toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleQuantityChange(product._id, Math.max(1, product.quantity - 1))}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="form-control form-control-sm mx-2"
                            value={product.quantity}
                            min="1"
                            onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value) || 1)}
                          />
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>${(product.total * product.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveClick(product._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="6" className="text-end fw-bold">Total Amount:</td>
                    <td>${totalAmount}</td>
                  </tr>
                </tbody>
              </table>
              <button className="btn btn-primary" onClick={handleCreateBill}>Create Bill</button>
            </>
          ) : (
            <p>No products selected.</p>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="customerName" className="form-label">Customer Name</label>
            <input
              type="text"
              className="form-control"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
            <input
              type="text"
              className="form-control"
              id="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
          <Button variant="primary" onClick={handleGenerateBill}>Generate Bill</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MainContent;
