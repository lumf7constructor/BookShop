import React, { useEffect, useState } from 'react';
import Navbar2 from '../pages/Navbar2';
import '../styles/analytics.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts';
import axios from 'axios';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const Analytics = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [genreDistribution, setGenreDistribution] = useState([]);
  const [lowStockBooks, setLowStockBooks] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          topBooksRes,
          ordersRes,
          genreRes,
          stockRes,
          revenueRes
        ] = await Promise.all([
          axios.get("/api/analytics/top-books"),
          axios.get("/api/analytics/orders-per-day"),
          axios.get("/api/analytics/genre-distribution"),
          axios.get("/api/analytics/low-stock"),
          axios.get("/api/analytics/monthly-revenue")
        ]);

        setTopBooks(topBooksRes.data);
        setOrdersPerDay(ordersRes.data);
        setGenreDistribution(genreRes.data);
        setLowStockBooks(stockRes.data);
        setMonthlyRevenue(revenueRes.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar2 />
      <div className="analytics-container">
        <h2>📊 Analytics Dashboard</h2>

        {/* Monthly Revenue */}
      <div className="chart-section">
        <h3>Monthly Revenue</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `€${Number(value).toFixed(2)}`}
              />
              <Tooltip 
                formatter={(value) => [`€${Number(value).toFixed(2)}`, "Revenue"]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="total_revenue" 
                fill="#82ca9d" 
                name="Revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

        {/* Top 5 Bestselling Books */}
        <div className="chart-section">
          <h3>Top 5 Bestselling Books</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBooks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_sold" fill="#8884d8" name="Books Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Over Time */}
        <div className="chart-section">
          <h3>Orders Over Time</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="order_date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total_orders" 
                  stroke="#82ca9d" 
                  name="Orders"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="chart-section">
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
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {genreDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="chart-section">
          <h3>Low Stock Alert</h3>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockBooks.length > 0 ? (
                  lowStockBooks.map((book) => (
                    <tr key={book.book_id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.stock_quantity}</td>
                      <td>
                        <span className={`status-badge ${
                          book.stock_quantity <= 5 ? 'critical' : 'warning'
                        }`}>
                          {book.stock_quantity <= 5 ? 'Critical' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No low stock books found
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