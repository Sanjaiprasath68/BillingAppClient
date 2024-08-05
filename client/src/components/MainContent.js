import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainContent.css';
import { Button } from 'react-bootstrap';
import logo from './logoUrl.png'; // Ensure this path matches the actual location of your logo

const MainContent = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

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
    // Default customer details
    const customerName = 'Default Customer';
    const contactNumber = '1234567890';
    const createdAt = new Date(); // Current date and time
    
    const billData = {
      customerName,
      contactNumber,
      selectedProducts,
      totalAmount,
      createdAt, // Adding created date and time
      printDetails: generatePrintContent({
        customerName,
        contactNumber,
        selectedProducts,
        totalAmount,
        createdAt
      })
    };

    console.log('Bill Data:', billData); // Log the bill data for debugging

    axios.post('https://online-billing-app.vercel.app/bills', billData)
      .then(response => {
        console.log('Bill stored successfully:', response.data);
        handlePrint(billData);
      })
      .catch(error => {
        console.error('Error storing bill:', error.response ? error.response.data : error.message);
      });
  };

  const generatePrintContent = (billData) => {
    const date = new Date(billData.createdAt).toLocaleString();

    return `
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
              ${billData.selectedProducts.map((product, index) => `
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
                  <td><b>${billData.totalAmount}</b></td>
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
            <p>No products selected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
