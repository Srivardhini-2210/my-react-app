// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";


function App() {
  return (
    <BrowserRouter>
     <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/dashboard" element={
    <div className="min-h-screen bg-background">
      <Header />
      <Dashboard />
    </div>
  }/>
  <Route path="/signup" element={<Signup />} />
</Routes>

    </BrowserRouter>
  );
}

export default App;