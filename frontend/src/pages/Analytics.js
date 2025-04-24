import React, { useEffect, useState } from 'react';
import Navbar2 from '../pages/Navbar2';
import '../styles/analytics.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import axios from 'axios';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const Analytics = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [genreDistribution, setGenreDistribution] = useState([]);
  const [lowStockBooks, setLowStockBooks] = useState([]);

  useEffect(() => {
    axios.get("/api/analytics/top-books").then(res => setTopBooks(res.data));
    axios.get("/api/analytics/orders-per-day").then(res => setOrdersPerDay(res.data));
    axios.get("/api/analytics/genre-distribution").then(res => setGenreDistribution(res.data));
    axios.get("/api/analytics/low-stock").then(res => setLowStockBooks(res.data));
  }, []);

  return (
    <>
      <Navbar2 />
      <div className="analytics-container">
        <h2>📊 Analytics</h2>

        {/* Top 5 Bestselling Books */}
        <div>
          <h3>Top 5 Bestselling Books</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBooks}>
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_sold" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Per Day */}
        <div>
          <h3>Orders Over Time</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersPerDay}>
                <XAxis dataKey="order_date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total_orders" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Distribution */}
        <div>
          <h3>Genre Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreDistribution}
                  dataKey="count"
                  nameKey="genre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {genreDistribution.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Table */}
        <div>
          <h3>Low Stock Books</h3>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {lowStockBooks.length > 0 ? (
                  lowStockBooks.map((book, idx) => (
                    <tr key={idx}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.stock_quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-data">
                      No low stock books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
