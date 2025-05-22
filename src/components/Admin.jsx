import React, { useEffect, useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import ChartJS from "chart.js/auto";  // Automatically register Chart.js components
import { saveAs } from 'file-saver'; // For saving the data as a CSV
import Footer from "./Footer";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBalance, setEditingBalance] = useState(null);
  const [newBalance, setNewBalance] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const foundUsers = new Set();
    const userList = [];

    // Fetching users and their balances
    allKeys.forEach((key) => {
      if (key.startsWith("balance_")) {
        const username = key.replace("balance_", "");
        const balance = parseFloat(localStorage.getItem(key)) || 0;
        foundUsers.add(username);
        userList.push({ username, balance });
      }
    });

    // Fallback: Ensure current user is included even if not in the balance keys
    const lastUser = JSON.parse(localStorage.getItem("user"));
    if (lastUser && !foundUsers.has(lastUser.username)) {
      const fallbackBalance =
        parseFloat(localStorage.getItem(`balance_${lastUser.username}`)) || 0;
      userList.push({ username: lastUser.username, balance: fallbackBalance });
    }

    // Remove duplicates and sort users by balance
    const uniqueUsers = Array.from(
      new Map(userList.map((u) => [u.username, u])).values()
    );
    const sortedUsers = uniqueUsers.sort((a, b) => b.balance - a.balance);

    setUsers(sortedUsers);
  }, []);

  // Chart.js data configuration for User Balance Bar Chart
  const data = {
    labels: users.map(user => user.username),
    datasets: [
      {
        label: "User Balance ($)",
        data: users.map(user => user.balance),
        backgroundColor: users.map(user => user.balance > 0 ? "#28a745" : "#dc3545"),
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  // Chart.js data configuration for Balance Trends Line Chart
  const balanceTrendsData = {
    labels: users.map(user => user.username), // You can replace this with actual months/days etc.
    datasets: [
      {
        label: "Balance Trends ($)",
        data: users.map(user => user.balance), // Replace this with time-series balance data if available
        fill: false,
        backgroundColor: "#0dcaf0", // Light blue color
        borderColor: "#0dcaf0", // Light blue color
        borderWidth: 2,
      },
    ],
  };

  // Handle balance editing
  const handleEditBalance = (username) => {
    setEditingBalance(username);
    const currentBalance = localStorage.getItem(`balance_${username}`);
    setNewBalance(currentBalance || "");
  };

  const handleSaveBalance = (username) => {
    localStorage.setItem(`balance_${username}`, newBalance);
    setUsers(
      users.map((user) =>
        user.username === username ? { ...user, balance: parseFloat(newBalance) } : user
      )
    );
    setEditingBalance(null);
    setNewBalance("");
    setNotification(`Balance for ${username} saved successfully!`);
  };

  const handleDeleteUser = (username) => {
    // Deleting user balance from localStorage
    localStorage.removeItem(`balance_${username}`);
    setUsers(users.filter((user) => user.username !== username));
    setNotification(`${username} deleted successfully!`);
  };

  const handleExportCSV = () => {
    const dataToExport = users.map(user => ({
      username: user.username,
      balance: user.balance.toFixed(2),
    }));
    
    const csvRows = [
      ["Username", "Balance ($)"],
      ...dataToExport.map(user => [user.username, user.balance]),
    ];

    const csvData = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, 'user_balances.csv');
  };

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark text-light p-4">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-success">
          <FaLeaf className="me-2 text-warning" style={{ fontSize: "2rem" }} />
          SmartFarm Admin Dashboard
        </h1>
        
      </div>

      <div className="container bg-black p-4 rounded shadow-lg border border-success">
        {/* Search Bar Section */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users by username..."
            className="form-control bg-dark text-success"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderColor: '#28a745',
              color: '#28a745', // Set text color to success green
            }}
          />
        </div>

        {/* User List Section */}
        <div className="mb-4">
          <h2 className="text-center text-success mb-3">User Balances</h2>
          {filteredUsers.length === 0 ? (
            <p className="text-danger text-center">No user data available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered table-dark text-center">
                <thead className="table-success text-dark">
                  <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Balance (Ksh)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr key={idx} className="align-middle">
                      <td className="fw-bold text-warning">#{idx + 1}</td>
                      <td className="text-capitalize">{user.username}</td>
                      <td className="text-info">
                        {editingBalance === user.username ? (
                          <input
                            type="number"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                            className="form-control w-50 mx-auto"
                          />
                        ) : (
                          `Ksh ${user.balance.toFixed(2)}`
                        )}
                      </td>
                      <td>
                        {editingBalance === user.username ? (
                          <button
                            className="btn btn-success"
                            onClick={() => handleSaveBalance(user.username)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="btn btn-success"
                            onClick={() => handleEditBalance(user.username)}
                          >
                            Edit Balance
                          </button>
                        )}
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => handleDeleteUser(user.username)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Export CSV Button */}
        <div className="text-center mb-4">
          <button className="btn btn-warning" onClick={handleExportCSV}>
            Export Data as CSV
          </button>
        </div>

        {/* Chart Section: User Balance Bar Chart */}
        <div className="mb-4">
          <h2 className="text-center text-success mb-3">User Balance Chart</h2>
          <div className="text-center">
            <Bar data={data} options={{ responsive: true }} height={200} />
          </div>
        </div>

        {/* Chart Section: Balance Trends Line Chart */}
        <div className="mb-4">
          <h2 className="text-center text-success mb-3">Balance Trends Chart</h2>
          <div className="text-center">
            <Line data={balanceTrendsData} options={{ responsive: true }} height={200} />
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="alert alert-info text-center" role="alert">
          {notification}
        </div>
      )}

      
      <Footer/>
    </div>
  );
};

export default AdminDashboard;
