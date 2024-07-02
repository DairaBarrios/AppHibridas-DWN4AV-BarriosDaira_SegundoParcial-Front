import axios from 'axios';
import React, {useContext, useState} from 'react';
import {AuthContext} from '../../context/AuthContext';
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';

const Register = () => {
    const [userData, setUserData] = useState({
        email: "",
        nombre: "",
        password: ""
    });
    const [error, setError] = useState("");
    const {setUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3002/users/register", userData)
            .then((res) => {
                console.log(res);
                setUser(res.data.usuario);
                Cookies.set('jwToken', res.data.jwToken, {expires: 10000000});
                navigate('/login');
            })
            .catch((error) => {
                console.log(error);
                setError(error.response.data.message);
            });
    };

    return (
        <div>
            <h1>Registro</h1>
            <form>
                <div>
                    <label>Email</label>
                    <input type="email" value={userData.email}
                           onChange={(e) => setUserData({...userData, email: e.target.value})}/>
                </div>
                <div>
                    <label>Nombre</label>
                    <input type="text" value={userData.nombre}
                           onChange={(e) => setUserData({...userData, nombre: e.target.value})}/>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={userData.password}
                           onChange={(e) => setUserData({...userData, password: e.target.value})}/>
                </div>
                <button onClick={handleRegister}>Registo</button>
            </form>
            {
                error && <p>{error}</p>
            }
        </div>
    );
};

export {Register};
