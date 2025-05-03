import React, { useEffect, useState, useRef } from 'react';
import Navbar2 from '../pages/Navbar2';
import '../styles/orders.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

const Orders = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const ordersRef = useRef();

  useEffect(() => {
    fetch('http://localhost:5000/api/orders/full-orders')
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};
        data.forEach(order => {
          const { order_id } = order;
          if (!grouped[order_id]) grouped[order_id] = [];
          grouped[order_id].push(order);
        });
        setGroupedOrders(grouped);
        setLoading(false);
      });
  }, []);

  const exportToPDF = () => {
    const pdf = new jsPDF();

    Object.entries(groupedOrders).forEach(([orderId, items], index) => {
      if (index > 0) pdf.addPage();

      const { customer_name, phone, address, created_at, discount_code } = items[0];
      const total = items.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);

      pdf.setFontSize(14);
      pdf.text(`Order #${orderId}`, 14, 20);
      pdf.setFontSize(11);
      pdf.text(`Customer: ${customer_name}`, 14, 35);
      pdf.text(`Phone: ${phone}`, 14, 45);
      pdf.text(`Address: ${address}`, 14, 55);
      pdf.text(`Date: ${new Date(created_at).toLocaleDateString()}`, 14, 65);
      pdf.text(`Discount Code: ${discount_code?.trim() ? discount_code : 'N/A'}`, 14, 75);

      const tableData = items.map(item => [
        item.title,
        item.quantity,
        `€${item.price}`,
        `€${(item.quantity * parseFloat(item.price)).toFixed(2)}`
      ]);

      autoTable(pdf, {
        head: [['Title', 'Quantity', 'Price per Book', 'Total']],
        body: tableData,
        startY: 85,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [25, 118, 210] },
      });

      const finalY = pdf.lastAutoTable.finalY + 10;
      pdf.setFontSize(12);
      pdf.setTextColor(211, 47, 47);
      pdf.text(`Order Total: €${total.toFixed(2)}`, 14, finalY);
    });

    pdf.save('customer_orders.pdf');
  };

  return (
    <div className="orders-page">
      <Navbar2 />
      <h1>📦 Customer Orders</h1>

      <button className="export-button" onClick={exportToPDF}>📄 Export to PDF</button>

      <div ref={ordersRef}>
        {loading ? (
          <p>Loading orders...</p>
        ) : Object.keys(groupedOrders).length === 0 ? (
          <p>No orders found.</p>
        ) : (
          Object.entries(groupedOrders).map(([orderId, items]) => {
            const { customer_name, phone, address, created_at, discount_code } = items[0];
            const total = items.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);
            return (
              <div className="order-card" key={orderId}>
                <h2>Order #{orderId}</h2>
                <p><strong>Name:</strong> {customer_name}</p>
                <p><strong>Phone:</strong> {phone}</p>
                <p><strong>Address:</strong> {address}</p>
                <p><strong>Date:</strong> {new Date(created_at).toLocaleDateString()}</p>
                <p><strong>Discount Code:</strong> {discount_code?.trim() ? discount_code : 'N/A'}</p>

                <h3>Books:</h3>
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>
                      <span>{item.title}</span>
                      <span>Qty: {item.quantity}</span>
                    </li>
                  ))}
                </ul>

                <p className="total">Total: €{total.toFixed(2)}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
