import React, {useContext} from "react";
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import "./Navbar.scss"

const Navbar = () => {
    const {user, logoutUser} = useContext(AuthContext);
    console.log(user)
    return (
        <header>
            <h3>{user?.nombre ? "Logged user: " + user.nombre : "logged out"}</h3>
            <nav>
                <ul>
                    {user ? (
                        <>
                            <li>
                                <NavLink to="/">Libros</NavLink>
                            </li>
                            <li>
                                <NavLink to="/autor">Autores</NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => logoutUser()} to="/login">
                                    Logout
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink to="/login">Login</NavLink>
                            </li>
                            <li>
                                <NavLink to="/register">Registro</NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
