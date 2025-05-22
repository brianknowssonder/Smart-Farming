import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaLeaf } from 'react-icons/fa';
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const SmartBank = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [balance, setBalance] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
      setPassword(user.password);
      setIsLoggedIn(true);

      const savedBalance = parseFloat(localStorage.getItem(`balance_${user.username}`)) || 0;
      setBalance(savedBalance);

      const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${user.username}`)) || [];
      setTransactions(savedTransactions);
    }
  }, []);

  const handleDeposit = () => {
    setLoading(true);
    setTimeout(() => {
      const amount = parseFloat(depositAmount);
      if (amount <= 0) {
        setError('Deposit amount must be greater than zero.');
      } else {
        const newBalance = balance + amount;
        setBalance(newBalance);
        localStorage.setItem(`balance_${username}`, newBalance);

        const newTransaction = {
          type: 'Deposit',
          amount,
          date: new Date().toLocaleString()
        };
        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions);
        localStorage.setItem(`transactions_${username}`, JSON.stringify(updatedTransactions));

        setDepositAmount('');
        setError('');
      }
      setLoading(false);
    }, 1000);
  };

  const handleWithdraw = () => {
    setLoading(true);
    setTimeout(() => {
      const amount = parseFloat(withdrawAmount);
      if (withdrawPassword !== password) {
        setError('Incorrect password confirmation.');
      } else if (amount <= 0) {
        setError('Withdrawal amount must be greater than zero.');
      } else if (amount > balance) {
        setError('Insufficient funds.');
      } else {
        const newBalance = balance - amount;
        setBalance(newBalance);
        localStorage.setItem(`balance_${username}`, newBalance);

        const newTransaction = {
          type: 'Withdraw',
          amount,
          date: new Date().toLocaleString()
        };
        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions);
        localStorage.setItem(`transactions_${username}`, JSON.stringify(updatedTransactions));

        setWithdrawAmount('');
        setWithdrawPassword('');
        setError('');
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem(`balance_${username}`);
    localStorage.removeItem(`transactions_${username}`);
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setBalance(0);
    setDepositAmount('');
    setWithdrawAmount('');
    setWithdrawPassword('');
    setTransactions([]);
    setError('');
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="bg-dark">
      <div className="container my-4 bg-dark">
        <h1 className="text-center mb-4 text-success">
          <FaLeaf className="me-2" />
          Smart Bank
        </h1>

        <div className="row justify-content-center">
          <div className="col-md-6 card p-4 shadow-sm border-0">
            <div className="card-body">
              {!isLoggedIn ? (
                <>
                  <h4 className="card-title text-center mb-3 text-success">Login</h4>
                  <div className="form-group mb-3">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                  </div>
                  <button
                    className="btn btn-outline-success w-100"
                    onClick={() => {}}
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                  </button>
                </>
              ) : (
                <>
                  <h4 className="text-center text-success mb-3">Welcome, {username}</h4>
                  <div className="text-center mb-3">
                    <h5 className="text-success">Balance: Ksh {balance.toFixed(2)}</h5>
                  </div>

                  {/* Deposit */}
                  <div className="form-group mb-3">
                    <label htmlFor="depositAmount">Deposit Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      id="depositAmount"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                    <button
                      className="btn btn-outline-success w-100 mt-2"
                      onClick={handleDeposit}
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : 'Deposit'}
                    </button>
                  </div>

                  {/* Withdraw */}
                  <div className="form-group mb-3">
                    <label htmlFor="withdrawAmount">Withdraw Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      id="withdrawAmount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="withdrawPassword">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="withdrawPassword"
                      value={withdrawPassword}
                      onChange={(e) => setWithdrawPassword(e.target.value)}
                      placeholder="Re-enter your password"
                    />
                  </div>

                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={handleWithdraw}
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Withdraw'}
                  </button>

                  {/* Transaction History */}
                  <div className="mt-4">
                    <h5 className="text-success">Transaction History</h5>
                    <ul className="list-group">
                      {transactions.length === 0 ? (
                        <li className="list-group-item">No transactions yet.</li>
                      ) : (
                        transactions.slice().reverse().map((tx, index) => (
                          <li key={index} className={`list-group-item ${tx.type === 'Deposit' ? 'text-success' : 'text-danger'}`}>
                            <strong>{tx.type}:</strong> ${tx.amount} <br />
                            <small>{tx.date}</small>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  <button
                    className="btn btn-outline-secondary w-100 mt-4"
                    onClick={handleBackClick}
                  >
                    Back
                  </button>
                  
                </>
              )}

              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
        <hr />
        <Footer />
      </div>
    </div>
  );
};

export default SmartBank;
