import { useState, useEffect } from 'react';
import React, { useRef } from 'react';

const SupermarketBillingApp = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const productNameRef = useRef(null);
  const productPriceRef = useRef(null);
  const productQuantityRef = useRef(null);
  const addButtonRef = useRef(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (productName && !isNaN(parseFloat(productPrice)) && productPrice > 0 && productQuantity > 0) {
      const price = parseFloat(productPrice);
      const quantity = parseInt(productQuantity);
      const itemTotal = price * quantity;
      const gst = itemTotal * 0.05;
      const totalPrice = itemTotal + gst;
      
      const newProduct = {
        id: products.length + 1,
        name: productName,
        price: price,
        quantity: quantity,
        itemTotal: itemTotal.toFixed(2),
        gst: gst.toFixed(2),
        totalPrice: totalPrice.toFixed(2)
      };
      
      setProducts([...products, newProduct]);
      
      setProductName('');
      setProductPrice('');
      setProductQuantity(1);
  
  // Focus back on the first field - with null check
      if (productNameRef && productNameRef.current) {
      productNameRef.current.focus();
      }

      setTimeout(() => {
        if (productNameRef && productNameRef.current) {
          productNameRef.current.focus();
        }
      }, 0);

    }
  };

  

  const handlePayment = async () => {
    const res = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: calculateTotal() * 100 }) // in paise
    });
  
    const data = await res.json();
  
    const options = {
      key: "razorpay_api_key", // Replace with your Razorpay key
      amount: data.amount,
      currency: "INR",
      name: "Fresh Mart Supermarket",
      description: "Billing Payment",
      order_id: data.id,
      handler: function (response) {
        alert("Payment successful!");
        console.log(response);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9731497896"
      },
      theme: { color: "#6366F1" }
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  
  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextFieldRef.current.focus();
    }
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const calculateTotal = () => {
    return products.reduce((sum, product) => sum + parseFloat(product.totalPrice), 0).toFixed(2);
  };

  const calculateSubtotal = () => {
    return products.reduce((sum, product) => sum + parseFloat(product.itemTotal), 0).toFixed(2);
  };

  const calculateTotalGST = () => {
    return products.reduce((sum, product) => sum + parseFloat(product.gst), 0).toFixed(2);
  };

  const calculateTotalItems = () => {
    return products.reduce((sum, product) => sum + product.quantity, 0);
  };

  const calculateTotalProducts = () => {
    return products.length;
  };


  const printInvoice = () => {
    const invoiceContent = document.getElementById('invoiceContent').innerHTML;
    
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Supermarket Invoice</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; color: #333; }
      .invoice-header { text-align: center; margin-bottom: 20px; }
      .company-name { font-size: 24px; font-weight: bold; color: #2c3e50; margin: 0; }
      .invoice-title { font-size: 18px; color: #7f8c8d; margin: 5px 0; }
      .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
      .invoice-details div { font-size: 14px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th { background-color: #f8f9fa; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
      td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
      .total-section { text-align: right; margin-top: 20px; }
      .thank-you { text-align: center; margin-top: 30px; font-style: italic; color: #7f8c8d; }
      .gst-info { margin: 20px 0; font-size: 12px; color: #7f8c8d; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(invoiceContent);
    printWindow.document.write('<div class="thank-you">Thank you for shopping with us!</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    printWindow.print();
    printWindow.close();
  };

  const downloadInvoice = () => {
    // Create styled content for the invoice
    const invoiceNumber = `SM-${Math.floor(Math.random() * 10000)}`;
    const currentDateTime = new Date().toLocaleString();
    
    // Create HTML content for download
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Supermarket Invoice #${invoiceNumber}</title>
          <style>
              body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
              .invoice-header { text-align: center; margin-bottom: 20px; }
              .company-name { font-size: 24px; font-weight: bold; color: #2c3e50; margin: 0; }
              .invoice-title { font-size: 18px; color: #7f8c8d; margin: 5px 0; }
              .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .invoice-details div { font-size: 14px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th { background-color: #f8f9fa; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
              td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              .total-section { text-align: right; margin-top: 20px; }
              .thank-you { text-align: center; margin-top: 30px; font-style: italic; color: #7f8c8d; }
              .right-align { text-align: right; }
              .center-align { text-align: center; }
          </style>
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
          <div class="invoice-header">
              <h1 class="company-name">FRESH MART SUPERMARKET</h1>
              <p class="invoice-title">Tax Invoice</p>
          </div>
          
          <div class="invoice-details">
              <div>
                  <div><strong>Invoice #:</strong> ${invoiceNumber}</div>
                  <div><strong>Date:</strong> ${currentDate}</div>
                  <div><strong>Time:</strong> ${currentTime}</div>
              </div>
              <div style="text-align: right;">
                  <div><strong>Fresh Mart Supermarket Ltd.</strong></div>
                  <div>123 Market Street</div>
                  <div>Cityville, State 12345</div>
                  <div>Tel: (123) 456-7890</div>
                  <div>GSTIN: 22AAAAA0000A1Z5</div>
              </div>
          </div>
          
          <table>
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Item Description</th>
                      <th class="right-align">Price</th>
                      <th class="center-align">Qty</th>
                      <th class="right-align">Amount</th>
                      <th class="right-align">GST (5%)</th>
                      <th class="right-align">Total</th>
                  </tr>
              </thead>
              <tbody>
    `;
    
    // Add all products to the table
    products.forEach((product, index) => {
      htmlContent += `
        <tr>
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td class="right-align">₹ ${product.price.toFixed(2)}</td>
            <td class="center-align">${product.quantity}</td>
            <td class="right-align">₹ ${product.itemTotal}</td>
            <td class="right-align">₹ ${product.gst}</td>
            <td class="right-align">₹ ${product.totalPrice}</td>
        </tr>
      `;
    });
    
    // Add summary and footer
    htmlContent += `
              </tbody>
          </table>
          
          <div class="total-section">
              <div style="display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 10px;">
                  <div><strong>Subtotal:</strong></div>
                  <div>₹ ${calculateSubtotal()}</div>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 5px;">
                  <div><strong>GST (5%):</strong></div>
                  <div>₹ ${calculateTotalGST()}</div>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #ddd; font-size: 18px; font-weight: bold;">
                  <div>Total:</div>
                  <div>₹ ${calculateTotal()}</div>
              </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
              <div>Payment Method: Cash</div>
              <div style="margin-top: 10px;">* This is a computer-generated invoice and does not require a physical signature.</div>
              <div class="thank-you">Thank you for shopping with Fresh Mart!</div>
          </div>
      </body>
      </html>
    `;
    
    // Create a Blob containing the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a download link for the blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supermarket-invoice-${invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100'} min-h-screen transition-all duration-300`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gradient-to-r from-emerald-800 to-green-900' : 'bg-gradient-to-r from-emerald-500 to-green-600'} text-white p-4 shadow-lg transition-all duration-300`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
          <div className="p-2 bg-white bg-opacity-20 rounded-full shadow-inner mr-3 backdrop-blur-sm">
            <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div>
              <h1 className="text-2xl font-bold tracking-tight">Supermarket Billing System</h1>
              <p className="text-xs text-green-50 opacity-80">Professional retail solution</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`text-sm text-right ${isDarkMode ? 'text-green-200' : 'text-white'}`}>
              <div className="font-semibold">{currentDate}</div>
              <div className="opacity-80">{currentTime}</div>
            </div>
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-full ${isDarkMode ? 'bg-green-700 text-white' : 'bg-white bg-opacity-20 text-white'} hover:bg-opacity-30 transition-colors`}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product Form */}
          <div className="md:col-span-1">
            <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-all duration-300`}>
            <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-emerald-50'} border-b ${isDarkMode ? 'border-gray-700' : 'border-emerald-100'} px-6 py-4`}>
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                  <svg className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Add Product
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label htmlFor="productName" className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 text-sm font-medium`}>Product Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                    </div>
                    <input
                    ref={productNameRef}
                    type="text"
                    className={`w-full pl-10 px-4 py-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200`}
                    id="productName"
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, productPriceRef)}
                    autoFocus
                  />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="productPrice" className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 text-sm font-medium`}>Price (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <input
                    ref={productPriceRef}
                    type="number"
                    step="0.01"
                    className={`w-full pl-10 px-4 py-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200`}
                    id="productPrice"
                    placeholder="Enter price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, productQuantityRef)}
                  />
                  </div>
                </div>
                <div className="mb-5">
                  <label htmlFor="productQuantity" className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 text-sm font-medium`}>Quantity</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                      </svg>
                    </div>
                    <input
                    ref={productQuantityRef}
                    type="number"
                    min="1"
                    className={`w-full pl-10 px-4 py-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200`}
                    id="productQuantity"
                    placeholder="Enter quantity"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, addButtonRef)}
                  />
                  </div>
                </div>
                <button 
                ref={addButtonRef}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add to Bill
              </button>
              </div>

              {/* Summary Card */}
<div className={`mx-6 mb-6 ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-emerald-50'} p-5 rounded-lg transition-all duration-300`}>
  <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3 flex items-center`}>
    <svg className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
    </svg>
    Bill Summary
  </h3>
  <div className={`flex justify-between mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    <span>Total Products:</span>
    <span className="font-medium">{calculateTotalProducts()}</span>
  </div>
  <div className={`flex justify-between mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    <span>Total Items:</span>
    <span className="font-medium">{calculateTotalItems()}</span>
  </div>
  <div className={`flex justify-between mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    <span>Total Amount:</span>
    <span className="font-medium">₹ {calculateTotal()}</span>
  </div>
  <div className={`flex justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    <span>GST Included:</span>
    <span className="font-medium">5%</span>
  </div>
</div>

{/* Action Buttons - Aligned with Summary Card */}
<div className={`mx-6 mb-6 flex justify-between`}>
  <div className="flex items-center space-x-4">
    <button
      className={`flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800' 
          : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
      } text-white px-7 py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg font-medium`}
      onClick={handlePayment}
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 7h18M3 10h18M5 14h2M9 14h2M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
        />
      </svg>
      Pay Online
    </button>

    <button
      className={`flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800' 
          : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
      } text-white px-7 py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg font-medium disabled:opacity-60 disabled:pointer-events-none`}
      onClick={() => setShowInvoice(true)}
      disabled={products.length === 0}
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Generate Invoice
    </button>
  </div>
</div>

            </div>
          </div>
          
          {/* Product Table */}
          <div className="md:col-span-2">
          <div className={`${isDarkMode ? 'bg-gray-800 shadow-lg shadow-gray-900/20' : 'bg-white shadow-md'} rounded-lg overflow-hidden transition-all duration-300`}>
          <div className={`p-6 ${isDarkMode ? 'border-b border-gray-700' : 'border-b'} flex justify-between items-center`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Current Bill</h2>
          <button
           className={`flex items-center ${
          isDarkMode 
            ? 'bg-red-700 hover:bg-red-800' 
            : 'bg-red-600 hover:bg-red-700'
        } text-white px-4 py-2 rounded-full shadow-md transition duration-200 ease-in-out disabled:opacity-50`}
        onClick={() => setProducts([])}
        disabled={products.length === 0}
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 6h18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
        </svg>
        Clear All
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>#</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Product</th>
            <th className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Price</th>
            <th className={`px-6 py-3 text-center text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Qty</th>
            <th className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Amount</th>
            <th className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>GST (5%)</th>
            <th className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Total</th>
            <th className={`px-6 py-3 text-center text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Action</th>
          </tr>
        </thead>
        <tbody className={`${isDarkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
          {products.map((product) => (
            <tr key={product.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.id}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{product.name}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-right`}>₹ {product.price.toFixed(2)}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>{product.quantity}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-right`}>₹ {product.itemTotal}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-right`}>₹ {product.gst}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} text-right`}>₹ {product.totalPrice}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  className={isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}
                  onClick={() => deleteProduct(product.id)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="8" className={`px-6 py-10 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No products added yet. Add a product to start your bill.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    
    {products.length > 0 && (
      <div className={`px-6 py-4 ${isDarkMode ? 'bg-gray-700 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
        <div className="flex justify-end">
          <div className="text-right">
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Products: {calculateTotalProducts()}</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Items: {calculateTotalItems()}</div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mt-1`}>Total: ₹ {calculateTotal()}</div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
          </div>
        </div>
      
      {/* Invoice Modal */}
      {showInvoice && (
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg w-4/5 max-w-4xl max-h-screen overflow-y-auto shadow-xl transition-all duration-300`}>
      <div className={`flex justify-between items-center p-6 ${isDarkMode ? 'border-b border-gray-700' : 'border-b'}`}>
        <h5 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Invoice</h5>
        <button 
          type="button" 
          className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-500'} transition-colors`} 
          onClick={() => setShowInvoice(false)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-6">
        <div id="invoiceContent" className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          <div className="invoice-header">
            <h1 className={`company-name text-2xl font-bold text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>FRESH MART SUPERMARKET</h1>
            <p className={`invoice-title text-center text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Tax Invoice</p>
          </div>
          
          <div className="invoice-details flex justify-between mb-6">
            <div>
              <div className="font-semibold">Invoice #: SM-{Math.floor(Math.random() * 10000)}</div>
              <div>Date: {currentDate}</div>
              <div>Time: {currentTime}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold mb-2">Fresh Mart Supermarket Ltd.</div>
              <div>123 Market Street</div>
              <div>Cityville, State 12345</div>
              <div>Tel: (123) 456-7890</div>
              <div>GSTIN: 22AAAAA0000A1Z5</div>
            </div>
          </div>
          
          <table className="w-full">
            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <tr>
                <th className={`text-left p-2 ${isDarkMode ? 'border-y-2 border-gray-600' : 'border-y-2 border-gray-300'}`}>#</th>
                <th className={`text-left p-2 ${isDarkMode ? 'border-y-2 border-gray-600' : 'border-y-2 border-gray-300'}`}>Item Description</th>
                <th className={`text-right p-2 ${isDarkMode ? 'border-y-2 border-gray-600' : 'border-y-2 border-gray-300'}`}>Unit Price</th>
                <th className={`text-center p-2 ${isDarkMode ? 'border-y-2 border-gray-600' : 'border-y-2 border-gray-300'}`}>Qty</th>
                <th className={`text-right p-2 ${isDarkMode ? 'border-y-2 border-gray-600' : 'border-y-2 border-gray-300'}`}>Amount</th>
                <th className={`text-right p-2 ${isDarkMode ? 'border-y-2 border-gray-600' : 'border-y-2 border-gray-300'}`}>GST (5%)</th>
                <th className={`text-right p-2 ${isDarkMode ? 'border-y-2 border-gray-600' : 'border-y-2 border-gray-300'}`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className={`${isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2 text-right">₹ {product.price.toFixed(2)}</td>
                  <td className="p-2 text-center">{product.quantity}</td>
                  <td className="p-2 text-right">₹ {product.itemTotal}</td>
                  <td className="p-2 text-right">₹ {product.gst}</td>
                  <td className="p-2 text-right">₹ {product.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-6 text-right">
            <div className={`flex justify-between ${isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'} pt-2`}>
              <div className="font-medium">Subtotal:</div>
              <div>₹ {calculateSubtotal()}</div>
            </div>
            <div className="flex justify-between pt-1">
              <div className="font-medium">GST (5%):</div>
              <div>₹ {calculateTotalGST()}</div>
            </div>
            <div className={`flex justify-between pt-2 ${isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'} text-xl font-bold`}>
              <div>Total:</div>
              <div>₹ {calculateTotal()}</div>
            </div>
          </div>
          
          <div className={`mt-8 pt-4 ${isDarkMode ? 'border-t border-gray-700 text-sm text-gray-400' : 'border-t border-gray-200 text-sm text-gray-600'}`}>
            <div>Payment Method: Cash</div>
            <div className="mt-2">* This is a computer-generated invoice and does not require a physical signature.</div>
            <div className={`mt-4 text-center font-medium ${isDarkMode ? 'text-gray-300' : ''}`}>Thank you for shopping with Fresh Mart!</div>
          </div>
        </div>
      </div>
      <div className={`flex justify-end p-6 ${isDarkMode ? 'border-t border-gray-700' : 'border-t'}`}>
        <button 
          className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-2 rounded mr-2 transition-colors`}
          onClick={() => setShowInvoice(false)}
        >
          Close
        </button>
        <button 
          className={`${
            isDarkMode 
              ? 'bg-green-700 hover:bg-green-600' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white px-6 py-2 rounded flex items-center shadow-md transition-colors`}
          onClick={printInvoice}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
          </svg>
          Print Invoice
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default SupermarketBillingApp;