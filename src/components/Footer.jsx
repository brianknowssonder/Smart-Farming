import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLeaf } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-3">
            <div className="container">
                <div className="row">
                    {/* About */}
                    <div className="col-md-3 mb-4">
                        <h5 className="text-success"><FaLeaf /> SmartFarm</h5>
                        <p>
                            SmartFarm is your intelligent farming companion—monitor crops, weather, and soil in real time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-3 mb-4">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" className="text-white">Dashboard</a></li>
                            <li><a href="/weather" className="text-white">Weather</a></li>
                            <li><a href="/sensors" className="text-white">Sensors</a></li>
                            <li><a href="/contact" className="text-white">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-md-3 mb-4">
                        <h5>Contact Us</h5>
                        <p><FaEnvelope /> support@smartfarm.io</p>
                        <p><FaPhone /> +254 113 252660</p>
                        <p><FaMapMarkerAlt /> Nairobi, Kenya</p>
                    </div>

                    {/* Newsletter & Socials */}
                    <div className="col-md-3 mb-4">
                        <h5>Newsletter</h5>
                        <form>
                            <div className="mb-2">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Your email"
                                />
                            </div>
                            <button type="submit" className="btn btn-success btn-sm">Subscribe</button>
                        </form>
                        <div className="mt-3">
                            <a href="https://facebook.com" className="text-white me-3"><FaFacebookF /></a>
                            <a href="https://instagram.com" className="text-white me-3"><FaInstagram /></a>
                            <a href="https://twitter.com" className="text-white"><FaTwitter /></a>
                        </div>
                    </div>
                </div>

                <hr className="bg-white" />
                <div className="text-center">
                    <p className="mb-0">&copy; 2025 SmartFarm by Brian.M.Mwangi All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
