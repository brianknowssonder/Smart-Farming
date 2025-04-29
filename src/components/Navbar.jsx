import { Link } from "react-router-dom";
import { FaLeaf } from 'react-icons/fa';

const Navbar = ({ isLoggedIn, handleLogout }) => {
    return ( 
        <section id='nav' className="row">
            <div className="col-md-12">
                <div className="navbar navbar-expand-md navbar-light">
                  <Link to="/" className="navbar-brand">
                    <h1 className="text-success"><FaLeaf /> SmartFarm</h1>
                  </Link>
                  <button className="navbar-toggler" data-bs-target="#ivy" data-bs-toggle="collapse">
                    <span className="navbar-toggler-icon"></span>
                  </button>

                  <div className="collapse navbar-collapse" id="ivy">
                    <div className="navbar-nav">
                        {/* Future dropdown or nav links */}
                        <div className="nav-item dropdown">
                          <Link to='#' data-bs-toggle='dropdown' className="nav-link dropdown-toggle"></Link>
                          <div className="dropdown-menu text-success">
                            <Link className="dropdown-item" to="#">Weather Data</Link>
                            <Link className="dropdown-item" to="#">Crop Data</Link>
                            <Link className="dropdown-item" to="#">Crop Suggestions</Link>
                          </div>
                        </div>
                    </div>

                    <div className="navbar-nav ms-auto">
                      {isLoggedIn ? (
                        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                      ) : (
                        <>
                          <Link to="/signup" className="nav-link text-success">SignUp</Link>
                          <Link to="/signin" className="nav-link text-success">SignIn</Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
            </div>
        </section>
    );
}

export default Navbar;
