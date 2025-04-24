import React, { useEffect, useState } from 'react';
import Navbar2 from '../pages/Navbar2';
import '../styles/analytics.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import axios from 'axios';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#d0ed57', '#a4de6c', '#8dd1e1', '#83a6ed'];

const Analytics = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [lowStockBooks, setLowStockBooks] = useState([]);

  useEffect(() => {
    axios.get('/api/analytics/top-books').then(res => setTopBooks(res.data));
    axios.get('/api/analytics/orders-per-day').then(res => setOrdersPerDay(res.data));
    axios.get('/api/analytics/genre-distribution').then(res => setGenreData(res.data));
    axios.get('/api/analytics/low-stock').then(res => setLowStockBooks(res.data));
  }, []);

  return (
    <div className="analytics-page">
      <Navbar2 />
      <h1>📊 Analytics Dashboard</h1>

      {/* Top 5 Bestselling Books */}
      <div className="analytics-chart">
        <h2>Top 5 Bestselling Books</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topBooks}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_sold" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Over Time */}
      <div className="analytics-chart">
        <h2>Orders Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ordersPerDay}>
            <XAxis dataKey="order_date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total_orders" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Genre Distribution */}
      <div className="analytics-chart">
        <h2>Genre Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={genreData}
              dataKey="count"
              nameKey="genre"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {genreData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Low Stock Table */}
      <div className="analytics-chart">
        <h2>📉 Low Stock Books</h2>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {lowStockBooks.map(book => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.stock_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
