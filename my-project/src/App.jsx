import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import { SavedCoursesProvider } from './context/SavedCoursesContext';
import { AuthProvider } from './context/AuthContext'; // import auth provider
import PrivateRoute from './components/PrivateRoute'; // import private route
import NptelCourses from "./components/NptelCourses"; 
import CourseraCourses from "./components/CourseraCourses";

function App() {
  return (
    <AuthProvider>
      <SavedCoursesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
<Route
  path="/courses/nptel"
  element={
    <PrivateRoute>
      <div className="flex flex-col min-h-screen w-full">
        <Header />
        <NptelCourses />
      </div>
    </PrivateRoute>
  }
/>
<Route 
  path="/courses/coursera"
  element={
    <PrivateRoute>
      <CourseraCourses />
    </PrivateRoute>
  }
/>
            {/* Protect dashboard route */}
            
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <div className="flex flex-col min-h-screen w-full">
                    <Header />
                    <Dashboard />
                  </div>
                </PrivateRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </SavedCoursesProvider>
    </AuthProvider>
    
  );
}

export default App;
