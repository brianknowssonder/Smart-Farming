import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import DashboardComponent from './components/DashboardComponent';
import WeatherComponent from './components/WeatherComponent';
import LocationComponent from './components/Location';
import AdminDashboard from './components/Admin';
import SmartBank from './components/SmartBank';
import SplashScreen from './components/SplashScreen';
import LoanDashboard from './components/LoanDashboard';
import ContactUs from './components/ContactUs';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Splash screen appears first */}
          <Route path="/" element={<SplashScreen />} />
          
          {/* Then redirect to actual dashboard */}
          <Route path="/dashboard" element={<DashboardComponent />} />
          
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/weather" element={<WeatherComponent />} />
          <Route path="/location" element={<LocationComponent />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/bank" element={<SmartBank />} />
          <Route path="/loan" element={<LoanDashboard />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
