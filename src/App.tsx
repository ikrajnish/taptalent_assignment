import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CityDetails from './pages/CityDetails';
// import Login from './pages/Login'; // Will add later

function App() {
  return (
    <Router>
      <div className="min-h-screen text-slate-100 font-sans">
        <Routes>
           <Route path="/" element={<Dashboard />} />
           <Route path="/city/:cityId" element={<CityDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
