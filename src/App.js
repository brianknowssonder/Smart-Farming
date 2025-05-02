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



function App() {
  return (
    <Router>
    <div className="App">
          <Routes>
            <Route path="/" element={<DashboardComponent />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/weather" element={<WeatherComponent />} />
            <Route path="/location" element={<LocationComponent />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/bank" element={<SmartBank />} />

            
          </Routes>
      
    </div>
    </Router>
  );
}

export default App;
