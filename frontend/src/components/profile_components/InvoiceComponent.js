import React from 'react';
import logo from '../../static/img/logo-removebg.png'
const InvoiceGenerator = ({ order }) => {
  const invoiceData = {
    invoiceNumber: order.id,
    invoiceDate: new Date(order.created_at).toLocaleDateString(),
    customerName: `${order.order_id__user_id__first_name} ${order.order_id__user_id__last_name}`,
    customerEmail: order.order_id__user_id__email,
    customerAddress: `${order.order_id__address_id__street_address}, ${order.order_id__address_id__apartment_address}, ${order.order_id__address_id__city}, ${order.order_id__address_id__state}, ${order.order_id__address_id__country}`,
    items: order.product_id__name,
    quantity: order.quantity,
    price: order.price,
    subtotal: order.total_product_price,
    discount: order.price - order.total_product_price,
    shipping: order.order_id__address_id__postal_code,
    tax: 18,
    total: order.price,
    phone:order.order_id__user_id__phone
  };

  const handlePrint = () => {
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <div style="padding: 20px; background-color: #f5f5f5; width: 800px; margin: auto;">
        <h1>Invoice</h1>
        <div style="margin-bottom: 20px;">
          <h3><img src=${logo} Datefull private lt</h3>
          <p>1234 Orchard St, Healthy City, CA 12345</p>
          <p>Email: support@Datefull.com</p>
        </div>

        <div>
          <strong>Invoice #: </strong>${invoiceData.invoiceNumber}<br />
          <strong>Date: </strong>${invoiceData.invoiceDate}<br />
          <strong>Due Date: </strong>Upon receipt
        </div>

        <div style="margin-top: 20px;">
          <h3>Bill To:</h3>
          <p><strong>${invoiceData.customerName}</strong></p>
          <p>${invoiceData.customerAddress}</p>
          <p>${invoiceData.customerEmail}</p>
          <p>${invoiceData.phone}</p>
        </div>

        <table width="100%" border="1" cellPadding="10" cellSpacing="0" style="margin-top: 20px;">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${invoiceData.items}</td>
              <td>${invoiceData.quantity}</td>
              <td>$${invoiceData.price.toFixed(2)}</td>
              <td>$${(invoiceData.quantity * invoiceData.price).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right;">
          <p><strong>Subtotal:</strong> $${invoiceData.subtotal.toFixed(2)}</p>
          <p><strong>Discount:</strong> -$${invoiceData.discount.toFixed(2)}</p>
          <p><strong>Shipping (Postal Code):</strong> ${invoiceData.shipping}</p>
          <p><strong>Tax (18%):</strong> $${(invoiceData.subtotal * (invoiceData.tax / 100)).toFixed(2)}</p>
          <p><strong>Total Amount Due:</strong> $${invoiceData.total.toFixed(2)}</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Invoice</title></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <button 
        onClick={handlePrint}
        style={{
          padding: '4px 9px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Print Invoice
      </button>
    </div>
  );
};

export default InvoiceGenerator;