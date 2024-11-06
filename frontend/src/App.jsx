import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './components/dashboard/admindashboard/AdminDashboard';
import StudentDashboard from './components/dashboard/studentdashboard/StudentDashboard';
import { AuthProvider, AuthContext } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer'; 


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </AuthProvider>
  );
}

const Main = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  // const isDashboardRoute = location.pathname.includes('dashboard');

  useEffect(() => {
    // Ensure auth state is ready before rendering.
    if (auth.token === null && localStorage.getItem('auth')) {
      // This block ensures the state is synced correctly
      const savedAuth = JSON.parse(localStorage.getItem('auth'));
      if (savedAuth) {
        auth.setAuth(savedAuth);
      }
    }
  }, [auth]);

  return (
    <>
      {auth.token === null && <Navbar />}
      <div className=''>
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin-dashboard/*" 
              element={
                <ProtectedRoute role={["admin", "teacher"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student-dashboard/*" 
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
       
      </div>
      {!auth.token  ? <Footer /> : null}
    </>
  );
};

export default App;
