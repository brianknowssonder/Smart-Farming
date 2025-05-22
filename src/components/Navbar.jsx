import { Link } from "react-router-dom";
import { FaLeaf } from 'react-icons/fa';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.username?.toLowerCase() === "brian" || user?.username?.toLowerCase() === "carol";

  return (
    <section id="nav" className="row ">
      <div className="col-md-12">
        <div className="navbar navbar-expand-md navbar-light">
          <Link to="/" className="navbar-brand">
            <h1 className="text-success p-3"><FaLeaf /> SmartFarm</h1>
          </Link>
          <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#ivy">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="ivy">
            <div className="navbar-nav">
              {/* Optional future nav items */}
              <div className="nav-item dropdown">
                <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown"></Link>
                <div className="dropdown-menu text-success">
                  <Link className="dropdown-item" to="#">Weather Data</Link>
                  <Link className="dropdown-item" to="#">Crop Data</Link>
                  <Link className="dropdown-item" to="#">Crop Suggestions</Link>
                </div>
              </div>
            </div>

            <div className="navbar-nav ms-auto">
              <Link to="/contact" className="nav-link text-success">Contact Us</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/bank" className="nav-link text-success">Smart Bank</Link>
                  {isAdmin && (
                    <Link to="/admin" className="nav-link text-success">Admin</Link>
                  )}
                  <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </>
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
};

export default Navbar;
