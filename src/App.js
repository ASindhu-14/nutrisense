import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Signup    from "./pages/Signup";
import Login     from "./pages/Login";
import Profile   from "./pages/Profile";
import MealLog   from "./pages/MealLog";
import Pantry    from "./pages/Pantry";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Login />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/profile"   element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meal-log"  element={<MealLog />} />
        <Route path="/pantry"    element={<Pantry />} />
      </Routes>
    </BrowserRouter>
  );
}