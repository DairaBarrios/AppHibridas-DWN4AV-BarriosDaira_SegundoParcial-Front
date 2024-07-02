import './App.scss'
import Navbar from "./components/Navbar/Navbar.jsx";
import {Route, Routes} from "react-router-dom";
import {AutorDetail, AutorHome, Login} from "./pages/index.js";
import {Home, LibroDetail} from "./pages/index.js";
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";
import {Register} from "./pages/Register/Register.jsx";

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route element={<ProtectedRoutes/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/autor" element={<AutorHome/>}/>
                    <Route path="/libros/:id" element={<LibroDetail/>}/>
                    <Route path="/autores/:id" element={<AutorDetail/>}/>
                </Route>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </>
    )
}

export default App
