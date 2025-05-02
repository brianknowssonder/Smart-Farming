import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const SignIn = () => {

  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [loading, setLoading] = useState('');
  let [error, setError] = useState('');
  let navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      setLoading('Loading...');
      setError('');

      const data = new FormData();
      data.append('username', username);
      data.append('password', password);

      const response = await axios.post("https://us3r7777.pythonanywhere.com/api/signin", data);
      
      if (response.data.user) {
        // Include the password in the stored data (be cautious, not ideal for production)
        const userWithPassword = {
          ...response.data.user,
          password: password, // Store password
        };
        localStorage.setItem('user', JSON.stringify(userWithPassword)); // Store in localStorage
        navigate('/'); // Navigate to home or another page
      } else {
        setLoading('');
        setError(response.data.Message);
      }
    } catch (error) {
      setLoading('');
      setError(error.message);
    }
  }

  return (
    <div className="">
      <Navbar />
      <div className="container-fluid">
        <div className="row justify-content-center mt-4">
          <div className="col-md-5 card m-4 bg-success">
            <div className="card-header">
              <h1 className="text-warning">Sign In</h1>
            </div>
            <br />
            <b className="text-warning">{loading}</b>
            <b className="text-danger">{error}</b>

            <form className="mb-2" onSubmit={submitForm}>
              <input onChange={(e) => setUsername(e.target.value)} required type="text" placeholder="Enter Your Username or Email Here: " className="form-control shadow" />
              <br />
              <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter Your Password Here: " required className="form-control shadow" />
              <br />
              <button className="btn btn-outline-warning text-dark " type="submit">Sign In</button> <br />
              <br />
            </form>
            <div className="card-footer text-warning m-2">
              <p>Need An Account? <Link className="text-warning" to='/signup'>Sign Up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
