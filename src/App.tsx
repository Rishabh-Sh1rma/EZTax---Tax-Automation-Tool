import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TaxCalculator from './pages/TaxCalculator';
import TaxSummary from './pages/TaxSummary';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/calculator" element={<ProtectedRoute><TaxCalculator /></ProtectedRoute>} />
          <Route path="/summary" element={<TaxSummary />} />

        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;