import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import User from "./pages/User";
import Favoris from "./pages/Favoris"
import Register from "./pages/Register";
import MovieDetail from "./pages/MovieDetail";
import About from "./pages/About";


export default function App() {
  return (
    <BrowserRouter>
        <Header /> {/* 🔥 TOUJOURS visible */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/favoris" element={<Favoris />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>

  );
}