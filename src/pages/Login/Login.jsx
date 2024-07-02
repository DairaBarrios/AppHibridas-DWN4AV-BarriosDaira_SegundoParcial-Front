import axios from 'axios'
import React, {useContext, useState} from 'react'
import {AuthContext} from '../../context/AuthContext'
import Cookies from 'js-cookie'
import {Link, useNavigate} from 'react-router-dom'

const Login = () => {
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("")
    const {setUser} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3002/users/login", userData)
            .then((res) => {
                console.log(res)
                setUser(res.data.usuario)
                Cookies.set('jwToken', res.data.jwToken, {expires: 10000000})
                navigate('/')
            })
            .catch((error) => {
                console.log(error)
                setError(error.response.data.message)
            })
    }


    return (
        <div>
            <h1>Login</h1>
            <form>
                <div>
                    <label>Email</label>
                    <input type="email" value={userData.email}
                           onChange={(e) => setUserData({...userData, email: e.target.value})}/>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={userData.password}
                           onChange={(e) => setUserData({...userData, password: e.target.value})}/>
                </div>
                <button onClick={handleLogin}>Login</button>
            </form>
            <Link to={'/register'}>Registro</Link>
            {
                error && <p>{error}</p>
            }
        </div>
    )
}

export {Login}