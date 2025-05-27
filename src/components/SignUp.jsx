import axios from "axios";

import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";



const SignUp = () => {

    let[username,setUsername] = useState('');
    let[phone,setPhone] = useState('');
    let[email,setEmail] = useState('');
    let[password,setPassword] = useState('');
    let [success,setSuccess] = useState('');
    let[error,setError] = useState('');
    let[loading,setLoading] = useState('');

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            setLoading('Loading...');
            setError('');
            setSuccess('');

            const data = new FormData();
            data.append('username',username);
            data.append('email',email);
            data.append('phone',phone);
            data.append('password',password);

            const response = await axios.post("https://brembo.pythonanywhere.com/api/signup",data)
            setLoading('');
            setSuccess(response.data.Message);

            setUsername('');
            setPhone('');
            setEmail('');
            setPassword('')

        } catch (error) {
            setError('Error,Please Try Again');
            setLoading('');
            
        }
    } 
    return ( 
        <div className="">
            {/* navbar */}
            <Navbar/>
            <div className="container-fluid">
            {/* carousel */}
            <div className="row justify-content-center mt-4">
                <div className="col-md-5 text-dark card m-4 bg-success">
                    <div className="card-header">
                    <h1 className="text-warning">Sign Up</h1>
                    </div>
                    <br />
                    <b className="text-warning">{loading}</b>
                    <b className="text-danger">{error}</b>
                    <b className="text-success">{success}</b>
                <form className="mb-2" onSubmit={submitForm}>
                    <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" required placeholder="Enter Your Username Here: " className=" shadow form-control" /> <br />
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" required placeholder="Enter Your Email Here: " className="shadow form-control" /> <br />
                    <input onChange={(e) => setPhone(e.target.value)} value={phone} type="tel" required placeholder="Enter Your Telephone Number Here: " className="shadow form-control" /> <br />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" required placeholder="Enter Your Password Here:" className="shadow form-control" /> <br />
                    <button className="btn btn-outline-warning text-dark " type="submit">Sign Up</button> <br />
                    
                </form>
                <br />
                <div className="card-footer">
                    <p className="text-warning">
                        Already Have An Account? <Link className="text-warning" to='/signin'>SignIn</Link>
                    </p>
                </div>
                
                </div>
                
            </div>
            </div>
        </div>
     );
}
 
export default SignUp;

